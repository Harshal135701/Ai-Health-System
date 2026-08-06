import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoctorDetail } from "../../api/patient";
import Loader from "../../components/Loader";
import Avatar from "../../components/Avatar";
import { DAYS, minutesToLabel } from "../../utils/format";
import { formatDate } from "../../utils/format";

export default function DoctorDetail() {
  const { doctorUserId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    getDoctorDetail(doctorUserId)
      .then(setData)
      .catch(() => setErr("This doctor could not be found."))
      .finally(() => setLoading(false));
  }, [doctorUserId]);

  if (loading) return <Loader />;
  if (err || !data) return <div className="alert alert-error">{err || "Not found"}</div>;

  const { doctor, reviews } = data;
  const u = doctor.userId || {};

  return (
    <div className="dd-shell">
      <div className="card dd-header">
        <Avatar src={u.profilePic} name={u.name} size={84} />
        <div className="dd-header-info">
          <h1>Dr. {u.name}</h1>
          <p className="muted">{doctor.specialization || "General Physician"} · {doctor.hospital}</p>
          <div className="dd-meta">
            <span>{doctor.experience || 0} years experience</span>
            <span className="dot">·</span>
            <span>{doctor.education}</span>
            {doctor.rating > 0 && <><span className="dot">·</span><span className="rating">★ {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)</span></>}
          </div>
        </div>
        <div className="dd-cta">
          <span className="fee">₹{doctor.consultationFee}</span>
          <Link to={`/patient/doctors/${doctorUserId}/book`} className="btn btn-amber">Book appointment</Link>
        </div>
      </div>

      <div className="dd-grid">
        <div className="card dd-panel">
          <h3>Availability</h3>
          {doctor.availability?.length ? (
            <ul className="avail-list">
              {DAYS.filter(d => doctor.availability.some(s => s.day === d)).map(d => {
                const slot = doctor.availability.find(s => s.day === d);
                return (
                  <li key={d}>
                    <span>{d}</span>
                    <span className="muted">{minutesToLabel(slot.startTime)} – {minutesToLabel(slot.endTime)}</span>
                  </li>
                );
              })}
            </ul>
          ) : <p className="muted">No availability listed yet.</p>}
        </div>

        <div className="card dd-panel">
          <h3>Patient reviews</h3>
          {reviews?.length ? (
            <div className="review-list">
              {reviews.map((r) => (
                <div className="review-item" key={r._id}>
                  <div className="row spread">
                    <div className="row" style={{ gap: 8 }}>
                      <Avatar src={r.patientId?.profilePic} name={r.patientId?.name} size={28} />
                      <strong>{r.patientId?.name}</strong>
                    </div>
                    <span className="rating">★ {r.rating}</span>
                  </div>
                  {r.comment && <p className="muted" style={{ marginTop: 8 }}>{r.comment}</p>}
                  <span className="review-date muted">{formatDate(r.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : <p className="muted">No reviews yet.</p>}
        </div>
      </div>

      <style>{`
        .dd-shell { max-width: 880px; }
        .dd-header { display: flex; align-items: center; gap: 20px; padding: 26px; flex-wrap: wrap; }
        .dd-header-info { flex: 1; min-width: 240px; }
        .dd-header-info h1 { font-family: var(--font-display); font-size: 26px; font-weight: 500; }
        .dd-meta { display: flex; gap: 6px; font-size: 13.5px; color: var(--ink-soft); margin-top: 8px; flex-wrap: wrap; }
        .rating { color: var(--amber-600); font-weight: 600; }
        .dot { opacity: .5; }
        .dd-cta { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .fee { font-size: 22px; font-weight: 700; font-family: var(--font-display); }
        .dd-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 16px; margin-top: 16px; }
        .dd-panel { padding: 22px; }
        .dd-panel h3 { font-size: 15px; margin-bottom: 14px; }
        .avail-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .avail-list li { display: flex; justify-content: space-between; font-size: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
        .avail-list li:last-child { border: none; padding-bottom: 0; }
        .review-list { display: flex; flex-direction: column; gap: 16px; }
        .review-item { padding-bottom: 14px; border-bottom: 1px solid var(--line); font-size: 13.5px; }
        .review-item:last-child { border: none; padding-bottom: 0; }
        .review-date { font-size: 11.5px; display: block; margin-top: 6px; }
        @media (max-width: 700px) { .dd-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
