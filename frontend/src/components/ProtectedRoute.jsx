import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking your session..." />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Loading..." />;
  if (user) return <Navigate to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  return <Outlet />;
}
