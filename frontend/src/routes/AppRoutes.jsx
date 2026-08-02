import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import NotFound from "../pages/NotFound";
import Test from "../pages/Test";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Test />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/patient/dashboard"
                element={<PatientDashboard />}
            />

            <Route
                path="/doctor/dashboard"
                element={<DoctorDashboard />}
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;