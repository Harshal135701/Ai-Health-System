import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getDoctorDashboard } from "../../api/doctor";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import { formatDate } from "../../utils/format";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (user && !user.isProfileCompleted) return <Navigate to="/doctor/complete-profile" replace />;
  if (!data) return null;

  const stats = [
    { label: "Total appointments", value: data.totalAppointments, color: "var(--teal-700)" },
    { label: "Today", value: data.todayCount, color: "var(--blue-600)" },
    { label: "Pending", value: data.pendingCount, color: "var(--amber-600)" },
    { label: "Confirmed", value: data.confirmedCount, color: "var(--teal-700)" },
  ];

  return (
    <div>
      <div className="spread" style={{ marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">Welcome back, Dr. {user?.name?.split(" ")[0]}</h1>
          <p className="muted">Here's your practice at a glance.</p>
        </div>
        <Link to="/doctor/appointments" className="btn btn-primary">View appointments</Link>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div className="card stat-card" key={s.label}>
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="muted stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {data.todayAppointments?.length > 0 && (
        <>
          <h2 className="section-h" style={{ margin: "26px 0 14px" }}>Today's schedule</h2>
          <div className="card" style={{ overflow: "hidden", marginBottom: 26 }}>
            {data.todayAppointments.map(a => (
              <div className="appt-row" key={a._id}>
                <Avatar src={a.patientId?.profilePic} name={a.patientId?.name} size={40} />
                <div className="appt-info">
                  <strong>{a.patientId?.name}</strong>
                  <span className="muted">{a.formattedStartTime} - {a.formattedEndTime}</span>
                </div>
                <StatusBadge status={a.appointmentStatus} />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="spread" style={{ margin: "26px 0 14px" }}>
        <h2 className="section-h">Recent appointments</h2>
        <Link to="/doctor/appointments" className="btn btn-ghost btn-sm">View all</Link>
      </div>

      {data.recentAppointments.length === 0 ? (
        <div className="card empty-state"><p>No appointments yet.</p></div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {data.recentAppointments.map((a) => (
            <div className="appt-row" key={a._id}>
              <Avatar src={a.patientId?.profilePic} name={a.patientId?.name} size={40} />
              <div className="appt-info">
                <strong>{a.patientId?.name}</strong>
                <span className="muted">{formatDate(a.appointmentDate)} · {a.formattedStartTime}</span>
              </div>
              <StatusBadge status={a.appointmentStatus} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .stat-card { padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-size: 30px; font-weight: 700; font-family: var(--font-display); }
        .stat-label { font-size: 13px; }
        .section-h { font-size: 17px; font-weight: 600; }
        .empty-state { padding: 34px; text-align: center; }
        .appt-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--line); }
        .appt-row:last-child { border-bottom: none; }
        .appt-info { display: flex; flex-direction: column; gap: 2px; flex: 1; font-size: 14px; }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
