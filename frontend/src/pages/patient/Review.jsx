import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getReviewPage, submitReview } from "../../api/patient";
import Loader from "../../components/Loader";
import StarRating from "../../components/StarRating";

export default function Review() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getReviewPage(appointmentId)
      .then(res => {
        setAppointment(res.appointment);
        if (res.review) {
          setExistingReview(res.review);
          setRating(res.review.rating);
          setComment(res.review.comment || "");
        }
      })
      .catch((err) => setError(err?.response?.data?.message || "Could not load this appointment."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating) { setError("Please choose a star rating."); return; }
    setSubmitting(true);
    try {
      await submitReview(appointmentId, { rating, comment });
      setDone(true);
      setTimeout(() => navigate("/patient/appointments"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!appointment) return <div className="alert alert-error">{error}</div>;

  const doctorName = appointment.doctorId?.userId?.name;

  return (
    <div className="page-narrow">
      <Link to="/patient/appointments" className="muted back-link">← Back to appointments</Link>
      <h1 className="page-title">Review Dr. {doctorName}</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Your feedback helps other patients choose the right doctor.</p>

      <div className="card" style={{ padding: 26 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {done && <div className="alert alert-success">Thanks for the feedback!</div>}
        {existingReview && !done && (
          <div className="existing-review">
            <StarRating value={existingReview.rating} readOnly size={22} />
            {existingReview.comment && <p className="muted" style={{ marginTop: 10 }}>{existingReview.comment}</p>}
            <p className="muted" style={{ marginTop: 10, fontSize: 12.5 }}>You've already reviewed this appointment.</p>
          </div>
        )}

        {!existingReview && (
        <form onSubmit={submit}>
          <div className="field">
            <label>Rating</label>
            <StarRating value={rating} onChange={setRating} size={30} />
          </div>
          <div className="field">
            <label>Comment (optional)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience" />
          </div>
          <button className="btn btn-amber btn-block" disabled={submitting}>{submitting ? "Submitting..." : "Submit review"}</button>
        </form>
        )}
      </div>

      <style>{`
        .page-narrow { max-width: 520px; margin: 0 auto; }
        .back-link { display: inline-block; margin-bottom: 14px; font-size: 13.5px; }
        .page-title { font-family: var(--font-display); font-size: 26px; font-weight: 500; }
      `}</style>
    </div>
  );
}
