import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { timeAgo } from "../utils/format";

export default function Notifications() {
  const { notifications, markRead } = useSocket();
  const navigate = useNavigate();

  const handleClick = (n) => {
    if (!n.isRead) markRead(n._id);
    if (n.redirectUrl) navigate(n.redirectUrl);
  };

  return (
    <div className="page-narrow">
      <h1 className="page-title">Notifications</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Everything that's happened with your appointments.</p>

      {notifications.length === 0 ? (
        <div className="card empty-state"><p>Nothing here yet.</p></div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {notifications.map(n => (
            <button key={n._id} className={`n-item ${!n.isRead ? "unread" : ""}`} onClick={() => handleClick(n)}>
              <div className="n-top">
                <strong>{n.title}</strong>
                <span className="muted n-time">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="muted">{n.message}</p>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .page-narrow { max-width: 620px; margin: 0 auto; }
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .empty-state { padding: 40px; text-align: center; }
        .n-item { display: block; width: 100%; text-align: left; padding: 16px 20px; background: transparent; border: none; border-bottom: 1px solid var(--line); }
        .n-item:last-child { border-bottom: none; }
        .n-item:hover { background: var(--teal-50); }
        .n-item.unread { background: var(--teal-50); border-left: 3px solid var(--teal-600); }
        .n-top { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 4px; font-size: 14px; }
        .n-time { font-size: 12px; white-space: nowrap; }
      `}</style>
    </div>
  );
}
