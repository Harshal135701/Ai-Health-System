import api from "./client";

export const registerUser = (data) => api.post("/registration", data).then(r => r.data);
export const loginUser = (data) => api.post("/login", data).then(r => r.data);
export const logoutUser = () => api.get("/logout").then(r => r.data);
export const fetchMe = () => api.get("/me").then(r => r.data);
export const forgotPassword = (email) => api.post("/forgot-password", { email }).then(r => r.data);
export const verifyOtp = (email, otp) => api.post("/verify-otp", { email, otp }).then(r => r.data);
export const resetPassword = (email, newPassword) => api.post("/reset-password", { email, newPassword }).then(r => r.data);
