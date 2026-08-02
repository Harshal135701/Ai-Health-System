import api from "./api";

export const login = async (formData) => {
    const response = await api.post("/api/auth/login", formData);
    return response.data;
};

export const register = async (formData) => {
    const response = await api.post("/api/auth/register", formData);
    return response.data;
};