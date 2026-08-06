import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="center-page">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "var(--teal-700)" }}>404</h1>
        <p className="muted" style={{ marginBottom: 20 }}>This page doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  );
}
