import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';

const API_BASE = 'http://localhost:5127/api';

export default function HomePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async (q = '') => {
    setLoading(true);
    try {
      const res = await employeeApi.getAll(q);
      setEmployees(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(search); }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    await employeeApi.delete(id);
    fetchEmployees(search);
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const url = search
        ? `${API_BASE}/employees/pdf?search=${encodeURIComponent(search)}`
        : `${API_BASE}/employees/pdf`;
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Employee_List.pdf';
      link.click();
    } catch (e) {
      alert(`Error:${e} Failed to export PDF.`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
          <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Bangladesh Employee Registry
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>Employee Directory</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SearchBar onSearch={setSearch} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            {employees.length} employee{employees.length !== 1 ? 's' : ''}
          </span>
          <button className="btn-ghost" onClick={handleExportPdf} disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {exporting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '↓'}
            Export PDF
          </button>
          <button className="btn-primary" onClick={() => navigate('/add')}>+ New Employee</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <span className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : (
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      )}
    </div>
  );
}