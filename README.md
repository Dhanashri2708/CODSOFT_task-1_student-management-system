# Student Management System

A full-stack MERN application for managing students, teachers, attendance,fees, and academic records. Built with role-based access for Admins, Teachers, and Students.

## Features

- **Authentication** — JWT-based login/signup with role-based access control (Admin, Teacher, Student)
- **Student Management** — Add, view, update, and remove student records
- **Teacher Management** — Add, view, update, and remove teacher records
- **Attendance** — Teachers mark attendance per class; students view their own attendance history
- **Fees** — Track fee assignments, partial/full payments, and payment history
- **Academic Records** — Auto-generated or manually entered yearly report cards

## Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, bcrypt


## Getting Started

### Prerequisites

- Node.js installed
- A MongoDB Atlas 

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see `.env.example`):

Run the backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## User Roles

| Role    | Can do |
|---------|--------|
| Admin   | Full access — manage students, teachers, fees, exams, view all records |
| Teacher | Mark attendance, enter exam results for assigned classes |
| Student | View their own attendance, fees, and exam results |

## Signing Up

- **Admin**: sign up directly with role "Admin"
- **Teacher**: must already have a Teacher record added by an Admin, then sign up using their Employee ID
- **Student**: must already have a Student record added by an Admin, then sign up using their Roll Number




