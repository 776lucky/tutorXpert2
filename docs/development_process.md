# TutorXpert Progress Report

## 📌 Project Overview

**TutorXpert** is a web-based platform that connects students with local part-time tutors. It enables students to post tutoring requests and allows tutors to discover those requests based on subject expertise and geographical proximity.

The platform emphasizes:
- Local matching (map-based filtering)
- Transparent user profiles
- Efficient posting and browsing of tutoring opportunities

---

## ✅ Core Features Fully Implemented

> All features below are fully developed and tested, with frontend, backend, and database connected. All development work is done independently by the developer.

### 1.  User System
- Supports **two user roles**: `Student` and `Tutor`
- Users can **register, log in, and edit their profiles**
- Profile includes:
  - Full name, contact number, address
  - Education level and major
  - Subject expertise and personal introduction

---

### 2.  Task Posting (for Students)
- Students can **create tutoring tasks** including:
  - Subject, description, budget, location (address + map), deadline
- Each task is linked to the student who posted it
- The system automatically records **posting time (`posted_date`)**
- Tasks are stored in the central PostgreSQL database

---

### 3.  Task Discovery (for Tutors)
- Tutors can browse **student tasks on an interactive map**
- Map filters results based on:
  - Current map boundaries
  - Optional subject keywords
- Tasks are clickable to view **detailed descriptions and metadata**

---

### 4.  Tutor Discovery (for Students)
- Students can browse tutors via **map-based view**
- Tutors are filterable by:
  - Subject
  - Geographic location
- Clicking a tutor opens a **profile detail page** with qualifications and background

---

### 5.  Backend & Database Implementation
- All data (users, profiles, tasks) stored in **PostgreSQL**
- Backend developed using **FastAPI**
- Data schemas fully validated
- Timezones and map coordinates handled properly
- Multiple sample tasks inserted and used for testing

---

##  Functional Flow Currently Supported

| Role     | Actions Available                                   |
|----------|-----------------------------------------------------|
| Student  | Register → Edit Profile → Post Task → View Tutors   |
| Tutor    | Register → Edit Profile → View Tasks → View Details |

The platform now supports the **full content flow from posting to discovery**, for both students and tutors.

---

##  Key Features Still Needed for Matching

To support full interaction between students and tutors, the following features are needed:

### 1. Task Application System
- ❌ Tutors cannot yet "apply" to a task
- 🔜 Planned: Tutors can submit applications; students can view applicants

### 2. Communication Channel
- ❌ No contact between tutors and students
- 🔜 Planned:
  - Show contact info after matching
  - Optionally add a lightweight chat/messaging feature

### 3. Task Status Updates
- ❌ No way to update a task's progress
- 🔜 Planned flow: `Open` → `In Progress` → `Completed`

### 4. Time Scheduling
- ❌ No support for booking time slots
- 🔜 Planned: Tutors indicate available time ranges; students select from them

### 5. Reviews and Ratings
- ❌ No feedback mechanism yet
- 🔜 Planned: Students can rate tutors and leave public reviews

---

## 📂 Work Summary (What Has Been Built)

| Component                  | Status    | Description                                          |
|----------------------------|-----------|------------------------------------------------------|
| User registration & roles  | ✅ Done   | Supports student/tutor roles                         |
| Profile editing            | ✅ Done   | Includes education, contact info, and subjects       |
| Task creation              | ✅ Done   | Students can post tasks with map/location info       |
| Task map filtering         | ✅ Done   | Tutors view tasks within map bounds + subject filter |
| Task detail pages          | ✅ Done   | Each task has a full page view                       |
| Tutor discovery            | ✅ Done   | Students can browse tutors with filters              |
| Data schema validation     | ✅ Done   | Backend handles datetime, floats, strings, etc.      |
| Database integration       | ✅ Done   | PostgreSQL used with sample task data preloaded      |

> 💡 All listed modules were designed, implemented, and tested **by a single developer**. This includes both frontend and backend code.

---

##  Roadmap (Next Priorities)

| Priority | Feature                     | Description                                      |
|----------|-----------------------------|--------------------------------------------------|
| 🔺 High  | Task application flow       | Tutors apply to tasks; students accept/reject    |
| 🔺 High  | Messaging or contact access | Allow contact after task match                   |
| 🔸 Medium| Task status transitions     | Let users mark tasks as in-progress or completed |
| 🔸 Medium| Scheduling availability     | Tutors define time slots                         |
| 🔹 Low   | Ratings & feedback          | Students leave reviews after task completion     |
| 🔹 Low   | UI polish & validations     | Improve input validation and interface flow      |

---

##  Developer Contribution & Effort Highlights

-  **Full-stack development** across frontend (React) and backend (FastAPI)
-  Designed **entire database schema** using PostgreSQL
-  Implemented **geolocation-based filtering logic** for map components
-  Thoroughly tested task creation, discovery, and user flows
-  Debugged cross-system compatibility (e.g., datetime serialization, SQL defaults)

---

## ✅ Conclusion

TutorXpert already supports:
- Core user flows (register → post → discover)
- Interactive map-based filtering
- Clean data integration with real task samples

The platform is **functionally ready for live demonstrations**. The next phase will focus on enabling interaction and booking between students and tutors, completing the full matching lifecycle.

