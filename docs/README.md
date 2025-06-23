# TutorXpert Progress Report

## 📌 Overview

**TutorXpert** is a full-stack web platform that connects students with local part-time tutors.  
It enables students to post tutoring tasks, discover nearby tutors on a map, communicate with them, and select the most suitable tutor based on availability, subjects, and bid amount.  
The platform also allows tutors to manage their profiles, apply for tasks, and schedule their available time slots.

This report summarizes current features, completed work, and next steps.

---

## 🚀 Deployment

- 🌐 Frontend: [tutorxpert-frontend.onrender.com](https://tutorxpert-frontend.onrender.com)  
- 🔧 Backend: [tutorxpert-backend.onrender.com](https://tutorxpert-backend-9qxd.onrender.com)  
- 🔐 Auth: JWT-based login, role-aware access  
- 🗄️ Stack: React.js + FastAPI + PostgreSQL + Mapbox  

---

## 👥 User Roles and Capabilities

### 👩‍🎓 Students Can:
- Register and log in
- Edit their profile (name, education, subjects, address, etc.)
- Post tutoring tasks (subject, description, budget, deadline, location)
- Browse available tutors on a map
- Send messages to tutors
- View applications from tutors, each with a message and bid amount
- Accept or reject tutor applications
- Automatically assign the task when accepting a tutor
- *(Planned)* Mark the task as completed and leave a review

### 👨‍🏫 Tutors Can:
- Register and log in
- Complete a tutor profile with hourly rate, subjects, availability, and WWCC
- Create available time slots by subject and time range
- Browse nearby tutoring tasks on a map
- Apply for tasks with a custom message and bid amount
- Track all applied tasks in a dashboard
- Reply to messages sent by students

---

## ✅ Completed Features

| Area                     | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| 🔐 Authentication         | JWT-based login with role (Student / Tutor) separation                      |
| 👤 Profile Management     | Profile editing (name, contact, subjects, education, hourly rate, address) |
| 📝 Task Posting           | Students post tasks with geolocation, subject, budget, deadline             |
| 🗺️ Map Search             | Map-based filtering of tutors and tasks using Mapbox                        |
| 🧭 Availability Slots     | Tutors define time slots for booking by subject and time                    |
| 📨 Messaging              | Two-way messaging between students and tutors                               |
| 📥 Applications           | Tutors apply to tasks with bid and message; students can accept or reject   |
| 📊 Application Status     | Accepted tutor is marked; other applications auto-rejected                  |
| 🚫 Contact Filtering      | Backend blocks email, phone, and social media links in messages             |

---

## 📌 Recent Feature Additions

- ✅ **Students can now accept or reject tutor applications** with one click
- ✅ **Tutors can reply** to student messages (full two-way chat enabled)
- ✅ **Bid-based task application**: tutors can quote a custom price per task
- ✅ **Tutor availability scheduling**: tutors set bookable subject-specific time slots
- ✅ **Improved UI for slot input**: cleaner styling and better form validation

---

## 📋 Features in Planning

| Feature                       | Priority | Description                                                          |
|-------------------------------|----------|----------------------------------------------------------------------|
| 🔄 Task Status Flow           | 🔴 High  | Allow marking tasks as `in_progress`, then `completed`              |
| 💳 Payment Integration        | 🔴 High  | Stripe-based payments: subscriptions, task fees, commissions        |
| 🧾 Subscriptions              | 🟠 Medium| Offer premium plans for students or tutors                          |
| 🌟 Reviews and Ratings        | 🟢 Low   | Students can leave reviews after task completion                    |
| 📅 Slot Calendar View         | 🟢 Low   | Display tutor time slots in calendar format                         |
| 📁 Resume Upload (Tutor)      | 🟢 Low   | Allow tutors to upload certifications                               |

---

## 💵 About Payments

We’ve discussed supporting real money transactions (e.g. charging membership fees, taking commissions, selling add-on services).  
This would require payment provider integration (like Stripe), and may involve:

- Tax compliance (GST or international VAT)
- Identity verification (for tutor payouts)
- Legal policies (Terms, Refund, Privacy)

⚠️ These go beyond development scope. I recommend consulting a lawyer or accountant before launching any payment flow. I'm happy to help implement the technical side once we get clarity on legal matters.

---

## 🧑‍💻 Developer Work Summary

| Component               | Status | Details                                                        |
|-------------------------|--------|----------------------------------------------------------------|
| Backend API             | ✅     | FastAPI + Pydantic, role-aware logic, JWT auth                 |
| PostgreSQL Schema       | ✅     | Normalized tables: users, profiles, tasks, applications, etc.  |
| Frontend UI (React.js)  | ✅     | Form components, routed pages, shadcn/ui library                |
| Map Integration         | ✅     | Location-based search for both tutors and tasks                |
| Messaging System        | ✅     | Two-way message flow, message list + chat box                  |
| Task + Application Flow | ✅     | End-to-end: post task → apply → select tutor                   |
| Availability Scheduler  | ✅     | Tutors submit time slots per subject; saved in DB              |

---

## 🧭 Roadmap (Summary Table)

| Feature                          | Status | Notes                                            |
|----------------------------------|--------|--------------------------------------------------|
| Task matching & applications     | ✅     | Done (student posts → tutor bids → student picks)|
| Tutor availability scheduling    | ✅     | Tutors define time slots                         |
| Messaging (two-way)              | ✅     | Fully working                                    |
| Application decisions            | ✅     | Accept/reject actions trigger status updates     |
| Task lifecycle (status updates)  | ⏳     | In progress: Open → In Progress → Completed      |
| Payments & subscriptions         | 💤     | Requires legal/accounting input                  |
| Reviews & feedback               | 💤     | Optional for post-launch                         |

---

## 🧩 Final Notes

TutorXpert is now a fully working tutoring platform supporting:

- Real-time task posting and bidding
- Location-aware tutor and task search
- Two-way messaging and booking
- Tutor-side availability scheduling

All major workflows are complete. With optional enhancements (payments, reviews), the platform can be deployed in a real-world setting.

If you’re available, I’d love to give you a short demo and hear your thoughts!
