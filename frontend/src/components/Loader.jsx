export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <p className="muted">{label}</p>
      <style>{`
        .loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
        }
        .spinner {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid var(--teal-100);
          border-top-color: var(--teal-600);
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
