import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin   = user.role === 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="topbar">
      {/* Left — brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🇧🇩</div>
        <div>
          <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Employee Registry</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Bangladesh HRMS</div>
        </div>
      </div>

      {/* Right — user info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: isAdmin ? 'rgba(0,112,60,0.3)' : 'rgba(200,149,42,0.3)',
            border: `1px solid ${isAdmin ? 'var(--green)' : 'var(--gold)'}`,
            borderRadius: 2, padding: '2px 8px',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: isAdmin ? '#6effc0' : '#ffd580',
          }}>{user.role}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{user.username}</div>
        </div>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
        <button onClick={handleLogout} style={{
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: 12, cursor: 'pointer', padding: '4px 8px',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.target.style.color = 'white'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
        >Sign Out</button>
      </div>
    </div>
  );
}