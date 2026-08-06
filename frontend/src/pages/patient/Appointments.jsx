import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments, cancelAppointment } from "../../api/patient";
import { createConversation } from "../../api/chat";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";

const TABS = ["all", "pending", "confirmed", "completed", "rejected", "cancelled", "expired"];

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [reviewMap, setReviewMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getPatientAppointments()
      .then(res => { setAppointments(res.appointments || []); setReviewMap(res.reviewMap || {}); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (a) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(a._id);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not cancel appointment.");
    }
  };

  const handleChat = async (a) => {
    try {
      const res = await createConversation(a.doctorId?.userId?._id);
      navigate(`/chat/${res.conversation._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Chat isn't available yet for this appointment.");
    }
  };

  const handleReview = (a) => navigate(`/patient/appointments/${a._id}/review`);

  const filtered = tab === "all" ? appointments : appointments.filter(a => a.appointmentStatus === tab);

  return (
    <div>
      <h1 className="page-title">Your appointments</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Track, message, and manage every visit in one place.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tab-row">
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <div className="card empty-state"><p>No appointments here.</p></div>
      ) : (
        filtered.map(a => (
          <AppointmentCard
            key={a._id}
            appointment={a}
            role="patient"
            onCancel={handleCancel}
            onChat={handleChat}
            onReview={handleReview}
            hasReview={!!reviewMap[a._id]}
          />
        ))
      )}

      <style>{`
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .tab-row { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .tab-btn { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--paper-raised); font-size: 13px; font-weight: 600; text-transform: capitalize; color: var(--ink-soft); }
        .tab-btn.active { background: var(--teal-700); border-color: var(--teal-700); color: #fff; }
        .empty-state { padding: 40px; text-align: center; }
      `}</style>
    </div>
  );
}
