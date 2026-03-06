import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import EmployeeForm from '../components/EmployeeForm';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await employeeApi.create(data);
      navigate('/');
    } catch (e) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join(', ')
        : 'Failed to create employee.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: 24 }}>
        ← Back
      </button>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>Add New Employee</h1>
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--danger)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontSize: 14 }}>
          {error}
        </div>
      )}
      <EmployeeForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}