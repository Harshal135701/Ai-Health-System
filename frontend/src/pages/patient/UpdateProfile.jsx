import { useEffect, useState } from "react";
import { getPatientProfileForUpdate, updatePatientProfile } from "../../api/patient";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import { resolveAsset } from "../../api/client";

export default function PatientUpdateProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ age: "", gender: "", bloodGroup: "", allergies: "", medicalHistory: "", address: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPatientProfileForUpdate();
        if (res.profile) {
          const p = res.profile;
          setForm({
            age: p.age ?? "",
            gender: p.gender ?? "",
            bloodGroup: p.bloodGroup ?? "",
            allergies: (p.allergies || []).join(", "),
            medicalHistory: (p.medicalHistory || []).join(", "),
            address: p.address ?? "",
          });
        }
      } catch {
        // no profile yet
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const onFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      if (file) fd.append("profilePic", file);
      await updatePatientProfile(fd);
      await refreshUser();
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="page-narrow">
      <h1 className="page-title">Your profile</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Update your medical details any time.</p>

      <div className="card" style={{ padding: 28 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Profile photo</label>
            <div className="row" style={{ gap: 14 }}>
              <div className="upload-preview">
                {preview ? <img src={preview} alt="preview" /> : (user?.profilePic ? <img src={resolveAsset(user.profilePic)} alt="" /> : <span>No photo</span>)}
              </div>
              <input type="file" accept="image/*" onChange={onFile} />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Age</label>
              <input type="number" min="0" value={form.age} onChange={update("age")} />
            </div>
            <div className="field">
              <label>Gender</label>
              <select value={form.gender} onChange={update("gender")}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Blood group</label>
            <input value={form.bloodGroup} onChange={update("bloodGroup")} />
          </div>

          <div className="field">
            <label>Allergies</label>
            <input value={form.allergies} onChange={update("allergies")} placeholder="Comma separated" />
          </div>

          <div className="field">
            <label>Medical history</label>
            <input value={form.medicalHistory} onChange={update("medicalHistory")} placeholder="Comma separated" />
          </div>

          <div className="field">
            <label>Address</label>
            <textarea value={form.address} onChange={update("address")} />
          </div>

          <button className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
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
