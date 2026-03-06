import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import TopBar from '../components/TopBar';
import EmployeeForm from '../components/EmployeeForm';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      await employeeApi.create(data);
      navigate('/');
    } catch (e) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join(', ')
        : e.response?.data?.message || 'Failed to create employee.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 40px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, cursor: 'pointer' }} onClick={() => navigate('/')}>← Back to Directory</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>Add New Employee</h1>
        </div>
        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        <EmployeeForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}