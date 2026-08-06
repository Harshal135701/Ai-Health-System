import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { timeAgo } from "../utils/format";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead } = useSocket();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleClick = (n) => {
    if (!n.isRead) markRead(n._id);
    setOpen(false);
    if (n.redirectUrl) {
      navigate(n.redirectUrl);
    }
  };

  return (
    <div className="bell-wrap" ref={ref}>
      <button className="bell-btn" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="dropdown card">
          <div className="dd-head">
            <strong>Notifications</strong>
          </div>
          <div className="dd-list">
            {notifications.length === 0 && <p className="muted empty">You're all caught up.</p>}
            {notifications.slice(0, 20).map((n) => (
              <button key={n._id} className={`dd-item ${!n.isRead ? "unread" : ""}`} onClick={() => handleClick(n)}>
                <span className="dd-title">{n.title}</span>
                <span className="dd-msg muted">{n.message}</span>
                <span className="dd-time muted">{timeAgo(n.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .bell-wrap { position: relative; }
        .bell-btn {
          position: relative;
          background: transparent;
          border: 1px solid var(--line);
          border-radius: 10px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
        }
        .bell-btn:hover { background: var(--teal-50); border-color: var(--teal-600); }
        .dot {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--coral-600);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }
        .dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          width: 320px;
          max-height: 400px;
          display: flex;
          flex-direction: column;
          z-index: 40;
        }
        .dd-head { padding: 14px 16px; border-bottom: 1px solid var(--line); }
        .dd-list { overflow-y: auto; }
        .dd-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line);
        }
        .dd-item:hover { background: var(--teal-50); }
        .dd-item.unread { background: var(--teal-50); border-left: 3px solid var(--teal-600); }
        .dd-title { font-weight: 600; font-size: 13.5px; }
        .dd-msg { font-size: 12.5px; }
        .dd-time { font-size: 11px; }
        .empty { padding: 24px 16px; text-align: center; }
      `}</style>
    </div>
  );
}
