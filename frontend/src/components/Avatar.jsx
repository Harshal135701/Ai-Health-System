import { resolveAsset } from "../api/client";
import { initials } from "../utils/format";

export default function Avatar({ src, name, size = 40 }) {
  const url = resolveAsset(src);
  const style = { width: size, height: size, fontSize: size * 0.38 };

  return (
    <div className="avatar" style={style}>
      {url ? (
        <img
          src={url}
          alt={name || "avatar"}
          onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
        />
      ) : null}
      <span style={url ? { display: "none" } : {}}>{initials(name) || "?"}</span>
      <style>{`
        .avatar {
          border-radius: 50%;
          overflow: hidden;
          background: var(--teal-100);
          color: var(--teal-800);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </div>
  );
}
