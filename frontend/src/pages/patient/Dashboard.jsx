import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getPatientDashboard } from "../../api/patient";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import { formatDate } from "../../utils/format";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (user && !user.isProfileCompleted) return <Navigate to="/patient/complete-profile" replace />;
  if (!data) return null;

  const stats = [
    { label: "Total appointments", value: data.totalAppointments, color: "var(--teal-700)" },
    { label: "Pending", value: data.pendingCount, color: "var(--amber-600)" },
    { label: "Confirmed", value: data.confirmedCount, color: "var(--blue-600)" },
    { label: "Rejected", value: data.rejectedCount, color: "var(--coral-600)" },
  ];

  return (
    <div>
      <div className="spread" style={{ marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="muted">Here's what's happening with your care.</p>
        </div>
        <Link to="/patient/doctors" className="btn btn-primary">Find a doctor</Link>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div className="card stat-card" key={s.label}>
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="muted stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {data.upcomingAppointment && (
        <div className="card upcoming-card">
          <div className="row spread" style={{ marginBottom: 4 }}>
            <span className="eyebrow-sm">Upcoming appointment</span>
            <StatusBadge status={data.upcomingAppointment.appointmentStatus} />
          </div>
          <h3 style={{ marginTop: 6 }}>
            Dr. {data.upcomingAppointment.doctorId?.userId?.name || "Doctor"}
          </h3>
          <p className="muted">
            {formatDate(data.upcomingAppointment.appointmentDate)} · {data.upcomingAppointment.formattedStartTime} - {data.upcomingAppointment.formattedEndTime}
          </p>
        </div>
      )}

      <div className="spread" style={{ margin: "30px 0 14px" }}>
        <h2 className="section-h">Recent appointments</h2>
        <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View all</Link>
      </div>

      {data.recentAppointments.length === 0 ? (
        <div className="card empty-state">
          <p>No appointments yet. When you're ready, browse doctors and book your first visit.</p>
          <Link to="/patient/doctors" className="btn btn-primary btn-sm">Browse doctors</Link>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {data.recentAppointments.map((a) => (
            <div className="appt-row" key={a._id}>
              <Avatar src={a.doctorId?.userId?.profilePic} name={a.doctorId?.userId?.name} size={40} />
              <div className="appt-info">
                <strong>Dr. {a.doctorId?.userId?.name || "Doctor"}</strong>
                <span className="muted">{formatDate(a.appointmentDate)} · {a.formattedStartTime}</span>
              </div>
              <StatusBadge status={a.appointmentStatus} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .stat-card { padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-size: 30px; font-weight: 700; font-family: var(--font-display); }
        .stat-label { font-size: 13px; }
        .upcoming-card { padding: 22px 24px; background: var(--teal-950); color: #eef5f1; border: none; }
        .upcoming-card h3 { color: #fff; font-size: 19px; }
        .upcoming-card .muted { color: #9db8ae; }
        .eyebrow-sm { font-size: 12px; font-weight: 700; color: var(--amber-500); text-transform: uppercase; letter-spacing: .04em; }
        .section-h { font-size: 17px; font-weight: 600; }
        .empty-state { padding: 34px; text-align: center; display: flex; flex-direction: column; gap: 14px; align-items: center; }
        .appt-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--line); }
        .appt-row:last-child { border-bottom: none; }
        .appt-info { display: flex; flex-direction: column; gap: 2px; flex: 1; font-size: 14px; }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
