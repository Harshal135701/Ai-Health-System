import { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeSymptoms } from "../../api/patient";

const SEVERITY_COLOR = { Low: "var(--teal-700)", Moderate: "var(--amber-600)", High: "var(--coral-600)" };

export default function AISymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [painLevel, setPainLevel] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null);
    setLoading(true);
    try {
      const res = await analyzeSymptoms({ symptoms, duration, painLevel });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not analyze your symptoms right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asc-shell">
      <h1 className="page-title">AI Symptom Checker</h1>
      <p className="muted" style={{ marginBottom: 22, maxWidth: 560 }}>
        Describe how you're feeling and get a preliminary read before your appointment. This is not a diagnosis —
        always consult a qualified doctor.
      </p>

      <div className="asc-grid">
        <div className="card" style={{ padding: 24 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Symptoms</label>
              <input required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. fever, sore throat, fatigue" />
              <span className="field-hint">Separate multiple symptoms with commas.</span>
            </div>
            <div className="field">
              <label>How long have you had these symptoms?</label>
              <input required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 days" />
            </div>
            <div className="field">
              <label>Pain level: {painLevel}/10</label>
              <input type="range" min="0" max="10" value={painLevel} onChange={(e) => setPainLevel(Number(e.target.value))} />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Analyzing..." : "Analyze symptoms"}</button>
          </form>
        </div>

        <div className="card asc-result">
          {!result && !loading && <p className="muted">Your results will appear here.</p>}
          {loading && <p className="muted">Thinking this through...</p>}
          {result && (
            <div className="stack" style={{ gap: 18 }}>
              <div className="spread">
                <h3>Assessment</h3>
                <span className="severity" style={{ color: SEVERITY_COLOR[result.severity] || "var(--ink)" }}>
                  {result.severity} severity
                </span>
              </div>

              <div>
                <h4>Possible conditions</h4>
                <ul>{result.possibleConditions?.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>

              <div>
                <h4>Recommended specialist</h4>
                <p>{result.recommendedSpecialist}</p>
                <Link to="/patient/doctors" className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
                  Find a {result.recommendedSpecialist}
                </Link>
              </div>

              <div>
                <h4>Precautions</h4>
                <ul>{result.precautions?.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>

              <p className="muted disclaimer">{result.disclaimer}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .asc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        .asc-result { padding: 24px; min-height: 200px; }
        .asc-result h3 { font-size: 17px; }
        .asc-result h4 { font-size: 13px; text-transform: uppercase; letter-spacing: .03em; color: var(--ink-soft); margin-bottom: 6px; }
        .asc-result ul { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; }
        .severity { font-weight: 700; font-size: 13px; }
        .disclaimer { font-size: 12px; font-style: italic; border-top: 1px solid var(--line); padding-top: 12px; }
        @media (max-width: 800px) { .asc-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
