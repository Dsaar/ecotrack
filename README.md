# EcoTrack 🌱

EcoTrack is a full-stack sustainability and community engagement platform designed to encourage environmentally positive actions through mission-based gamification, impact tracking, and real-time user interaction.

Users complete environmental “missions,” submit proof of completion, earn eco points, track their impact, and interact with other users or administrators through dashboards and live chat. Administrators manage missions, review submissions, and oversee the platform’s community activity.

---

## 🌍 Core Concept

EcoTrack combines:

* Mission-based challenges
* Environmental impact tracking
* Community ranking and statistics
* Admin moderation and approval workflows
* Real-time chat between users and admins

The application is built as a modern full-stack system using React on the frontend and Node.js with MongoDB on the backend.

---

## ✨ Features

### 👤 User Features

* User authentication (register, login, logout)
* Profile management
* Browse public sustainability missions
* View detailed mission requirements and estimated impact
* Favorite (bookmark) missions
* Submit mission completions multiple times
* Upload mission proof (image + numeric value, defined per mission)
* Mission history tracking via check-ins
* Personal dashboard:

  * Eco points
  * Missions started
  * Saved missions
  * Submission status (pending / approved / rejected)
* Community leaderboard and rankings
* Real-time chat with other logged-in users or admins
* Email notifications:

  * Welcome email on registration
  * Password reset email
  * Submission approval / rejection notifications

---

### 🛠️ Admin Features

* Admin-only dashboard
* Create, edit, and delete missions
* Define mission proof requirements
* Review mission submissions
* Approve or reject submissions
* Manage users
* View community statistics and impact data
* Moderate platform activity
* Email notifications:

  * Update on mission submission pending approval


---

## 🧱 Tech Stack

### Frontend

* React 19
* Vite
* Material UI (MUI)
* React Router v7
* Context API (User, Theme, Community, Snackbar, Search)
* Axios
* Socket.IO Client
* Chart.js & Recharts

### Backend

* Node.js (ES Modules)
* Express
* MongoDB with Mongoose
* JWT authentication
* Joi validation
* bcryptjs (password hashing)
* Nodemailer (SMTP)
* Socket.IO (real-time chat)
* Helmet, express-rate-limit, CORS
* Morgan (HTTP request logging)
* dotenv (environment variables)

---

## 📁 Project Structure (High Level)

```
ecotrack/
├── client/        # React frontend (Vite)
├── server/        # Express backend
├── README.md
```

The backend follows a modular architecture with controllers, routes, models, validation schemas, middleware, and real-time socket handlers.
The frontend is organized by features, layouts, providers, and shared services.

---

## ⚙️ Environment Variables

### Server (`server/.env.example`)

```
PORT=5050

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=4h

# Admin seed user
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin#1234

# Databases
LOCAL_DB=mongodb://127.0.0.1:27017/ecotrack
ATLAS_DB=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecotrack

# Mail (Nodemailer SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="EcoTrack <no-reply@ecotrack.com>"

# Frontend base URL (used for email links)
APP_BASE_URL=http://localhost:5173
```

> **Note:** Gmail SMTP requires an **App Password**, not a regular Gmail password.

---

### Client (`client/.env.example`)

```
VITE_API_BASE_URL=http://localhost:5050/api
```

---

## ▶️ Running the Project Locally

### 1️⃣ Backend Setup

```
cd server
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5050
```

---

### 2️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🌱 Database Seeding

EcoTrack includes seed scripts to populate the database with an admin user and sample missions.

From the `server` directory:

```
npm run seed        # development
npm run seed:local  # local MongoDB
npm run seed:prod   # production (explicit flag)
```

---

## 🔐 Demo Credentials (Seeded)

**Admin**

* Email: `admin@example.com`
* Password: `Admin#1234`

(These values can be changed in the environment variables before seeding.)

---

## 💬 Real-Time Chat

* Available only to authenticated users
* User ↔ User or User ↔ Admin communication
* Online presence based on active socket connections
* Implemented using Socket.IO

---

## 🧠 Architecture Highlights

* Clear separation of concerns
* Joi validation aligned with Mongoose schemas
* Role-based access control
* Centralized API client on the frontend
* REST API combined with real-time socket features
* Designed for maintainability and scalability

---

## 🔒 Security & Rate Limiting

EcoTrack implements multiple security measures to protect the API and prevent abuse.

### API & IP Rate Limiting

The backend uses IP-based rate limiting via express-rate-limit to control the number of requests a client can make within a defined time window. Rate limits are configured conservatively to balance user experience and protection against abuse.


Rate limiting is applied to:

* Authentication endpoints (login, registration, token refresh)
* Public API routes
* Mission submission endpoints

This helps prevent:

* Brute-force login attempts
* API abuse
* Excessive automated requests
* Denial-of-service style traffic spikes

Each client IP is limited to a predefined number of requests per time window. When the limit is exceeded, the API responds with an appropriate HTTP error status.

### Additional Security Measures

* Helmet is used to set secure HTTP headers
* JWT authentication with expiration and refresh tokens
* Role-based access control (user vs admin)
* Joi validation on all incoming request payloads
* Password hashing using bcrypt
* CORS configuration to restrict cross-origin requests

These measures together provide a secure and production-ready backend architecture.
---
## 📌 Notes

* Email delivery depends on correct SMTP configuration
* MongoDB (local or Atlas) is required
* Real-time features require an active backend connection

---

EcoTrack is designed as a complete, production-style full-stack application demonstrating modern frontend architecture, secure backend practices, and real-time user interaction.
