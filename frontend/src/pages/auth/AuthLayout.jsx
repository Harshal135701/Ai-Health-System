import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-side">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">＋</span>
          MediConnect
        </Link>
        <div className="auth-side-copy">
          <h2>Care that fits your calendar, not the other way around.</h2>
          <p>Join as a patient to book trusted doctors, or as a doctor to manage your practice online.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="muted auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>

      <style>{`
        .auth-shell { min-height: 100dvh; display: grid; grid-template-columns: 1fr 1fr; }
        .auth-side {
          background: var(--teal-950);
          color: #eef5f1;
          padding: 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .auth-brand { display: flex; align-items: center; gap: 9px; font-family: var(--font-display); font-size: 19px; font-weight: 600; color: #fff; }
        .auth-brand-mark {
          width: 30px; height: 30px; background: var(--amber-500); color: var(--teal-950);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; font-family: var(--font-body);
        }
        .auth-side-copy h2 { font-family: var(--font-display); font-weight: 500; font-size: 28px; line-height: 1.25; margin-bottom: 14px; max-width: 420px; }
        .auth-side-copy p { color: #9db8ae; max-width: 380px; line-height: 1.5; }
        .auth-form-side { display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .auth-card { width: 100%; max-width: 400px; }
        .auth-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; margin-bottom: 6px; }
        .auth-subtitle { margin-bottom: 26px; font-size: 14px; }
        .auth-footer { margin-top: 20px; font-size: 13.5px; text-align: center; color: var(--ink-soft); }
        .auth-footer a { color: var(--teal-700); font-weight: 600; }

        @media (max-width: 860px) {
          .auth-shell { grid-template-columns: 1fr; }
          .auth-side { display: none; }
        }
      `}</style>
    </div>
  );
}
