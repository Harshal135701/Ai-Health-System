import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorAppointments, changeAppointmentStatus } from "../../api/doctor";
import { createConversation } from "../../api/chat";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";

const TABS = ["all", "pending", "confirmed", "completed", "rejected", "cancelled", "expired"];

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [error, setError] = useState("");

  const load = (status) => {
    setLoading(true);
    getDoctorAppointments(status === "all" ? undefined : status)
      .then(res => setAppointments(res.appointments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line

  const filtered = tab === "all" ? appointments : appointments.filter(a => a.appointmentStatus === tab);

  const handleStatusChange = async (a, newStatus) => {
    try {
      await changeAppointmentStatus(a._id, newStatus);
      load(tab);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update this appointment.");
    }
  };

  const handleChat = async (a) => {
    try {
      const res = await createConversation(a.patientId?._id);
      navigate(`/chat/${res.conversation._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Chat isn't available yet.");
    }
  };

  return (
    <div>
      <h1 className="page-title">Appointments</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Review requests and manage your schedule.</p>

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
            role="doctor"
            onChat={handleChat}
            onStatusChange={handleStatusChange}
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
