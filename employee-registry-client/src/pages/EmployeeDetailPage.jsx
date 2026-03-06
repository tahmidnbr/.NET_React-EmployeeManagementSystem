import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import FamilyDetails from '../components/FamilyDetails';

const API_BASE = 'http://localhost:5127/api';

const DEPT_COLORS = {
  Engineering: '#6c8fff', HR: '#a78bfa', Finance: '#34d399',
  Marketing: '#fbbf24', Operations: '#f87171', IT: '#38bdf8',
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    employeeApi.getById(id)
      .then(r => setEmp(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadCv = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/pdf`);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Employee_CV_${id}.pdf`;
      link.click();
    } catch (e) {
      alert(`Error:${e} Failed to download CV.`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (!emp) return (
    <div style={{ padding: 40, color: 'var(--muted)' }}>Employee not found.</div>
  );

  const color = DEPT_COLORS[emp.department] || '#6c8fff';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }} className="fade-in">

      <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: 24 }}>
        ← Back
      </button>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{emp.name}</h2>
            <span className="tag" style={{ background: `${color}22`, color }}>{emp.department}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={handleDownloadCv} disabled={downloading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {downloading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '↓'}
              Download CV
            </button>
            <button className="btn-primary" onClick={() => navigate(`/edit/${emp.id}`)}>Edit</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 24 }}>
          {[
            { label: 'NID',          value: emp.nid,                           mono: true },
            { label: 'Phone',        value: emp.phone },
            { label: 'Basic Salary', value: `৳${emp.basicSalary.toLocaleString()}` },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 500, fontFamily: mono ? 'monospace' : undefined }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <FamilyDetails spouse={emp.spouse} children={emp.children} />
    </div>
  );
}