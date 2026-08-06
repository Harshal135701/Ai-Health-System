import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBookingDoctor, bookAppointment } from "../../api/patient";
import Loader from "../../components/Loader";
import Avatar from "../../components/Avatar";
import { minutesToLabel, minutesToHHMM } from "../../utils/format";

const SLOT_LENGTH = 30; // minutes

function dayName(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function buildSlots(startMin, endMin) {
  const slots = [];
  for (let t = startMin; t + SLOT_LENGTH <= endMin; t += SLOT_LENGTH) {
    slots.push({ start: t, end: t + SLOT_LENGTH });
  }
  return slots;
}

export default function BookAppointment() {
  const { doctorUserId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [patientMessage, setPatientMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("hospital");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBookingDoctor(doctorUserId).then(res => setDoctor(res.doctor)).finally(() => setLoading(false));
  }, [doctorUserId]);

  const dayAvailability = useMemo(() => {
    if (!doctor || !date) return null;
    const dn = dayName(date);
    return doctor.availability?.find(s => s.day === dn) || null;
  }, [doctor, date]);

  const slots = useMemo(() => {
    if (!dayAvailability) return [];
    return buildSlots(dayAvailability.startTime, dayAvailability.endTime);
  }, [dayAvailability]);

  const minDate = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedSlot) { setError("Please pick an available time slot."); return; }
    setSubmitting(true);
    try {
      await bookAppointment(doctor._id, {
        appointmentDate: date,
        startTime: minutesToHHMM(selectedSlot.start),
        endTime: minutesToHHMM(selectedSlot.end),
        symptoms,
        patientMessage,
        paymentMethod,
      });
      navigate("/patient/appointments");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not book this appointment. Try a different slot.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!doctor) return <div className="alert alert-error">Doctor not found.</div>;

  const u = doctor.userId || {};

  return (
    <div className="book-shell">
      <Link to={`/patient/doctors/${doctorUserId}`} className="muted back-link">← Back to profile</Link>
      <div className="card book-doctor">
        <Avatar src={u.profilePic} name={u.name} size={54} />
        <div>
          <h2>Dr. {u.name}</h2>
          <p className="muted">{doctor.specialization} · ₹{doctor.consultationFee}</p>
        </div>
      </div>

      <div className="card book-form">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Appointment date</label>
            <input type="date" required min={minDate} value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} />
          </div>

          {date && (
            <div className="field">
              <label>Available time slots</label>
              {slots.length === 0 ? (
                <p className="muted field-hint">The doctor isn't available on {dayName(date)}s. Please pick another date.</p>
              ) : (
                <div className="slot-grid">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s.start}
                      className={`slot-btn ${selectedSlot?.start === s.start ? "active" : ""}`}
                      onClick={() => setSelectedSlot(s)}
                    >
                      {minutesToLabel(s.start)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="field">
            <label>Symptoms</label>
            <input required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. Fever, headache" />
          </div>

          <div className="field">
            <label>Message to the doctor</label>
            <textarea required value={patientMessage} onChange={(e) => setPatientMessage(e.target.value)} placeholder="Briefly describe what's going on" />
          </div>

          <div className="field">
            <label>Payment method</label>
            <div className="role-toggle">
              <button type="button" className={paymentMethod === "hospital" ? "active" : ""} onClick={() => setPaymentMethod("hospital")}>Pay at hospital</button>
              <button type="button" className={paymentMethod === "online" ? "active" : ""} onClick={() => setPaymentMethod("online")}>Pay online</button>
            </div>
          </div>

          <button className="btn btn-amber btn-block" disabled={submitting}>{submitting ? "Booking..." : "Confirm booking"}</button>
        </form>
      </div>

      <style>{`
        .book-shell { max-width: 560px; margin: 0 auto; }
        .back-link { display: inline-block; margin-bottom: 16px; font-size: 13.5px; }
        .book-doctor { display: flex; align-items: center; gap: 14px; padding: 18px 20px; margin-bottom: 16px; }
        .book-doctor h2 { font-size: 17px; }
        .book-form { padding: 24px; }
        .slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 8px; }
        .slot-btn { padding: 9px 6px; border: 1px solid var(--line); border-radius: var(--radius-s); background: var(--paper-raised); font-size: 13px; font-weight: 600; }
        .slot-btn:hover { border-color: var(--teal-600); }
        .slot-btn.active { background: var(--teal-700); border-color: var(--teal-700); color: #fff; }
        .role-toggle { display: flex; gap: 8px; }
        .role-toggle button { flex: 1; padding: 10px; border-radius: var(--radius-s); border: 1px solid var(--line); background: var(--paper-raised); font-weight: 600; font-size: 14px; color: var(--ink-soft); }
        .role-toggle button.active { background: var(--teal-700); border-color: var(--teal-700); color: #fff; }
      `}</style>
    </div>
  );
}
