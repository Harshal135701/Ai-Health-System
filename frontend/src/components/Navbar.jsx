import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="pub-nav">
      <div className="container row spread">
        <Link to="/" className="pub-brand">
          <span className="pub-brand-mark">＋</span>
          MediConnect
        </Link>
        <nav className="row" style={{ gap: 10 }}>
          {user ? (
            <button className="btn btn-primary" onClick={() => navigate(`/${user.role}/dashboard`)}>
              Go to dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log in</Link>
              <Link to="/register" className="btn btn-primary">Get started</Link>
            </>
          )}
        </nav>
      </div>
      <style>{`
        .pub-nav {
          position: sticky; top: 0; z-index: 30;
          background: rgba(247,245,238,0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
          padding: 16px 0;
        }
        .pub-brand {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          display: flex; align-items: center; gap: 9px;
          color: var(--teal-950);
        }
        .pub-brand-mark {
          width: 30px; height: 30px;
          background: var(--teal-800);
          color: var(--amber-500);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; font-family: var(--font-body);
        }
      `}</style>
    </header>
  );
}
