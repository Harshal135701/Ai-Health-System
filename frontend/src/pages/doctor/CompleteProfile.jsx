import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeDoctorProfile } from "../../api/doctor";
import { useAuth } from "../../context/AuthContext";
import AvailabilityEditor from "../../components/AvailabilityEditor";

export default function DoctorCompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ specialization: "", experience: "", hospital: "", education: "", licenseNumber: "", consultationFee: "" });
  const [availability, setAvailability] = useState([{ day: "Monday", startTime: "09:00", endTime: "13:00" }]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const onFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) { setError("Please upload a profile photo."); return; }
    if (availability.length === 0) { setError("Add at least one availability slot."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("availability", JSON.stringify(availability));
      fd.append("profilePic", file);
      await completeDoctorProfile(fd);
      await refreshUser();
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1 className="page-title">Set up your practice profile</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Patients will see this when they search for a doctor.</p>

      <div className="card" style={{ padding: 28 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Profile photo</label>
            <div className="row" style={{ gap: 14 }}>
              <div className="upload-preview">
                {preview ? <img src={preview} alt="preview" /> : <span>No photo</span>}
              </div>
              <input type="file" accept="image/*" onChange={onFile} />
            </div>
          </div>

          <div className="field">
            <label>Specialization</label>
            <input required value={form.specialization} onChange={update("specialization")} placeholder="e.g. Cardiologist" />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Years of experience</label>
              <input required type="number" min="0" value={form.experience} onChange={update("experience")} />
            </div>
            <div className="field">
              <label>Consultation fee (₹)</label>
              <input required type="number" min="0" value={form.consultationFee} onChange={update("consultationFee")} />
            </div>
          </div>

          <div className="field">
            <label>Hospital / clinic</label>
            <input required value={form.hospital} onChange={update("hospital")} />
          </div>

          <div className="field">
            <label>Education</label>
            <input required value={form.education} onChange={update("education")} placeholder="e.g. MBBS, MD" />
          </div>

          <div className="field">
            <label>License number</label>
            <input required value={form.licenseNumber} onChange={update("licenseNumber")} />
          </div>

          <div className="field">
            <label>Availability</label>
            <AvailabilityEditor slots={availability} onChange={setAvailability} />
          </div>

          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Saving..." : "Save and continue"}</button>
        </form>
      </div>

      <style>{`
        .page-narrow { max-width: 620px; margin: 0 auto; }
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .upload-preview {
          width: 72px; height: 72px; border-radius: 50%; overflow: hidden;
          background: var(--teal-50); display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: var(--ink-soft); flex-shrink: 0;
        }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 520px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
