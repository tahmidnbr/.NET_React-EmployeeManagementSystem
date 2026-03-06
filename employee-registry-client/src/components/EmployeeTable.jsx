import { useNavigate } from 'react-router-dom';

const DEPT = {
  Engineering: { bg: '#eef2ff', color: '#3730a3' },
  HR:          { bg: '#fdf4ff', color: '#7e22ce' },
  Finance:     { bg: '#f0fdf4', color: '#15803d' },
  Marketing:   { bg: '#fffbeb', color: '#92400e' },
  Operations:  { bg: '#fff1f2', color: '#9f1239' },
  IT:          { bg: '#f0f9ff', color: '#0369a1' },
};

export default function EmployeeTable({ employees, onDelete, isAdmin }) {
  const navigate = useNavigate();

  if (!employees.length) return (
    <div className="card" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>No employees found</div>
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>Try adjusting your search or add a new employee.</div>
    </div>
  );

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface2)', borderBottom: '2px solid var(--border)' }}>
            {['#', 'Employee', 'NID', 'Contact', 'Department', 'Salary', 'Family', 'Actions'].map(h => (
              <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'IBM Plex Sans, sans-serif' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const dept = DEPT[emp.department] || { bg: '#f5f5f5', color: '#555' };
            return (
              <tr key={emp.id} className="fade-up"
                style={{ borderBottom: '1px solid var(--border)', animationDelay: `${i * 30}ms`, transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{String(i + 1).padStart(2, '0')}</td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</div>
                </td>
                <td style={{ padding: '13px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>{emp.nid}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--muted)' }}>{emp.phone}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span className="tag" style={{ background: dept.bg, color: dept.color }}>{emp.department}</span>
                </td>
                <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>৳{emp.basicSalary.toLocaleString()}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--muted)' }}>
                  {emp.spouse && <span style={{ marginRight: 6 }}>💍</span>}
                  {emp.children?.length > 0 && <span>👶×{emp.children.length}</span>}
                  {!emp.spouse && !emp.children?.length && '—'}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate(`/employee/${emp.id}`)}>View</button>
                    {isAdmin && <>
                      <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate(`/edit/${emp.id}`)}>Edit</button>
                      <button className="btn-danger" onClick={() => onDelete(emp.id)}>Delete</button>
                    </>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}