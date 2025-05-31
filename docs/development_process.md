# TutorXpert Progress Report

## 📌 Overview

**TutorXpert** is a web platform that connects students with nearby part-time tutors.  
It supports location-based matching, personalized profiles, and interactive task discovery.

Key concepts:  
- 📍 Map-based local matching  
- 👤 Transparent tutor/student profiles  
- ✏️ Task posting and viewing workflows  

---

## ✅ Features Completed

### 👥 User System

- ✅ Role-based registration: `Student` / `Tutor`  
- ✅ Personalized dashboard after login  
- ✅ Profile editing: name, contact, education, subjects  
- ✅ Backend-integrated profile update and storage  

⛏️ Work: UI forms, backend models (`User`, `Profile`), role logic, data sync  

---

### 📝 Task Posting (Student Side)

- ✅ Post tasks with title, subject, budget, deadline, location  
- ✅ Auto timestamp (`posted_date`), geo-coordinates saved  
- ✅ Data stored in PostgreSQL, immediately visible on tutor side  

⛏️ Work: Frontend form, API integration, schema with timestamp + coordinates  

---

### 🗺️ Task Discovery (Tutor Side)

- ✅ Map-based view of nearby tasks  
- ✅ Live filter by map boundary + subject  
- ✅ Task list and detail page routing  

⛏️ Work: Mapbox integration, dynamic API query, frontend routing  

---

### 🔍 Tutor Discovery (Student Side)

- ✅ View tutors on map with filter by subject/location  
- ✅ Tutor cards with summary info  
- ✅ Detailed tutor profile page  

⛏️ Work: Filter logic, reusable components, page linking  

---

### 🛠️ Backend & Data Integration

- ✅ PostgreSQL schema: `User`, `Profile`, `Task`  
- ✅ `posted_date` auto-managed by database  
- ✅ FastAPI with full Pydantic validation  
- ✅ Tested with multiple sample entries  

---

## Functional Flow Currently Supported

Student: Register → Edit Profile → Post Task → View Tutors  
Tutor: Register → Edit Profile → View Tasks → View Details  

The platform now supports the full content flow from posting to discovery, for both students and tutors.

---

## Key Features Still Needed for Matching

To enable full interaction between students and tutors, the following features are planned:

1. Task Application System  
Tutors cannot yet apply to tasks. Planned: tutors submit applications, students review and accept applicants.

2. Communication Channel  
No contact method currently exists between users. Planned: show contact info after match or build a basic messaging feature.

3. Task Status Updates  
Tasks cannot change state. Planned flow: Open → In Progress → Completed.

4. Time Scheduling  
Tutors do not specify available times. Planned: tutors select availability blocks; students book accordingly.

5. Reviews and Ratings  
No feedback system implemented. Planned: allow students to rate and review tutors after completion.

---

## Work Summary (What Has Been Built)

| Component                  | Status    | Description                                          |
|----------------------------|-----------|------------------------------------------------------|
| User registration & roles  | Done      | Supports student/tutor roles                         |
| Profile editing            | Done      | Includes education, contact info, and subjects       |
| Task creation              | Done      | Students can post tasks with map/location info       |
| Task map filtering         | Done      | Tutors view tasks within map bounds + subject filter |
| Task detail pages          | Done      | Each task has a full page view                       |
| Tutor discovery            | Done      | Students can browse tutors with filters              |
| Data schema validation     | Done      | Backend handles datetime, floats, strings, etc.      |
| Database integration       | Done      | PostgreSQL used with sample task data preloaded      |

All listed modules were designed, implemented, and tested by a single developer. This includes both frontend and backend systems.

---

## Roadmap

| Priority | Feature                     | Description                                      |
|----------|-----------------------------|--------------------------------------------------|
| High     | Task application flow       | Tutors apply to tasks; students accept/reject    |
| High     | Messaging or contact access | Allow contact after task match                   |
| Medium   | Task status transitions     | Let users mark tasks as in-progress or completed |
| Medium   | Scheduling availability     | Tutors define time slots                         |
| Low      | Ratings & feedback          | Students leave reviews after task completion     |
| Low      | UI polish & validations     | Improve input validation and interface flow      |

---

## Highlights

Full-stack development across frontend (React) and backend (FastAPI)  
Database schema designed using PostgreSQL  
Geolocation-based filtering logic implemented for map components  
Tested task creation, discovery, and user interactions thoroughly  
Resolved frontend-backend compatibility issues (e.g., datetime formats, API validation)  

---

## Conclusion

TutorXpert currently supports:
Core user workflows (register → post → browse)  
Map-based task and tutor discovery  
Clean data integration with functional UI and sample data  

The platform is now ready for demonstration and further development. The next stage will focus on enabling tutor-student interaction and completing the full matching lifecycle.
