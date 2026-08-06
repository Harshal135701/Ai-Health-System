import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { forgotPassword, verifyOtp, resetPassword } from "../../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 email, 2 otp, 3 new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await forgotPassword(email);
      setInfo("We've emailed you a 6-digit code.");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not find that account.");
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await verifyOtp(email, otp);
      setInfo("");
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code.");
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await resetPassword(email, newPassword);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not reset password.");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Reset your password" : step === 2 ? "Check your email" : "Set a new password"}
      subtitle={
        step === 1 ? "We'll send a verification code to your email." :
        step === 2 ? `Enter the 6-digit code sent to ${email}.` :
        "Choose a new password for your account."
      }
      footer={<Link to="/login">Back to log in</Link>}
    >
      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div className="field">
            <label>Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Sending..." : "Send code"}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify}>
          <div className="field">
            <label>Verification code</label>
            <input required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Verifying..." : "Verify code"}</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleReset}>
          <div className="field">
            <label>New password</label>
            <input required type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Saving..." : "Reset password"}</button>
        </form>
      )}
    </AuthLayout>
  );
}
