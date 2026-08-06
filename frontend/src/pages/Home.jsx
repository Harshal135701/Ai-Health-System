import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FEATURES = [
  {
    title: "Find the right doctor",
    body: "Filter by specialization, experience, and consultation fee to find a doctor who fits your needs — then check real reviews from other patients.",
    icon: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  },
  {
    title: "Book in a few taps",
    body: "See a doctor's real availability, pick a slot, and confirm — no phone calls, no waiting rooms full of guesswork.",
    icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  },
  {
    title: "AI symptom check-in",
    body: "Describe what you're feeling and get a preliminary, plain-language read before your appointment — never a replacement for your doctor's judgment.",
    icon: <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
  },
  {
    title: "Stay in the loop",
    body: "Real-time notifications the moment your appointment is confirmed, plus a direct line to message your doctor once it's booked.",
    icon: <><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
  },
];

const STEPS = [
  { n: "01", title: "Create your account", body: "Sign up as a patient or a doctor and complete your profile." },
  { n: "02", title: "Search or get discovered", body: "Patients browse doctors; doctors set their availability and fees." },
  { n: "03", title: "Book and confirm", body: "Pick a slot, the doctor confirms, and you're both notified instantly." },
  { n: "04", title: "Consult and follow up", body: "Message your doctor, get a diagnosis, and leave a review afterward." },
];

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Healthcare, without the hold music</span>
            <h1 className="hero-title">
              Book a doctor's<br /> time, not their<br /> receptionist's.
            </h1>
            <p className="hero-sub">
              MediConnect matches patients with the right doctor, handles booking end‑to‑end,
              and keeps both sides notified — with an AI symptom checker to help you arrive prepared.
            </p>
            <div className="hero-cta row" style={{ gap: 12 }}>
              <Link to="/register" className="btn btn-amber">Book your first appointment</Link>
              <Link to="/register" className="btn btn-outline">I'm a doctor</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 360 360" width="100%" height="100%">
              <circle cx="180" cy="180" r="150" fill="var(--teal-100)" />
              <circle cx="180" cy="180" r="105" fill="var(--paper-raised)" stroke="var(--line)" />
              <g transform="translate(120,110)">
                <rect x="0" y="0" width="120" height="150" rx="14" fill="var(--teal-700)" />
                <rect x="14" y="20" width="92" height="10" rx="5" fill="var(--teal-100)" />
                <rect x="14" y="40" width="60" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
                <circle cx="60" cy="95" r="28" fill="var(--amber-500)" />
                <path d="M50 95h20M60 85v20" stroke="var(--teal-950)" strokeWidth="5" strokeLinecap="round" />
              </g>
              <circle cx="285" cy="95" r="22" fill="var(--coral-100)" />
              <circle cx="70" cy="290" r="16" fill="var(--amber-100)" />
            </svg>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Everything an appointment needs</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature-card card" key={f.title}>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {f.icon}
                  </svg>
                </div>
                <h3>{f.title}</h3>
                <p className="muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-box">
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>Ready when you are</h2>
            <p className="muted">Set up your profile in under two minutes.</p>
          </div>
          <Link to="/register" className="btn btn-amber">Create your account</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container row spread">
          <span className="muted">© {new Date().getFullYear()} MediConnect</span>
          <span className="muted">Built for patients and doctors alike</span>
        </div>
      </footer>

      <style>{`
        .home { overflow-x: hidden; }
        .eyebrow {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          color: var(--teal-700);
          background: var(--teal-50);
          padding: 6px 12px;
          border-radius: 999px;
          margin-bottom: 22px;
        }
        .hero { padding: 72px 0 90px; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1.06;
          font-weight: 500;
          color: var(--teal-950);
          margin-bottom: 22px;
          letter-spacing: -0.01em;
        }
        .hero-sub { font-size: 17px; color: var(--ink-soft); max-width: 480px; margin-bottom: 30px; line-height: 1.55; }
        .hero-art { max-width: 380px; margin: 0 auto; }
        .section { padding: 70px 0; }
        .section-alt { background: var(--teal-950); color: #eef5f1; }
        .section-alt .muted { color: #9db8ae; }
        .section-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 500;
          margin-bottom: 40px;
        }
        .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .feature-card { padding: 26px 22px; }
        .feature-icon {
          width: 40px; height: 40px;
          background: var(--teal-50);
          color: var(--teal-700);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .feature-card h3 { font-size: 16px; margin-bottom: 8px; }
        .feature-card p { font-size: 14px; line-height: 1.5; }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; }
        .step-n { font-family: var(--font-display); font-size: 30px; color: var(--amber-500); display: block; margin-bottom: 10px; }
        .step h3 { font-size: 16px; margin-bottom: 8px; color: #fff; }
        .step p { font-size: 14px; line-height: 1.5; }
        .cta-box {
          background: var(--teal-50);
          border: 1px solid var(--teal-100);
          border-radius: var(--radius-l);
          padding: 40px 44px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .footer { padding: 26px 0 40px; font-size: 13px; }

        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-art { order: -1; max-width: 260px; }
          .feature-grid, .steps-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 520px) {
          .feature-grid, .steps-grid { grid-template-columns: 1fr; }
          .hero-cta { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
