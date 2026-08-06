import { DAYS } from "../utils/format";

export default function AvailabilityEditor({ slots, onChange }) {
  const addSlot = () => onChange([...slots, { day: "Monday", startTime: "09:00", endTime: "13:00" }]);
  const removeSlot = (i) => onChange(slots.filter((_, idx) => idx !== i));
  const updateSlot = (i, key, value) => onChange(slots.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  return (
    <div className="ae-wrap">
      {slots.map((s, i) => (
        <div className="ae-row" key={i}>
          <select value={s.day} onChange={(e) => updateSlot(i, "day", e.target.value)}>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="time" value={s.startTime} onChange={(e) => updateSlot(i, "startTime", e.target.value)} />
          <span className="muted">to</span>
          <input type="time" value={s.endTime} onChange={(e) => updateSlot(i, "endTime", e.target.value)} />
          <button type="button" className="ae-remove" onClick={() => removeSlot(i)} aria-label="Remove">×</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={addSlot}>+ Add availability slot</button>

      <style>{`
        .ae-wrap { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
        .ae-row { display: flex; align-items: center; gap: 8px; }
        .ae-row select, .ae-row input { padding: 8px 10px; border: 1px solid var(--line); border-radius: var(--radius-s); }
        .ae-remove { background: transparent; border: none; color: var(--coral-600); font-size: 20px; line-height: 1; padding: 4px 8px; }
      `}</style>
    </div>
  );
}
