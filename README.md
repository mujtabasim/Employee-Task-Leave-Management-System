# Employee Task & Leave Management System

A full-stack Employee Task & Leave Management System developed during my internship. The system allows organizations to manage employees, assign tasks, handle leave requests, and control access using Role-Based Access Control (RBAC).

---

## Features

### Authentication
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Persistent Login
- Secure Logout

### Role-Based Access Control (RBAC)

#### Admin
- Manage Users
- Manage Departments
- Create, Update and Delete Tasks
- View All Tasks
- View All Leave Requests
- Approve or Reject Leave Requests

#### Manager
- View Users
- Create Tasks
- Update Tasks
- View All Leave Requests
- Approve or Reject Leave Requests

#### Employee
- View Assigned Tasks
- Update Task Status
- Apply for Leave
- View Own Leave Requests

---

# Tech Stack

## Frontend

- React (Vite)
- React Router DOM
- Axios
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcrypt

## Database

- PostgreSQL
- Supabase

---

# Project Structure

```
Employee-Task-Leave-System/

├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Database Tables

## Users

- id
- full_name
- email
- password
- role
- department_id
- manager_id

---

## Departments

- id
- name

---

## Tasks

- id
- title
- description
- assigned_to
- assigned_by
- status
- due_date

---

## Leave Requests

- id
- employee_id
- start_date
- end_date
- reason
- status
- reviewed_by
- created_at

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/Employee-Task-Leave-System.git
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=5000

JWT_SECRET=your_jwt_secret

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_service_role_key
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/auth/login |

---

## Users

| Method | Endpoint |
|----------|----------|
| GET | /api/users |
| GET | /api/users/:id |
| POST | /api/users |
| PUT | /api/users/:id |
| DELETE | /api/users/:id |

---

## Departments

| Method | Endpoint |
|----------|----------|
| GET | /api/departments |
| GET | /api/departments/:id |
| POST | /api/departments |
| PUT | /api/departments/:id |
| DELETE | /api/departments/:id |

---

## Tasks

| Method | Endpoint |
|----------|----------|
| GET | /api/tasks |
| POST | /api/tasks |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Leave Requests

| Method | Endpoint |
|----------|----------|
| GET | /api/leave |
| POST | /api/leave |
| PUT | /api/leave/:id |
| DELETE | /api/leave/:id |

---

# Security

- JWT Authentication
- Password Hashing using bcrypt
- Role-Based Authorization
- Protected API Routes
- Supabase PostgreSQL
- Secure Password Storage

---

# Screenshots

Add screenshots of the following pages:

- Login Page
- Dashboard
- Tasks Page
- Leave Page
- Users Page

Example:

```
screenshots/

login.png

dashboard.png

tasks.png

leave.png

users.png
```

---

# Future Improvements

- Dashboard Analytics
- Search Functionality
- Filters
- Email Notifications
- Profile Management
- Password Reset
- Pagination
- File Attachments
- Toast Notifications
- Activity Logs

---

# Author

**Mujtaba Asim**

Internship Project

---

# License

This project is developed for educational and internship purposes.