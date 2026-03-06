import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import TopBar from '../components/TopBar';
import FamilyDetails from '../components/FamilyDetails';

const API_BASE = 'http://localhost:5127/api';
const DEPT = {
  Engineering: { bg: '#eef2ff', color: '#3730a3' },
  HR:          { bg: '#fdf4ff', color: '#7e22ce' },
  Finance:     { bg: '#f0fdf4', color: '#15803d' },
  Marketing:   { bg: '#fffbeb', color: '#92400e' },
  Operations:  { bg: '#fff1f2', color: '#9f1239' },
  IT:          { bg: '#f0f9ff', color: '#0369a1' },
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [downloading, setDownloading] = useState(false);
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    employeeApi.getById(id).then(r => setEmp(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleDownloadCv = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API_BASE}/employees/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
      const blob  = await res.blob();
      const link  = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Employee_CV_${id}.pdf`;
      link.click();
    } catch { alert('Failed to download CV.'); }
    finally { setDownloading(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80, gap: 12 }}>
        <span className="spinner" style={{ width: 24, height: 24 }} />
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</span>
      </div>
    </div>
  );

  if (!emp) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ padding: 40, color: 'var(--muted)' }}>Employee not found.</div>
    </div>
  );

  const dept = DEPT[emp.department] || { bg: '#f5f5f5', color: '#555' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 40px' }} className="fade-up">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--green)' }} onClick={() => navigate('/')}>Directory</span>
          <span>›</span>
          <span>{emp.name}</span>
        </div>

        {/* Profile card */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ background: 'var(--navy)', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Employee Profile</div>
              <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 10 }}>{emp.name}</h2>
              <span className="tag" style={{ background: dept.bg, color: dept.color }}>{emp.department}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={handleDownloadCv} disabled={downloading}
                style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>
                {downloading ? <span className="spinner" /> : '↓'} Download CV
              </button>
              {isAdmin && (
                <button className="btn-primary" onClick={() => navigate(`/edit/${emp.id}`)}>Edit Record</button>
              )}
            </div>
          </div>

          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '3px solid var(--green)' }}>
            {[
              { label: 'Employee ID', value: `#${String(emp.id).padStart(4, '0')}`, mono: true },
              { label: 'NID Number',  value: emp.nid,   mono: true },
              { label: 'Phone',       value: emp.phone },
              { label: 'Department',  value: emp.department },
              { label: 'Basic Salary', value: `৳${emp.basicSalary.toLocaleString()} BDT`, mono: true },
              { label: 'Joined', value: new Date(emp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ padding: '16px 20px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 14, fontFamily: mono ? 'IBM Plex Mono, monospace' : undefined }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <FamilyDetails spouse={emp.spouse} children={emp.children} />
      </div>
    </div>
  );
}