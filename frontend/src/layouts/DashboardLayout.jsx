import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Avatar from "../components/Avatar";
import NotificationBell from "../components/NotificationBell";

const PATIENT_LINKS = [
  { to: "/patient/dashboard", label: "Dashboard", icon: "home" },
  { to: "/patient/doctors", label: "Find Doctors", icon: "search" },
  { to: "/patient/appointments", label: "Appointments", icon: "calendar" },
  { to: "/patient/symptom-checker", label: "AI Symptom Checker", icon: "spark" },
  { to: "/patient/profile", label: "Profile", icon: "user" },
];

const DOCTOR_LINKS = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: "home" },
  { to: "/doctor/appointments", label: "Appointments", icon: "calendar" },
  { to: "/doctor/profile", label: "Profile", icon: "user" },
];

const ICONS = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  spark: <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></>,
};

function Icon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = user?.role === "doctor" ? DOCTOR_LINKS : PATIENT_LINKS;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dl-shell">
      <aside className={`dl-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="dl-brand" onClick={() => navigate("/")}>
          <span className="dl-brand-mark">＋</span>
          <span>MediConnect</span>
        </div>
        <nav className="dl-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `dl-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon name={l.icon} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="dl-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
          Log out
        </button>
      </aside>

      <div className="dl-main">
        <header className="dl-topbar">
          <button className="dl-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <div style={{ flex: 1 }} />
          <NotificationBell />
          <button className="dl-profile" onClick={() => navigate(`/${user?.role}/profile`)}>
            <Avatar src={user?.profilePic} name={user?.name} size={34} />
            <span className="dl-profile-name">{user?.name?.split(" ")[0]}</span>
          </button>
        </header>
        <main className="dl-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .dl-shell { display: flex; min-height: 100dvh; background: var(--paper); }
        .dl-sidebar {
          width: 240px;
          background: var(--teal-950);
          color: #eef5f1;
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          position: sticky;
          top: 0;
          height: 100dvh;
          flex-shrink: 0;
        }
        .dl-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 600;
          color: #fff;
          padding: 6px 10px 24px;
          cursor: pointer;
        }
        .dl-brand-mark {
          width: 30px; height: 30px;
          background: var(--amber-500);
          color: var(--teal-950);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; font-family: var(--font-body);
        }
        .dl-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .dl-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #c3d6cf;
        }
        .dl-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .dl-link.active { background: var(--teal-700); color: #fff; }
        .dl-logout {
          display: flex; align-items: center; gap: 10px;
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: #c3d6cf; padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 500;
        }
        .dl-logout:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .dl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dl-topbar {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 28px;
          border-bottom: 1px solid var(--line);
          background: var(--paper-raised);
          position: sticky; top: 0; z-index: 20;
        }
        .dl-burger { display: none; background: none; border: none; padding: 6px; }
        .dl-profile {
          display: flex; align-items: center; gap: 8px;
          background: transparent; border: none; padding: 4px 6px 4px 4px; border-radius: 999px;
        }
        .dl-profile:hover { background: var(--teal-50); }
        .dl-profile-name { font-weight: 600; font-size: 13.5px; }
        .dl-content { padding: 28px; flex: 1; }

        @media (max-width: 900px) {
          .dl-burger { display: flex; align-items: center; justify-content: center; }
          .dl-sidebar {
            position: fixed;
            left: -260px;
            z-index: 100;
            transition: left .2s ease;
            box-shadow: var(--shadow-md);
          }
          .dl-sidebar.open { left: 0; }
          .dl-content { padding: 18px; }
          .dl-topbar { padding: 12px 16px; }
          .dl-profile-name { display: none; }
        }
      `}</style>
    </div>
  );
}
