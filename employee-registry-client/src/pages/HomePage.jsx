import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';

const API_BASE = 'http://localhost:5127/api';

export default function HomePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [exporting, setExporting] = useState(false);
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin   = user.role === 'Admin';

  const fetchEmployees = async (q = '') => {
    setLoading(true);
    try { const res = await employeeApi.getAll(q); setEmployees(res.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(search); }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee record?')) return;
    await employeeApi.delete(id);
    fetchEmployees(search);
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const url = search ? `${API_BASE}/employees/pdf?search=${encodeURIComponent(search)}` : `${API_BASE}/employees/pdf`;
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Employee_List.pdf';
      link.click();
    } catch { alert('Failed to export PDF.'); }
    finally { setExporting(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Human Resources</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Employee Directory</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {employees.length} record{employees.length !== 1 ? 's' : ''}
              </div>
              <button className="btn-secondary" onClick={handleExportPdf} disabled={exporting}>
                {exporting ? <span className="spinner" /> : '↓'} Export PDF
              </button>
              {isAdmin && (
                <button className="btn-primary" onClick={() => navigate('/add')}>
                  + New Employee
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <SearchBar onSearch={setSearch} />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80, gap: 12 }}>
            <span className="spinner" style={{ width: 24, height: 24 }} />
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading records…</span>
          </div>
        ) : (
          <EmployeeTable employees={employees} onDelete={handleDelete} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
}