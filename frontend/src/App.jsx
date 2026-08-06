import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import ChatPage from "./pages/chat/ChatPage";

import PatientDashboard from "./pages/patient/Dashboard";
import PatientCompleteProfile from "./pages/patient/CompleteProfile";
import PatientUpdateProfile from "./pages/patient/UpdateProfile";
import AllDoctors from "./pages/patient/AllDoctors";
import DoctorDetail from "./pages/patient/DoctorDetail";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientAppointments from "./pages/patient/Appointments";
import EditAppointment from "./pages/patient/EditAppointment";
import Review from "./pages/patient/Review";
import AISymptomChecker from "./pages/patient/AISymptomChecker";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorCompleteProfile from "./pages/doctor/CompleteProfile";
import DoctorUpdateProfile from "./pages/doctor/UpdateProfile";
import DoctorAppointments from "./pages/doctor/Appointments";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<GuestRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/chat/:conversationId" element={<ChatPage />} />
          </Route>

          {/* Profile completion — outside the sidebar shell */}
          <Route element={<ProtectedRoute role="patient" />}>
            <Route path="/patient/complete-profile" element={<PatientCompleteProfile />} />
          </Route>
          <Route element={<ProtectedRoute role="doctor" />}>
            <Route path="/doctor/complete-profile" element={<DoctorCompleteProfile />} />
          </Route>

          <Route element={<ProtectedRoute role="patient" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/profile" element={<PatientUpdateProfile />} />
              <Route path="/patient/doctors" element={<AllDoctors />} />
              <Route path="/patient/doctors/:doctorUserId" element={<DoctorDetail />} />
              <Route path="/patient/doctors/:doctorUserId/book" element={<BookAppointment />} />
              <Route path="/patient/appointments" element={<PatientAppointments />} />
              <Route path="/patient/appointments/:appointmentId/edit" element={<EditAppointment />} />
              <Route path="/patient/appointments/:appointmentId/review" element={<Review />} />
              <Route path="/patient/symptom-checker" element={<AISymptomChecker />} />
              <Route path="/patient/notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="doctor" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorUpdateProfile />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
