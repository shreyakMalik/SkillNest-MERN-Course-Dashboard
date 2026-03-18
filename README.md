# 🎓 SkillNest — MERN Course Dashboard

A full-stack course management platform built with the **MERN** stack (MongoDB, Express, React, Node.js).

## ✨ Features

### Authentication
- ✅ JWT-based login & registration
- ✅ Role-based access control (Student / Admin)
- ✅ Protected routes on both frontend & backend

### Student Features
- ✅ Browse & search all published courses
- ✅ Filter by category and level
- ✅ **Enroll** in courses with one click
- ✅ User dashboard showing enrolled courses + progress
- ✅ Track and update learning progress (25% → 50% → 75% → 100%)
- ✅ Unenroll from courses

### Admin Features
- ✅ Admin overview dashboard with platform stats
- ✅ **Full CRUD** for courses (Create, Read, Update, Delete)
- ✅ Publish / unpublish courses
- ✅ View and manage all users
- ✅ Delete users

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |

## 📁 Project Structure

```
course-dashboard/
├── backend/
│   ├── models/         # User, Course, Enrollment schemas
│   ├── routes/         # auth, courses, enrollments, users
│   ├── middleware/     # JWT protect, adminOnly
│   ├── server.js       # Express app entry point
│   ├── seed.js         # Database seeder
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/         # Login, Register, ProtectedRoute
    │   │   ├── Layout/       # Sidebar, AppLayout, Toast
    │   │   └── Student/      # CourseCard
    │   ├── context/          # AuthContext (global state)
    │   ├── pages/            # StudentDashboard, BrowseCourses, MyCourses
    │   │                       AdminDashboard, AdminCourses, AdminUsers
    │   ├── utils/            # api.js (axios), helpers.js
    │   ├── App.jsx           # Routes
    │   └── index.css         # Global dark theme styles
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Seed the Database

```bash
node seed.js
```

This creates:
- Admin: `admin@SkillNest.com` / `admin123`
- Student: `priya@example.com` / `student123`
- 6 sample courses

### 3. Start Backend

```bash
npm run dev   # nodemon (auto-reload)
# or
npm start     # node
```

Backend runs on: **http://localhost:5000**

### 4. Setup & Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Courses
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/courses` | Public |
| GET | `/api/courses/all` | Admin |
| POST | `/api/courses` | Admin |
| PUT | `/api/courses/:id` | Admin |
| DELETE | `/api/courses/:id` | Admin |

### Enrollments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/enrollments/:courseId` | Student |
| DELETE | `/api/enrollments/:courseId` | Student |
| GET | `/api/enrollments/my/courses` | Student |
| PATCH | `/api/enrollments/:courseId/progress` | Student |

### Users (Admin)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
| GET | `/api/users/stats/overview` | Admin |

## 👤 Author

- GitHub: [ShreyakMalik](https://github.com/ShreyakMalik)
- Email: shreyakmalik@gmail.com
