export default function StarRating({ value = 0, onChange, size = 22, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="row" style={{ gap: 4 }}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => !readOnly && onChange && onChange(s)}
          style={{
            fontSize: size,
            cursor: readOnly ? "default" : "pointer",
            color: s <= value ? "var(--amber-500)" : "var(--line)",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
