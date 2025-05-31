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

## Work Summary

| Component                        | Status    | Description                                                  |
|----------------------------------|-----------|--------------------------------------------------------------|
| User registration & roles        | Done      | Role-based login flow for students and tutors                |
| Profile editing                  | Done      | Editable profile with name, contact, education, and subjects |
| Task creation                    | Done      | Task form with subject, budget, deadline, and geolocation    |
| Task map filtering               | Done      | Tutors filter tasks using map bounds + subject keywords      |
| Task detail pages                | Done      | Full-page task view with all information displayed           |
| Tutor discovery                  | Done      | Students browse tutors by map and subject filter             |
| Data schema validation           | Done      | Pydantic + SQLAlchemy ensure type-safe, validated data       |
| Database integration             | Done      | PostgreSQL with normalized models and foreign keys           |
| Map integration (Tasks & Tutors) | Done      | Interactive map views with dynamic pin updates               |
| Geolocation-based queries        | Done      | Backend handles lat/lng bounding box queries for filtering   |
| Datetime & timezone handling     | Done      | Task timestamps auto-managed; compatible with API responses  |
| Sample data population           | Done      | Pre-filled realistic task and tutor entries for testing/demo |
| Frontend routing & navigation    | Done      | Page transitions for tasks, tutors, and profile views        |
| API testing & debugging          | Done      | Manual validation of all endpoints with real data            |
| UI component design              | Done      | Reusable cards, input fields, and layout elements            |
| Form validation & feedback       | Done      | Frontend-level checks with user-friendly error messages      |

All modules were designed, developed, and tested independently by the same developer, across both frontend and backend layers. Work covers full-stack integration, business logic, and production-level data modeling.


---

## 📌 Roadmap

| Priority | Feature                     | Description                                      |
|----------|-----------------------------|--------------------------------------------------|
| 🔴 High  | Task application flow       | Tutors apply to tasks; students review/respond   |
| 🔴 High  | Messaging or contact access | Unlock contact info or enable simple messaging   |
| 🟠 Medium| Task status transitions     | Task status flows: Open → In Progress → Completed|
| 🟠 Medium| Scheduling availability     | Tutors define available time slots; students book|
| 🟢 Low   | Ratings & feedback          | Students leave reviews after task completion     |
| 🟢 Low   | UI polish & validations     | Improve input feedback and frontend UX           |

---

## 🔧 Highlights

- ✅ Full-stack development using React (frontend) and FastAPI (backend)  
- ✅ Schema modeling and database integration with PostgreSQL  
- ✅ Dynamic map-based filtering and geolocation querying implemented  
- ✅ Strong data validation and error handling across all layers  
- ✅ All system modules designed, coded, and tested by one developer  

---

## 📈 Conclusion

TutorXpert currently supports:

- ✅ Core user flow from registration to task and tutor discovery  
- ✅ Map-based, interactive experience for browsing nearby tasks or tutors  
- ✅ Stable integration of frontend, backend, and PostgreSQL database  

The platform is now ready for demonstration.  
The next development phase will focus on enabling direct tutor-student interaction, bookings, and a complete task lifecycle experience.
