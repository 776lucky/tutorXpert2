# TutorXpert Progress Report

## 📌 Project Overview

**TutorXpert** is a web-based platform that connects students with local part-time tutors. It enables students to post tutoring requests and allows tutors to discover those requests based on subject expertise and geographical proximity.

The platform emphasizes:
- Local matching (map-based filtering)
- Transparent user profiles
- Efficient posting and browsing of tutoring opportunities

---
## ✅ Core Features Fully Implemented (with User Experience Focus)

> The following modules are fully functional and tested, covering both frontend interface and backend infrastructure. All were independently implemented by the developer.

### 1. User System — Registration, Login, and Profile Management
- Users can sign up either as a **student** or **tutor**
- After logging in, users are redirected to a **personalized dashboard**
- Every user has a **dedicated profile page** with:
  - Full name, phone number, address
  - Education background (degree, major)
  - A brief introduction or teaching experience
- Users can **edit their profile information**, and changes are synced with the backend database
- Profile data is used in search displays and detail pages, ensuring relevance and transparency

  Work involved:
- UI components for forms and data rendering
- Backend models (`User`, `Profile`) and relationships
- Secure password handling and role-based logic
- Frontend → API → database integration for all user data

---

### 2. Task Posting — Creating and Saving Tutoring Requests
- Students can fill out a form to post a **new tutoring task**, including:
  - Task title, subject (e.g., Math, Biology), description
  - Budget range (e.g., "$40–$80"), deadline
  - Physical address and location (captured via map coordinates)
- The system automatically captures the **posting time** (`posted_date`) and links the task to the student
- After submission, tasks are immediately visible on the map to tutors

  Work involved:
- Form UI with input validation
- Backend schema with datetime defaults, foreign key constraints
- Map integration for address geolocation
- Error handling and success feedback for task submission

---

### 3. Task Discovery — Viewing Student Requests on a Map (for Tutors)
- Tutors can access a **task discovery page** with a live map view
- Tasks are **displayed as pins on the map**, representing real locations from the database
- Tutors can move or zoom the map, triggering real-time updates of visible tasks
- Tasks are also shown as a **scrollable list** beside the map
- Tutors can click a task to open a **dedicated detail page** showing:
  - Description, subject, budget, deadline, address, student info (name/role)

  Work involved:
- Building interactive map with boundary-based filtering
- Implementing frontend map movement event handling
- Backend logic to search tasks based on latitude/longitude box
- Linking frontend cards to detailed views with dynamic routing

---

### 4. Tutor Discovery — Finding Tutors Based on Location and Subject (for Students)
- Students can browse available tutors on a **map-based interface**
- Tutors are filtered based on:
  - Map boundaries (nearby only)
  - Subject expertise (e.g., English, Science)
- Each tutor is shown with a **profile card** summarizing:
  - Name, degree, subjects, brief introduction
- Clicking a tutor opens a **detail page** with full profile information

  Work involved:
- Designing consistent UI across cards and profile pages
- Creating mock tutor data aligned with real structure
- Dynamic frontend filtering based on map and subject
- Modular components reusable for task and tutor views

---

### 5.  Backend Infrastructure & Database Integration
- All data is stored in a robust **PostgreSQL database**
- Tasks and users are relationally linked (foreign key: `user_id`)
- `posted_date` fields are automatically populated at creation
- All fields (e.g., budget, lat/lng, subject, description) are fully supported in both storage and retrieval
- Sample data has been inserted for development and testing

  Work involved:
- Designing normalized database schema
- Handling timezone-aware datetimes and location types
- SQL migration + validation
- Debugging type conflicts between frontend and backend (e.g., `datetime` vs `string`)

---

> In summary, all major end-user interactions — from account creation to posting, browsing, and viewing tutoring tasks or profiles — are fully developed. These workflows provide the foundation for meaningful tutor-student connections.


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

