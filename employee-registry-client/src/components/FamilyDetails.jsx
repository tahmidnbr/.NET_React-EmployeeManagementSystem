export default function FamilyDetails({ spouse, children }) {
  const hasFamily = spouse || children?.length;

  if (!hasFamily) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 4 }}>Family</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No family details recorded.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {spouse && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Spouse</div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Name</div>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{spouse.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>NID</div>
              <div style={{ fontFamily: 'monospace', marginTop: 2 }}>{spouse.nid}</div>
            </div>
          </div>
        </div>
      )}

      {children?.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            Children ({children.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {children.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 32, padding: '10px 0', borderBottom: i < children.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Name</div>
                  <div style={{ fontWeight: 500, marginTop: 2 }}>{c.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Date of Birth</div>
                  <div style={{ marginTop: 2 }}>{new Date(c.dateOfBirth).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}