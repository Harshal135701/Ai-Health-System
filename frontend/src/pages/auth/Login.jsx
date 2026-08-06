import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      const from = location.state?.from?.pathname;
      navigate(from || `/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your appointments."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input required type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" />
        </div>
        <div className="row spread" style={{ marginBottom: 18 }}>
          <span />
          <Link to="/forgot-password" className="muted" style={{ fontSize: 13.5, fontWeight: 600 }}>Forgot password?</Link>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
