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

### 🔒 Anti-Bypass Safeguards

- ✅ Prevent students and tutors from bypassing the platform for direct transactions
- ✅ Message system filters phone numbers, emails, and social handles 
- ✅ Regex-based backend validation blocks contact info in messages
- ✅ Frontend alerts users when restricted content is detected
- ✅ Tested with multiple sample entries  

---

### ✉️ Messaging System (Beta)

- ✅ Students can initiate messages to tutors from tutor cards
- ✅ Chat UI includes message thread and message input
- ✅ Messages are stored in database with sender/receiver roles
- ✅ Tutor dashboard displays incoming conversations

⛏️ Work: Message data model, FastAPI routing, front-end dialogue components and navigation jumps

---

### 📌 Task Application Flow (Tutor Side)

- ✅ Tutors can browse student-posted tasks with filters and map view
- ✅ Click **Apply Now** to submit application for a specific task
- ✅ Applications are stored in `task_applications` table with status tracking
- ✅ Prevents duplicate applications from the same tutor
- ✅ Dashboard → My Listings shows tasks tutor has applied to (live from DB)

---

### 🛠️ Backend & Data Integration

- ✅ PostgreSQL schema: `users`, `profile`, `tasks`, `task_applications`, `messages`
- ✅ FastAPI with full Pydantic validation  
- ✅ Role-based access checks in both frontend and backend

---

### 🚀 Deployment & Hosting

- ✅ Frontend hosted on Render: `https://tutorxpert-frontend.onrender.com`
- ✅ Backend hosted on Render: `https://tutorxpert-backend-9qxd.onrender.com`
- ✅ CORS configured via FastAPI middleware


## 🧭 Functional Flow Currently Supported

**Student Flow:**  
1. Register as a student
2. Edit Profile: Fill in name, education, contact, subjects, etc.
3. Post Task: Provide task details: title, subject, budget, address, coordinates, and deadline
4. Browse Tutors on the map-based Tutor Discovery page
5. Contact Tutor by sending a message
6. Receive Applications from tutors for posted tasks (planned: review/respond)

**Tutor Flow:**  
1. Register as a tutor
2. Edit Profile with relevant info and subjects
3. Browse Available Tasks using filters and map view
4. Apply to Task by clicking “Apply Now”
5. Track Applications under "My Listings" dashboard view
6. Message Student (if messaging module is used/enabled)



The platform currently supports the **complete flow from task posting to discovery**, for both students and tutors.

---

## 📌 Key Features

To enable full two-way interaction between students and tutors, the following features are planned:

### 💬 Messages
Student can send message to tutor now
Planned: Design tutor message function, and prevent tutor students from leaving the platform to receive orders (IMPORTANT!!)

### 🔄 Tasks
Student can post tasks
Tutor can apply tasks, and can see applied tasks in -->dashboard-->MyListings
Planned: Enable transitions such as `Open → In Progress → Completed`.

### 📅 Time Scheduling  
Tutors cannot define availability.  
Planned: Tutors select time blocks → Students choose/book accordingly.

### ⭐ Reviews and Ratings  
No feedback mechanism in place.  
Planned: Allow students to rate and review tutors after task completion.

---

## Work Summary

## Work Summary

| Component                        | Status | Description                                                |
|----------------------------------|--------|------------------------------------------------------------|
| User registration & roles        | ✅     | Role-based login flow for students and tutors              |
| Profile editing                  | ✅     | User info update: name, education, contact, subjects       |
| Task creation & listing          | ✅     | Students post tasks with subject, budget, location, deadline |
| Task discovery & filtering       | ✅     | Tutors browse/filter tasks by subject + map boundary       |
| Tutor discovery                  | ✅     | Students browse tutors via subject + location filter       |
| Task detail page                 | ✅     | Dedicated page with full task info                         |
| Application flow (tutor)         | ✅     | Tutors apply to tasks; duplicates prevented                |
| Messaging system (student→tutor) | ✅     | Students initiate chat; stored in DB                       |
| Database & schema validation     | ✅     | PostgreSQL with Pydantic/SQLAlchemy                        |
| Geolocation & map integration    | ✅     | Location-aware search for tasks/tutors                     |
| Frontend UI & navigation         | ✅     | Routed pages, reusable components, and map-based UI        |
| Form handling & feedback         | ✅     | Input validation with user-friendly error messages         |

> All modules were designed, developed, and tested independently by the same developer, across both frontend and backend layers. Work covers full-stack integration, business logic, and production-level data modeling.


---

## 📌 Roadmap

| Priority | Feature                     | Description                                                  |
|----------|-----------------------------|--------------------------------------------------------------|
| 🔴 High  | Tutor → Task application     | ✅ Implemented: Tutors apply to tasks; tracked in DB         |
| 🟠 Medium| Task status transitions     | Planned: Open → In Progress → Completed                      |
| 🟠 Medium| Scheduling availability     | Planned: Tutors define time slots; students book             |
| 🟢 Low   | Messaging enhancement       | Planned: Tutor messaging flow + contact bypass safeguards    |
| 🟢 Low   | Ratings & feedback          | Planned: Post-task review and rating system                  |
| 🟢 Low   | UI polish & validations     | Planned: UX refinement and stronger frontend validations     |

---

## 📈 Conclusion

TutorXpert currently enables:

-  End-to-end user journeys for both students and tutors  
-  Map-based exploration of tasks (tutor) and tutors (student)  
-  Real-time application submissions + dashboard tracking   

🎯 The next development phase will focus on enabling tutor-initiated messaging, time slot scheduling, and full task lifecycle (matching → completion).
