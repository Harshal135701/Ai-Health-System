import { useEffect, useState } from "react";
import { getDoctorProfileForUpdate, updateDoctorProfile } from "../../api/doctor";
import { useAuth } from "../../context/AuthContext";
import { resolveAsset } from "../../api/client";
import AvailabilityEditor from "../../components/AvailabilityEditor";
import Loader from "../../components/Loader";

export default function DoctorUpdateProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ specialization: "", experience: "", hospital: "", education: "", consultationFee: "" });
  const [availability, setAvailability] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getDoctorProfileForUpdate()
      .then(res => {
        const p = res.profile;
        setForm({
          specialization: p.specialization || "",
          experience: p.experience || "",
          hospital: p.hospital || "",
          education: p.education || "",
          consultationFee: p.consultationFee || "",
        });
        setAvailability(p.availability || []);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
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
      if (availability.length) fd.append("availability", JSON.stringify(availability));
      if (file) fd.append("profilePic", file);
      await updateDoctorProfile(fd);
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
      <p className="muted" style={{ marginBottom: 24 }}>Keep your practice details and availability up to date.</p>

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

          <div className="field">
            <label>Specialization</label>
            <input value={form.specialization} onChange={update("specialization")} />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Years of experience</label>
              <input type="number" min="0" value={form.experience} onChange={update("experience")} />
            </div>
            <div className="field">
              <label>Consultation fee (₹)</label>
              <input type="number" min="0" value={form.consultationFee} onChange={update("consultationFee")} />
            </div>
          </div>

          <div className="field">
            <label>Hospital / clinic</label>
            <input value={form.hospital} onChange={update("hospital")} />
          </div>

          <div className="field">
            <label>Education</label>
            <input value={form.education} onChange={update("education")} />
          </div>

          <div className="field">
            <label>Availability</label>
            <AvailabilityEditor slots={availability} onChange={setAvailability} />
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
