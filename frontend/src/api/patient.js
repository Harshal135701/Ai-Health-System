import api from "./client";

export const completePatientProfile = (formData) =>
  api.post("/patient/profile", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);

export const updatePatientProfile = (formData) =>
  api.put("/patient/updateProfile", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);

export const getPatientDashboard = () => api.get("/patient/dashboard").then(r => r.data);
export const getPatientProfile = () => api.get("/patient/CompleteProfile").then(r => r.data);
export const getPatientProfileForUpdate = () => api.get("/patient/updatePatientProfile").then(r => r.data);

export const getAllDoctors = (params) => api.get("/patient/Alldoctors", { params }).then(r => r.data);
export const getDoctorDetail = (doctorUserId) => api.get(`/patient/doctors/${doctorUserId}`).then(r => r.data);
export const getBookingDoctor = (doctorUserId) => api.get(`/patient/${doctorUserId}/appointment/booking`).then(r => r.data);
export const bookAppointment = (doctorProfileId, data) =>
  api.post(`/patient/appointment/book/${doctorProfileId}`, data).then(r => r.data);

export const getPatientAppointments = () => api.get("/patient/appointments").then(r => r.data);
export const cancelAppointment = (appointmentId) => api.delete(`/patient/appointments/${appointmentId}`).then(r => r.data);
export const getAppointmentForEdit = (appointmentId) => api.get(`/patient/appointments/${appointmentId}/edit`).then(r => r.data);
export const editAppointment = (appointmentId, data) => api.put(`/patient/appointments/${appointmentId}/edit`, data).then(r => r.data);

export const getPatientNotifications = () => api.get("/patient/notifications").then(r => r.data);
export const markPatientNotificationRead = (id) => api.patch(`/patient/notifications/${id}/read`).then(r => r.data);

export const getReviewPage = (appointmentId) => api.get(`/patient/review/${appointmentId}`).then(r => r.data);
export const submitReview = (appointmentId, data) => api.post(`/patient/review/${appointmentId}`, data).then(r => r.data);

export const analyzeSymptoms = (data) => api.post("/patient/ai-symptom-checker", data).then(r => r.data);
