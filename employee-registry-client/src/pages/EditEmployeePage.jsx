import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import TopBar from '../components/TopBar';
import EmployeeForm from '../components/EmployeeForm';

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    employeeApi.getById(id).then(r => {
      const emp = r.data;
      setInitial({
        name:        emp.name,
        nid:         emp.nid,
        phone:       emp.phone,
        department:  emp.department,
        basicSalary: emp.basicSalary,
        spouse:      emp.spouse ? { name: emp.spouse.name, nid: emp.spouse.nid } : null,
        children:    emp.children?.map(c => ({ name: c.name, dateOfBirth: c.dateOfBirth?.slice(0, 10) ?? '' })) || [],
      });
    });
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      await employeeApi.update(id, data);
      navigate(`/employee/${id}`);
    } catch (e) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join(', ')
        : e.response?.data?.message || 'Failed to update employee.';
      setError(msg);
    } finally { setLoading(false); }
  };

  if (!initial) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80, gap: 12 }}>
        <span className="spinner" style={{ width: 24, height: 24 }} />
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 40px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, cursor: 'pointer' }} onClick={() => navigate(-1)}>← Back</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>Edit Employee Record</h1>
        </div>
        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        <EmployeeForm initial={initial} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}