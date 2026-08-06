import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completePatientProfile } from "../../api/patient";
import { useAuth } from "../../context/AuthContext";

export default function PatientCompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ age: "", gender: "", bloodGroup: "", allergies: "", medicalHistory: "", address: "" });
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
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("profileImage", file);
      await completePatientProfile(fd);
      await refreshUser();
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1 className="page-title">Complete your profile</h1>
      <p className="muted" style={{ marginBottom: 24 }}>A few medical basics help doctors treat you better.</p>

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

          <div className="grid-2">
            <div className="field">
              <label>Age</label>
              <input required type="number" min="0" value={form.age} onChange={update("age")} />
            </div>
            <div className="field">
              <label>Gender</label>
              <select required value={form.gender} onChange={update("gender")}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Blood group</label>
            <input required value={form.bloodGroup} onChange={update("bloodGroup")} placeholder="e.g. O+" />
          </div>

          <div className="field">
            <label>Allergies</label>
            <input required value={form.allergies} onChange={update("allergies")} placeholder="Comma separated, e.g. Pollen, Penicillin" />
            <span className="field-hint">Separate multiple allergies with commas. Write "None" if not applicable.</span>
          </div>

          <div className="field">
            <label>Medical history</label>
            <input required value={form.medicalHistory} onChange={update("medicalHistory")} placeholder="Comma separated, e.g. Asthma, Diabetes" />
            <span className="field-hint">Write "None" if not applicable.</span>
          </div>

          <div className="field">
            <label>Address</label>
            <textarea required value={form.address} onChange={update("address")} />
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
