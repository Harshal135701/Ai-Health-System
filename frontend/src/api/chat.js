import api from "./client";

// Creates (or returns existing) conversation; only allowed once an appointment is confirmed/completed
export const createConversation = (receiverId) =>
  api.post("/api/conversation", { receiverId }).then(r => r.data);

// Loads full chat: conversation (with participants) + message history
export const openChat = (conversationId) => api.get(`/chat/${conversationId}`).then(r => r.data);
