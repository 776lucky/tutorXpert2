from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from pydantic import BaseModel
from app.dependencies import get_current_user
from datetime import datetime
from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy.orm import joinedload


class TaskStatusUpdate(BaseModel):
    status: str  # "In Progress" or "Completed"
    tutor_id: int = None  # 仅在 status = "In Progress" 时需要

router = APIRouter(tags=["tasks"])
print("✅ task.py loaded")

# ✅ 地图边界筛选任务列表
@router.get("/tasks/search", response_model=List[schemas.TaskOut])
def search_tasks_by_bounds(
    north: float = Query(...),
    south: float = Query(...),
    east: float = Query(...),
    west: float = Query(...),
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Task).filter(
        models.Task.lat <= north,
        models.Task.lat >= south,
        models.Task.lng <= east,
        models.Task.lng >= west,
    )

    if subject:
        query = query.filter(models.Task.subject.ilike(f"%{subject}%"))

    return query.all()



# ✅ 加这个
@router.get("/tasks/my_tasks", response_model=List[schemas.TaskOut])
def get_my_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()


# ✅ 根据 task_id 返回任务详情
@router.get("/tasks/{task_id}", response_model=schemas.TaskOut)
def get_task_by_id(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_task = models.Task(
        title=task.title,
        subject=task.subject,
        description=task.description,
        address=task.address,
        lat=task.lat,
        lng=task.lng,
        budget=task.budget,
        deadline=task.deadline,
        status="Open",
        user_id=current_user.id,
        posted_by=f"{current_user.profile.first_name} {current_user.profile.last_name}",
        posted_date=datetime.utcnow()
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.post("/task_applications", response_model=schemas.TaskApplicationOut)
def create_task_application(application: schemas.TaskApplicationCreate, db: Session = Depends(get_db)):
    # 检查是否重复申请
    existing = db.query(models.TaskApplication).filter_by(
        task_id=application.task_id,
        tutor_id=application.tutor_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this task.")

    # ✅ 添加 message
    new_app = models.TaskApplication(
        task_id=application.task_id,
        tutor_id=application.tutor_id,
        message=application.message,
        bid_amount=application.bid_amount  # 保存竞价
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@router.get("/my_applications", response_model=List[schemas.TaskApplicationSimple])
def get_my_applications(tutor_id: int, db: Session = Depends(get_db)):
    applications = db.query(models.TaskApplication).filter_by(tutor_id=tutor_id).all()
    return applications


# 学生查看某个任务收到的所有申请（含 tutor 信息）

@router.get("/tasks/{task_id}/applications", response_model=List[schemas.TaskApplicationWithTutorOut])
def get_applications_for_task(task_id: int, db: Session = Depends(get_db)):
    apps = (
        db.query(models.TaskApplication)
        .filter(models.TaskApplication.task_id == task_id)
        .options(
            joinedload(models.TaskApplication.tutor).joinedload(models.User.profile)  # 加载嵌套 profile
        )
        .all()
    )
    return apps


# 学生对申请做出决策（accept / reject）
@router.post("/tasks/applications/{application_id}/decision")
def decide_application(application_id: int, decision: dict, db: Session = Depends(get_db)):
    app = db.query(models.TaskApplication).filter_by(id=application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if decision["decision"] == "accept":
        app.status = "accepted"
        app.task.status = "in_progress"

        # 拒绝其他所有申请
        db.query(models.TaskApplication).filter(
            models.TaskApplication.task_id == app.task_id,
            models.TaskApplication.id != application_id
        ).update({"status": "rejected"})

    elif decision["decision"] == "reject":
        app.status = "rejected"

    else:
        raise HTTPException(status_code=400, detail="Invalid decision")

    db.commit()
    return {"message": f"Application {decision['decision']}ed"}




@router.get("/tutor/applied_tasks", response_model=List[schemas.TaskWithApplicationStatus])
def get_applied_tasks(tutor_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(models.Task, models.TaskApplication.status)
        .join(models.TaskApplication, models.Task.id == models.TaskApplication.task_id)
        .filter(models.TaskApplication.tutor_id == tutor_id)
        .all()
    )

    output = []
    for task, status in results:
        output.append({
            "id": task.id,
            "title": task.title,
            "subject": task.subject,
            "budget": task.budget,
            "deadline": task.deadline,
            "status": status
        })
    return output


@router.patch("/tasks/{task_id}/status")
def update_task_status(task_id: int, data: TaskStatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    if data.status == "In Progress":
        if task.status != "Open":
            raise HTTPException(status_code=400, detail="Only Open tasks can be moved to In Progress")
        if data.tutor_id is None:
            raise HTTPException(status_code=400, detail="tutor_id is required to start task")
        task.status = "In Progress"
        task.accepted_tutor_id = data.tutor_id

    elif data.status == "Completed":
        if task.status != "In Progress":
            raise HTTPException(status_code=400, detail="Only In Progress tasks can be marked as Completed")
        task.status = "Completed"

    else:
        raise HTTPException(status_code=400, detail="Invalid status")

    db.commit()
    db.refresh(task)
    return {
        "task_id": task.id,
        "new_status": task.status,
        "accepted_tutor_id": task.accepted_tutor_id,
    }





@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}


@router.post("/tasks/applications/{application_id}/decision")
def decide_application(
    application_id: int,
    decision: schemas.ApplicationDecision,
    db: Session = Depends(get_db)
):
    app = db.query(models.TaskApplication).filter_by(id=application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if app.status != "pending":
        raise HTTPException(status_code=400, detail="This application has already been processed.")

    task = db.query(models.Task).filter_by(id=app.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Associated task not found")

    if decision.decision == "accept":
        app.status = "accepted"
        task.status = "in_progress"
        task.accepted_tutor_id = app.tutor_id  # 若你有此字段

        # 拒绝所有同任务下的其他申请
        db.query(models.TaskApplication).filter(
            models.TaskApplication.task_id == app.task_id,
            models.TaskApplication.id != application_id,
            models.TaskApplication.status == "pending"
        ).update({"status": "rejected"}, synchronize_session=False)

    elif decision.decision == "reject":
        app.status = "rejected"

    db.commit()
    return {"message": f"Application has been {decision.decision}ed."}