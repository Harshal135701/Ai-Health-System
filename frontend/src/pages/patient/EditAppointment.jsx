import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAppointmentForEdit, editAppointment } from "../../api/patient";
import Loader from "../../components/Loader";
import { minutesToHHMM } from "../../utils/format";

export default function EditAppointment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ appointmentDate: "", startTime: "", endTime: "", symptoms: "", patientMessage: "" });

  useEffect(() => {
    getAppointmentForEdit(appointmentId)
      .then(res => {
        const a = res.appointment;
        setAppointment(a);
        setForm({
          appointmentDate: new Date(a.appointmentDate).toISOString().slice(0, 10),
          startTime: minutesToHHMM(a.startTime),
          endTime: minutesToHHMM(a.endTime),
          symptoms: a.symptoms || "",
          patientMessage: a.patientMessage || "",
        });
      })
      .catch(() => setError("Could not load this appointment."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await editAppointment(appointmentId, form);
      navigate("/patient/appointments");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update this appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!appointment) return <div className="alert alert-error">{error || "Appointment not found."}</div>;

  const doctorName = appointment.doctorId?.userId?.name;

  return (
    <div className="page-narrow">
      <Link to="/patient/appointments" className="muted back-link">← Back to appointments</Link>
      <h1 className="page-title">Reschedule with Dr. {doctorName}</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Only pending appointments can be edited.</p>

      <div className="card" style={{ padding: 24 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.appointmentDate} onChange={update("appointmentDate")} />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Start time</label>
              <input type="time" required value={form.startTime} onChange={update("startTime")} />
            </div>
            <div className="field">
              <label>End time</label>
              <input type="time" required value={form.endTime} onChange={update("endTime")} />
            </div>
          </div>
          <div className="field">
            <label>Symptoms</label>
            <input required value={form.symptoms} onChange={update("symptoms")} />
          </div>
          <div className="field">
            <label>Message to the doctor</label>
            <textarea required value={form.patientMessage} onChange={update("patientMessage")} />
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Saving..." : "Save changes"}</button>
        </form>
      </div>

      <style>{`
        .page-narrow { max-width: 560px; margin: 0 auto; }
        .back-link { display: inline-block; margin-bottom: 14px; font-size: 13.5px; }
        .page-title { font-family: var(--font-display); font-size: 26px; font-weight: 500; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      `}</style>
    </div>
  );
}
