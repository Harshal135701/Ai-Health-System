import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNo: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Takes about a minute."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Account created! Redirecting to login...</div>}

      <form onSubmit={submit}>
        <div className="field">
          <label>I am a</label>
          <div className="role-toggle">
            <button type="button" className={form.role === "patient" ? "active" : ""} onClick={() => setForm(f => ({ ...f, role: "patient" }))}>Patient</button>
            <button type="button" className={form.role === "doctor" ? "active" : ""} onClick={() => setForm(f => ({ ...f, role: "doctor" }))}>Doctor</button>
          </div>
        </div>
        <div className="field">
          <label>Full name</label>
          <input required value={form.name} onChange={update("name")} placeholder="Jordan Lee" />
        </div>
        <div className="field">
          <label>Email</label>
          <input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Phone number</label>
          <input required value={form.phoneNo} onChange={update("phoneNo")} placeholder="9876543210" />
        </div>
        <div className="field">
          <label>Password</label>
          <input required type="password" minLength={6} value={form.password} onChange={update("password")} placeholder="At least 6 characters" />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <style>{`
        .role-toggle { display: flex; gap: 8px; }
        .role-toggle button {
          flex: 1; padding: 10px; border-radius: var(--radius-s); border: 1px solid var(--line);
          background: var(--paper-raised); font-weight: 600; font-size: 14px; color: var(--ink-soft);
        }
        .role-toggle button.active { background: var(--teal-700); border-color: var(--teal-700); color: #fff; }
      `}</style>
    </AuthLayout>
  );
}
