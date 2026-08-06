import api from "./client";

export const completeDoctorProfile = (formData) =>
  api.post("/doctor/profile", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);

export const updateDoctorProfile = (formData) =>
  api.put("/doctor/updateProfile", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);

export const getDoctorDashboard = () => api.get("/doctor/dashboard").then(r => r.data);
export const getDoctorProfileForUpdate = () => api.get("/doctor/updateProfile").then(r => r.data);

export const getDoctorAppointments = (status) => api.get("/doctor/appointments", { params: { status } }).then(r => r.data);
export const changeAppointmentStatus = (appointmentId, appointmentStatus) =>
  api.put(`/doctor/appointments/${appointmentId}/status`, { appointmentStatus }).then(r => r.data);

export const getDoctorNotifications = () => api.get("/doctor/notifications").then(r => r.data);
export const markDoctorNotificationRead = (id) => api.patch(`/doctor/notifications/${id}/read`).then(r => r.data);
