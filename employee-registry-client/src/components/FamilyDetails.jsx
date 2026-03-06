export default function FamilyDetails({ spouse, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Spouse */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="section-stripe">Spouse Information</div>
        <div style={{ padding: 20 }}>
          {spouse ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Full Name</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{spouse.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>NID Number</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14 }}>{spouse.nid}</div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: '4px 0' }}>No spouse information recorded.</div>
          )}
        </div>
      </div>

      {/* Children */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="section-stripe">Children ({children?.length || 0})</div>
        <div style={{ padding: children?.length ? 0 : 20 }}>
          {!children?.length ? (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No children information recorded.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Name', 'Date of Birth', 'Age'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {children.map((c, i) => {
                  const age = new Date().getFullYear() - new Date(c.dateOfBirth).getFullYear();
                  return (
                    <tr key={i} style={{ borderBottom: i < children.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'var(--muted)' }}>
                        {new Date(c.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{age} years</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}