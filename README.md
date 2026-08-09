# 🏥 MediConnect – AI Health System

A full-stack AI-powered healthcare platform that connects patients and doctors through online appointments, real-time communication, AI-powered symptom analysis, notifications, and secure authentication.

The application provides separate experiences for patients and doctors — allowing patients to discover doctors, book appointments, communicate with doctors, manage their profiles, and receive AI-assisted health guidance.

---

## 📑 Table of Contents

- [Features](#-features)
- [AI Symptom Checker](#-ai-symptom-checker)
- [Appointment Management](#-appointment-management)
- [Real-Time Chat](#-real-time-chat)
- [Real-Time Notifications](#-real-time-notifications)
- [Doctor Discovery](#-doctor-discovery)
- [Doctor Reviews](#-doctor-reviews)
- [Profile Management](#-profile-management)
- [Security Features](#️-security-features)
- [Performance Features](#-performance-features)
- [Technology Stack](#️-technology-stack)
- [Application Architecture](#️-application-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Real-Time Architecture](#-real-time-architecture)
- [AI Response Caching](#-ai-response-caching)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [Installation and Setup](#️-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [API Testing](#-api-testing)
- [Production Build](#-production-build)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure password authentication with hashing
- JWT-based authentication
- HTTP-only cookie-based authentication
- Protected routes and role-based access control (Patient / Doctor)
- Logout functionality
- Current-user authentication state
- Forgot password functionality
- OTP verification
- Password reset functionality

### 👤 Patient Module
Patients can:
- Register and log in
- Complete and update their health profile
- Upload a profile picture
- Browse, search, and filter available doctors
- View doctor profiles and availability
- Book, reschedule, and cancel appointments
- Track appointment status
- Chat with doctors after eligible appointments
- Receive and manage notifications
- Submit doctor reviews
- Use the AI Symptom Checker

### 👨‍⚕️ Doctor Module
Doctors can:
- Register and log in
- Complete and update their professional profile
- Upload a profile picture
- Configure availability
- View the doctor dashboard and appointment list
- Accept, reject, or complete appointments
- View patient information related to appointments
- Communicate with patients
- Receive and manage real-time notifications

---

## 🤖 AI Symptom Checker

An AI-powered symptom analysis feature that allows patients to describe their symptoms and receive a structured, AI-generated response.

**Highlights:**
- Symptom input with structured, healthcare-related guidance
- Backend API integration with Google Gemini
- Response caching via Redis to reduce repeated AI calls
- Rate limiting on AI requests

> **Disclaimer:** The AI Symptom Checker is intended for informational and educational purposes only. It does not provide a medical diagnosis and should not replace professional medical advice.

---

## 📅 Appointment Management

The appointment system manages the complete appointment lifecycle for both patients and doctors.

```text
Patient
   │
   ├── Select Doctor
   ├── Select Available Slot
   ├── Book Appointment
   ▼
Pending
   │
   ├── Doctor Confirms
   ▼
Confirmed
   │
   ├── Doctor Completes Appointment
   ▼
Completed
```

**Patients can:**
- Book appointments
- Reschedule pending appointments
- Cancel appointments
- View appointment history
- Review completed appointments

**Doctors can:**
- Confirm or reject appointments
- Mark appointments as completed

---

## 💬 Real-Time Chat

Real-time communication between patients and doctors, available for eligible appointments after confirmation or completion.

- Real-time messaging via Socket.IO
- Conversation creation and history
- User-based chat rooms
- Real-time connection status

---

## 🔔 Real-Time Notifications

Real-time notifications powered by Socket.IO, generated for events such as:
- Appointment confirmation, rejection, or completion
- Other system events

Users can view notifications, track unread counts, and mark notifications as read.

---

## 👨‍⚕️ Doctor Discovery

Patients can discover doctors through the doctor listing system, including:
- Search and filtering
- Doctor profile details and specialization
- Doctor availability
- Direct appointment booking

---

## ⭐ Doctor Reviews

Patients can submit reviews after completing an appointment.
- Review submission and doctor rating
- Review status tracking
- Duplicate review prevention

---

## 📸 Profile Management

Both patients and doctors can manage their profiles, including:
- Profile information and updates
- Profile picture upload with avatar fallback
- Role-specific profile fields

---

## 🛡️ Security Features

- JWT authentication with HTTP-only cookies
- Role-based authorization and protected API routes
- Password hashing
- Input validation
- Rate limiting (including dedicated AI request rate limiting)
- File upload validation
- CORS configuration
- Centralized error-handling middleware
- Environment variables for all secrets
- Authentication state validation

---

## ⚡ Performance Features

**Redis Caching** — Caches selected AI Symptom Checker responses to reduce repeated AI requests and improve response times.

**Rate Limiting** — Prevents excessive API requests and protects backend resources.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | React.js, Vite, React Router, Axios, CSS, Context API, Socket.IO Client |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.IO, Multer, Redis, Express Validator |
| **AI** | Google Gemini API, Redis-based response caching, AI request rate limiting |
| **Dev Tools** | Git, GitHub, Postman, VS Code, Docker |

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         HTTP / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express.js API   │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       ┌───────────┐     ┌───────────┐     ┌────────────┐
       │  MongoDB  │     │   Redis   │     │  Socket.IO │
       │           │     │   Cache   │     │ Real-time  │
       └───────────┘     └───────────┘     └────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │  Google Gemini  │
                      │        AI       │
                      └─────────────────┘
```

---

## 🔄 Frontend Architecture

The frontend follows a component-based React architecture:

```text
React Application
│
├── Authentication
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   └── Reset Password
│
├── Patient
│   ├── Dashboard
│   ├── Doctors
│   ├── Appointments
│   ├── AI Symptom Checker
│   └── Profile
│
├── Doctor
│   ├── Dashboard
│   ├── Appointments
│   └── Profile
│
├── Shared Components
│   ├── Avatar
│   ├── AppointmentCard
│   ├── Loader
│   ├── NotificationBell
│   └── StatusBadge
│
└── Context
    ├── AuthContext
    └── SocketContext
```

---

## 🔌 Real-Time Architecture

```text
React Client
     │
     │ Socket.IO
     ▼
Node.js Server
     │
     ├── User Rooms
     ├── Notifications
     └── Chat Events
```

The `SocketContext` manages the frontend socket connection and notification state.

---

## 🧠 AI Response Caching

```text
Patient Symptom Request
        │
        ▼
Check Redis Cache
        │
   ┌────┴────┐
   │         │
Cache Hit  Cache Miss
   │         │
   ▼         ▼
Return     Gemini API
Response      │
              ▼
         Store in Redis
              │
              ▼
         Return Response
```

---

## 🔑 Authentication Flow

```text
User
 │
 ▼
React Login Page
 │
 ▼
Axios Request
 │
 ▼
Express Authentication Route
 │
 ▼
Validate Credentials
 │
 ▼
Password Verification
 │
 ▼
Generate JWT
 │
 ▼
HTTP-Only Cookie
 │
 ▼
Authenticated React Application
```

The React application maintains authentication state through `AuthContext`.

---

## 📂 Project Structure

```text
Ai-Health-System-project/
│
├── config/
│   └── socket.js
│
├── controllers/
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   ├── appointment/
│   ├── chat/
│   └── notification/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── middlewares/
├── models/
├── public/
├── routes/
├── services/
├── utils/
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/Harshal135701/Ai-Health-System.git
cd Ai-Health-System
```

### 2. Backend Setup
Install dependencies from the project root:
```bash
npm install
```

Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=your_redis_connection_string
```

Start the backend:
```bash
npm start
```

The backend will run on: **http://localhost:5000**

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```

Create a frontend environment file (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on: **http://localhost:5173**

---

## 🔗 API Integration

The React frontend communicates with the Express backend through a centralized Axios client:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

This allows the frontend to communicate with authenticated backend endpoints while sending authentication cookies automatically.

---

## 🔒 Environment Variables

The following sensitive configuration values should always be stored in environment variables and never committed to GitHub:

- MongoDB connection string
- JWT secret
- Gemini API key
- Redis credentials
- Frontend/backend URLs
- Any other private configuration

---

## 🧪 API Testing

Backend APIs can be tested using:
- Postman
- Browser
- The React frontend directly

Authentication, appointment, doctor, patient, notification, chat, and AI endpoints can each be tested independently through the API layer.

---

## 📦 Production Build

Build the React frontend for production:
```bash
cd frontend
npm run build
```

The production build output is generated in `frontend/dist`.

---

## 🚧 Future Improvements

- Online payment integration
- Video consultation
- Advanced doctor search
- Appointment reminders
- Email and SMS notifications
- Advanced AI health reports & medical report analysis
- Cloud-based file storage
- Advanced analytics dashboard
- Automated testing
- CI/CD pipeline
- Production cloud deployment

---

## 📚 Learning Outcomes

This project demonstrates practical, hands-on experience with:

- Full-stack application development
- React application architecture
- REST API development
- Authentication and authorization (JWT, cookie-based)
- MongoDB database design with Mongoose
- Real-time communication with Socket.IO
- Redis caching and rate limiting
- File uploads and API validation
- AI API integration (Google Gemini)
- Frontend/backend integration
- Git and GitHub workflow
- Environment-based configuration

---

## 👨‍💻 Author

**Harshal Borse**
BE Computer Engineering Student
Full Stack Developer | Application Security Enthusiast

GitHub: [github.com/Harshal135701](https://github.com/Harshal135701)

---

⭐ If you find this project useful or interesting, consider giving the repository a star on GitHub.
