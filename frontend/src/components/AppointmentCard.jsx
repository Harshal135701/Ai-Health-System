import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/format";

export default function AppointmentCard({ appointment, role, onCancel, onChat, onStatusChange, hasReview, onReview }) {
  const a = appointment;
  const other = role === "patient" ? a.doctorId?.userId : a.patientId;
  const otherLabel = role === "patient" ? `Dr. ${other?.name || "Doctor"}` : other?.name;
  const canChat = ["confirmed", "completed"].includes(a.appointmentStatus);
  const canCancel = role === "patient" && ["pending", "confirmed"].includes(a.appointmentStatus);
  const canEdit = role === "patient" && a.appointmentStatus === "pending";
  const canReview = role === "patient" && a.appointmentStatus === "completed";

  return (
    <div className="ac-card card">
      <div className="ac-top">
        <Avatar src={other?.profilePic} name={other?.name} size={44} />
        <div className="ac-info">
          <strong>{otherLabel}</strong>
          <span className="muted">{formatDate(a.appointmentDate)} · {a.formattedStartTime} - {a.formattedEndTime}</span>
        </div>
        <StatusBadge status={a.appointmentStatus} />
      </div>

      {a.symptoms && <p className="ac-symptoms"><span className="muted">Symptoms:</span> {a.symptoms}</p>}

      <div className="ac-actions">
        {canChat && <button className="btn btn-outline btn-sm" onClick={() => onChat?.(a)}>Message</button>}
        {role === "doctor" && a.appointmentStatus === "pending" && (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => onStatusChange?.(a, "confirmed")}>Confirm</button>
            <button className="btn btn-danger btn-sm" onClick={() => onStatusChange?.(a, "rejected")}>Decline</button>
          </>
        )}
        {role === "doctor" && a.appointmentStatus === "confirmed" && (
          <button className="btn btn-primary btn-sm" onClick={() => onStatusChange?.(a, "completed")}>Mark completed</button>
        )}
        {canEdit && <Link to={`/patient/appointments/${a._id}/edit`} className="btn btn-outline btn-sm">Reschedule</Link>}
        {canCancel && <button className="btn btn-danger btn-sm" onClick={() => onCancel?.(a)}>Cancel</button>}
        {canReview && (hasReview
          ? <span className="muted" style={{ fontSize: 12.5, alignSelf: "center" }}>Reviewed</span>
          : <button className="btn btn-amber btn-sm" onClick={() => onReview?.(a)}>Leave a review</button>
        )}
      </div>

      <style>{`
        .ac-card { padding: 16px 18px; margin-bottom: 12px; }
        .ac-top { display: flex; align-items: center; gap: 12px; }
        .ac-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; font-size: 14px; }
        .ac-symptoms { font-size: 13.5px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
        .ac-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
