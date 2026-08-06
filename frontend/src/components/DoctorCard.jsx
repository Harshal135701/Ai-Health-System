import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function DoctorCard({ doctor }) {
  const u = doctor.userId || {};
  return (
    <Link to={`/patient/doctors/${u._id}`} className="card doc-card">
      <Avatar src={u.profilePic} name={u.name} size={56} />
      <div className="doc-info">
        <h3>Dr. {u.name}</h3>
        <p className="muted">{doctor.specialization || "General Physician"}</p>
        <div className="doc-meta">
          <span>{doctor.experience || 0} yrs exp</span>
          <span className="dot">·</span>
          <span>₹{doctor.consultationFee}</span>
          {doctor.rating > 0 && <><span className="dot">·</span><span className="rating">★ {doctor.rating.toFixed(1)}</span></>}
        </div>
      </div>
      <style>{`
        .doc-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px; transition: box-shadow .15s ease, transform .1s ease;
        }
        .doc-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); border-color: var(--teal-600); }
        .doc-info { flex: 1; min-width: 0; }
        .doc-info h3 { font-size: 16px; margin-bottom: 3px; }
        .doc-meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-soft); margin-top: 6px; }
        .rating { color: var(--amber-600); font-weight: 600; }
        .dot { opacity: .5; }
      `}</style>
    </Link>
  );
}
