# MediConnect — AI Health System

A full-stack doctor-patient appointment platform: Node.js/Express/MongoDB backend
with a React 19 + Vite frontend.

## What's in this package

- **Backend** (`/`) — your original Express/MongoDB API. It's been patched so every
  route the frontend needs returns JSON instead of rendering EJS pages. See
  "Backend changes" below for the exact list.
- **Frontend** (`/frontend`) — a brand new React app (Vite, React Router, Axios,
  Socket.IO client) covering the full patient and doctor experience: auth
  (register/login/forgot-password with OTP), profile setup, doctor search and
  booking, appointments management, real-time chat, real-time notifications, and
  the AI symptom checker.

## Running it

### 1. Backend

```bash
cd Ai-Health-System-project
npm install
npm start   # or: node index.js / nodemon index.js, check package.json "scripts"
```

Make sure your `.env` has `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, email
credentials for OTP, etc. — whatever you already had configured. The server
listens on the port in your `.env` (defaults matched what CORS already expected:
`http://localhost:5173` for the frontend origin).

### 2. Frontend

```bash
cd Ai-Health-System-project/frontend
npm install
npm run dev
```

This starts Vite on `http://localhost:5173`. It talks to the backend using the
`VITE_API_URL` in `frontend/.env` (defaults to `http://localhost:5000` — change
this if your backend runs on a different port).

For production, `npm run build` outputs static files to `frontend/dist`, which
you can serve however you like (Vercel, Netlify, or from Express itself).

## Backend changes

The backend was ~90% ready for JSON already. I patched the remaining pieces:

- `middlewares/auth.js` — returns `401 JSON` instead of redirecting to `/login`
  (a redirect breaks `fetch`/`axios` calls from a React app).
- `controllers/authController.js` — `login`, `logout`, `forgotPassword`,
  `verifyOTP`, and `resetPassword` now return JSON instead of
  rendering/redirecting. Added a new `GET /me` endpoint so the frontend can
  check session state on load.
- `controllers/doctorController.js` / `controllers/patientController.js` — all
  remaining `res.render(...)` calls (dashboard, profile pages, appointments
  list, notifications, review page) converted to `res.json(...)`.
- `controllers/chatController.js` — rewritten to return JSON for `startChat`
  and `openChat` (used to `res.redirect`/`res.render`).
- Fixed a small existing bug: `paymentMethod` was being read from the booking
  form but never actually saved on the appointment — it's now persisted.

Nothing about your data models, business logic, validation rules, or auth flow
was changed — only how each endpoint responds.

## Frontend structure

```
frontend/src/
  api/            axios client + one module per resource (auth, patient, doctor, chat)
  context/        AuthContext (session), SocketContext (notifications + socket.io)
  components/     shared UI: Navbar, Avatar, AppointmentCard, DoctorCard, etc.
  layouts/        DashboardLayout (sidebar + topbar shell used by both roles)
  pages/
    auth/         Register, Login, ForgotPassword (email → OTP → reset)
    patient/      Dashboard, profile setup/update, doctor search, booking,
                  appointments, reschedule, reviews, AI symptom checker
    doctor/       Dashboard, profile setup/update, appointments
    chat/         Real-time chat (Socket.IO)
```

Auth uses the existing httpOnly-cookie JWT — the frontend never touches the
token directly, it just sends `credentials: include` on every request.

## What to double check

- CORS origin in `index.js` should match wherever you actually deploy the
  frontend (currently `http://localhost:5173`).
- Real-time chat and notifications both depend on `config/socket.js` — make
  sure the deployed backend's Socket.IO server is reachable from the frontend
  origin (same CORS considerations).
- The AI symptom checker and doctor search/filter pages were built directly
  against your existing controllers — if you add new filters or fields to
  those endpoints later, the corresponding page/api module is a quick edit.
