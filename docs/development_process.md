# TutorXpert Progress Report

## 📌 Project Overview

**TutorXpert** is a web-based platform that connects students with local part-time tutors. It enables students to post tutoring requests and allows tutors to discover those requests based on subject expertise and geographical proximity.

The platform emphasizes:
- Local matching (map-based filtering)
- Transparent user profiles
- Efficient posting and browsing of tutoring opportunities

---
## ✅ Core Features Fully Implemented (with User Experience Focus)








# TutorXpert Progress Report

## Project Overview

TutorXpert is a web-based platform that connects students with local part-time tutors. It enables students to post tutoring requests and allows tutors to discover those requests based on subject expertise and geographical proximity.

The platform emphasizes:
Local matching (map-based filtering)  
Transparent user profiles  
Efficient posting and browsing of tutoring opportunities  

---

## Core Features Fully Implemented (User Experience Focus)

The following modules are fully functional and tested, covering both frontend interface and backend infrastructure. All work was independently implemented by the developer.

### 1. User System — Registration, Login, and Profile Management

Users can register as either a student or a tutor. After logging in, they are redirected to a personalized dashboard. Each user has a profile page showing their full name, phone number, address, education background (degree and major), and a brief introduction or teaching experience.

Users can edit their profile, and updates are stored in the backend. Profile data is displayed in task and tutor listings and used in search and matching.

This module involved designing UI forms, validating inputs, creating backend models (User, Profile), securing password storage, and integrating all components across frontend, backend, and database.

### 2. Task Posting — Creating Tutoring Requests (Student Side)

Students can post tasks by filling in a form with title, subject, description, budget, deadline, and location (address + map coordinates). Each task is linked to the student who posted it and automatically timestamped.

Tasks are saved to the database and become instantly visible on the tutor map. This feature required frontend form development, backend schema design, datetime and coordinate handling, and full API integration.

### 3. Task Discovery — Browse Tasks by Location (Tutor Side)

Tutors can view student tasks on an interactive map. As they move or zoom the map, the list of visible tasks updates in real time. Each task appears both as a map pin and a card in the sidebar.

Clicking a task opens a detail view showing subject, description, location, deadline, and poster information. This feature required implementing spatial filtering logic, card components, routing, and backend geolocation search.

### 4. Tutor Discovery — Map-Based Tutor Search (Student Side)

Students can explore tutors via a map interface, filtering by subject and location. Each tutor is shown on the map with a summary card, including qualifications and subject tags. Clicking the card leads to a detailed profile view.

This module involved reusable components, subject-based filtering, and linking map selections to dynamic routing and profile rendering.

### 5. Backend and Database Integration

All data is stored in a PostgreSQL database with normalized schema. Tasks are linked to users through foreign keys, and timestamps (e.g. posted_date) are automatically managed by the server.

The backend was developed using FastAPI with SQLAlchemy ORM. All endpoints were tested with realistic sample data to ensure data consistency and type safety.

---

In summary, all major end-user interactions — from account creation to posting, browsing, and viewing tutoring tasks or profiles — are fully developed. These workflows provide the foundation for meaningful tutor-student connections.

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

## Roadmap (Next Priorities)

| Priority | Feature                     | Description                                      |
|----------|-----------------------------|--------------------------------------------------|
| High     | Task application flow       | Tutors apply to tasks; students accept/reject    |
| High     | Messaging or contact access | Allow contact after task match                   |
| Medium   | Task status transitions     | Let users mark tasks as in-progress or completed |
| Medium   | Scheduling availability     | Tutors define time slots                         |
| Low      | Ratings & feedback          | Students leave reviews after task completion     |
| Low      | UI polish & validations     | Improve input validation and interface flow      |

---

## Developer Contribution & Effort Highlights

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
