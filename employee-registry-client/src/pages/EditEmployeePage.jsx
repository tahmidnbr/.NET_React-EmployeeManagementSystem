import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
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
        children:    emp.children?.map(c => ({
          name: c.name,
          dateOfBirth: c.dateOfBirth?.slice(0, 10) ?? '',
        })) || [],
      });
    });
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await employeeApi.update(id, data);
      navigate(`/employee/${id}`);
    } catch (e) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join(', ')
        : 'Failed to update employee.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!initial) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </button>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>Edit Employee</h1>
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--danger)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: 'var(--danger)', fontSize: 14 }}>
          {error}
        </div>
      )}
      <EmployeeForm initial={initial} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}