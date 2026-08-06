import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getPatientNotifications, markPatientNotificationRead } from "../api/patient";
import { getDoctorNotifications, markDoctorNotificationRead } from "../api/doctor";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = user.role === "doctor" ? await getDoctorNotifications() : await getPatientNotifications();
      setNotifications(res.notifications || []);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setSocket(prev => { prev?.disconnect(); return null; });
      return;
    }

    loadNotifications();

    const s = io(SOCKET_URL, { withCredentials: true });

    s.on("connect", () => {
      setConnected(true);
      s.emit("joinRoom", { userId: user._id, role: user.role });
    });

    s.on("disconnect", () => setConnected(false));

    s.on("newNotification", (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const markRead = async (notificationId) => {
    setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    try {
      if (user.role === "doctor") await markDoctorNotificationRead(notificationId);
      else await markPatientNotificationRead(notificationId);
    } catch {
      // ignore, optimistic update is fine
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, notifications, unreadCount, markRead, reload: loadNotifications }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
