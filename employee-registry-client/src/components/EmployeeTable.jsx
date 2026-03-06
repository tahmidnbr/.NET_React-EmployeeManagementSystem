import { useNavigate } from 'react-router-dom';

const DEPT_COLORS = {
  Engineering: '#6c8fff',
  HR:          '#a78bfa',
  Finance:     '#34d399',
  Marketing:   '#fbbf24',
  Operations:  '#f87171',
  IT:          '#38bdf8',
};

export default function EmployeeTable({ employees, onDelete }) {
  const navigate = useNavigate();

  if (!employees.length) {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
        No employees found.
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Name', 'NID', 'Phone', 'Department', 'Salary (BDT)', 'Family', 'Actions'].map(h => (
              <th key={h} style={{
                padding: '14px 16px', textAlign: 'left',
                fontSize: 11, fontWeight: 600,
                color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => (
            <tr
              key={emp.id}
              className="fade-in"
              style={{
                borderBottom: '1px solid var(--border)',
                animationDelay: `${i * 40}ms`,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '14px 16px', fontWeight: 500 }}>{emp.name}</td>
              <td style={{ padding: '14px 16px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: 13 }}>{emp.nid}</td>
              <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 13 }}>{emp.phone}</td>
              <td style={{ padding: '14px 16px' }}>
                <span className="tag" style={{
                  background: `${DEPT_COLORS[emp.department] || '#6c8fff'}22`,
                  color: DEPT_COLORS[emp.department] || '#6c8fff',
                }}>
                  {emp.department}
                </span>
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 500 }}>
                ৳{emp.basicSalary.toLocaleString()}
              </td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                {emp.spouse ? '💍 Spouse' : ''}
                {emp.spouse && emp.children?.length ? ' · ' : ''}
                {emp.children?.length ? `👶 ${emp.children.length}` : ''}
                {!emp.spouse && !emp.children?.length ? '—' : ''}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-ghost" onClick={() => navigate(`/employee/${emp.id}`)}>View</button>
                  <button className="btn-ghost" onClick={() => navigate(`/edit/${emp.id}`)}>Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(emp.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}