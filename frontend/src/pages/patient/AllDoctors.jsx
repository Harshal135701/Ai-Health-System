import { useEffect, useState, useCallback } from "react";
import { getAllDoctors } from "../../api/patient";
import DoctorCard from "../../components/DoctorCard";
import Loader from "../../components/Loader";

const FEE_RANGES = ["0-500", "500-1000", "1000-2000", "2000+"];

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ doctorName: "", specialization: "", minExperience: "", feeRange: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f, p) => {
    setLoading(true);
    try {
      const params = { page: p };
      Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await getAllDoctors(params);
      setDoctors(res.doctors || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filters, page); }, [page]); // eslint-disable-line

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    load(filters, 1);
  };

  return (
    <div>
      <h1 className="page-title">Find a doctor</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Search by name, specialization, experience, or fee.</p>

      <form className="card filter-bar" onSubmit={applyFilters}>
        <input placeholder="Doctor name" value={filters.doctorName} onChange={(e) => setFilters(f => ({ ...f, doctorName: e.target.value }))} />
        <input placeholder="Specialization" value={filters.specialization} onChange={(e) => setFilters(f => ({ ...f, specialization: e.target.value }))} />
        <input type="number" placeholder="Min experience" value={filters.minExperience} onChange={(e) => setFilters(f => ({ ...f, minExperience: e.target.value }))} />
        <select value={filters.feeRange} onChange={(e) => setFilters(f => ({ ...f, feeRange: e.target.value }))}>
          <option value="">Any fee</option>
          {FEE_RANGES.map(r => <option key={r} value={r}>₹{r}</option>)}
        </select>
        <button className="btn btn-primary btn-sm">Search</button>
      </form>

      {loading ? <Loader /> : doctors.length === 0 ? (
        <div className="card empty-state">
          <p>No doctors match your filters. Try broadening your search.</p>
        </div>
      ) : (
        <div className="doc-grid">
          {doctors.map((d) => <DoctorCard doctor={d} key={d._id} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="row" style={{ gap: 8, justifyContent: "center", marginTop: 24 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      )}

      <style>{`
        .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; }
        .filter-bar { display: grid; grid-template-columns: 1.4fr 1.2fr 1fr 1fr auto; gap: 10px; padding: 16px; margin-bottom: 24px; align-items: center; }
        .filter-bar input, .filter-bar select { padding: 9px 11px; border: 1px solid var(--line); border-radius: var(--radius-s); }
        .doc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .empty-state { padding: 40px; text-align: center; }
        .page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--line); background: var(--paper-raised); font-weight: 600; }
        .page-btn.active { background: var(--teal-700); border-color: var(--teal-700); color: #fff; }
        @media (max-width: 900px) { .filter-bar { grid-template-columns: 1fr 1fr; } .doc-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
