import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/employeeApi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter both username and password.'); return; }
    setLoading(true); setError('');
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ username: res.data.username, role: res.data.role }));
      navigate('/');
    } catch { setError('Invalid username or password.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--green)', height: 4 }} />

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, background: 'var(--green)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🇧🇩</div>
        <div>
          <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 15 }}>Employee & Family Registry</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Human Resources Management System</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'white', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

            <div style={{ background: 'var(--navy2)', padding: '20px 28px', borderBottom: '2px solid var(--green)' }}>
              <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 20 }}>Sign In</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 3 }}>Enter your credentials to access the system</div>
            </div>

            <div style={{ padding: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Quick Access</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {[
                  { role: 'Administrator', user: 'admin',  pass: 'admin123',  color: 'var(--green)', bg: '#f0faf5' },
                  { role: 'Viewer',        user: 'viewer', pass: 'viewer123', color: 'var(--gold)',  bg: '#fdf8f0' },
                ].map(h => (
                  <button key={h.role} onClick={() => { setUsername(h.user); setPassword(h.pass); }}
                    style={{ background: h.bg, border: `1px solid ${h.color}40`, borderRadius: 3, padding: '10px 12px', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: h.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontFamily: 'IBM Plex Mono, monospace' }}>{h.user} / {h.pass}</div>
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginBottom: 20 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label>Username</label>
                  <input placeholder="Enter username" value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div>
                  <label>Password</label>
                  <input type="password" placeholder="Enter password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                {error && <div className="error-box">{error}</div>}
                <button className="btn-primary" onClick={handleLogin} disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginTop: 4 }}>
                  {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : 'Sign In to System'}
                </button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
            Employee & Family Registry · Bangladesh
          </div>
        </div>
      </div>
    </div>
  );
}