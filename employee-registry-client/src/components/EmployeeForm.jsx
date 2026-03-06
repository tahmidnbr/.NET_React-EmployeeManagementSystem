import { useState } from 'react';

const DEPTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT'];
const EMPTY = { name: '', nid: '', phone: '', department: 'Engineering', basicSalary: '', spouse: null, children: [] };

// ✅ Defined outside the component — no recreation on each render
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'var(--navy)', borderRadius: '3px 3px 0 0' }}>
      <span style={{ color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</span>
      {action}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', error }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
      {error && <p style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function EmployeeForm({ initial = EMPTY, onSubmit, loading }) {
  const [form, setForm]     = useState(initial);
  const [errors, setErrors] = useState({});

  const set       = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpouse = () => setForm(f => ({ ...f, spouse: f.spouse ? null : { name: '', nid: '' } }));
  const setSpouse = (k, v) => setForm(f => ({ ...f, spouse: { ...f.spouse, [k]: v } }));
  const addChild  = () => setForm(f => ({ ...f, children: [...(f.children || []), { name: '', dateOfBirth: '' }] }));
  const setChild  = (i, k, v) => setForm(f => { const c = [...f.children]; c[i] = { ...c[i], [k]: v }; return { ...f, children: c }; });
  const removeChild = i => setForm(f => ({ ...f, children: f.children.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\d{10}$|^\d{17}$/.test(form.nid)) e.nid = 'Must be 10 or 17 digits';
    if (!/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(form.phone)) e.phone = 'Invalid BD phone (e.g. 01711234567)';
    if (!form.basicSalary || Number(form.basicSalary) <= 0) e.basicSalary = 'Must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, basicSalary: Number(form.basicSalary), children: form.children || [] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Basic Info */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <SectionHeader title="Basic Information" />
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Full Name"        value={form.name}        onChange={e => set('name', e.target.value)}        placeholder="Md. Hasan Ali"      error={errors.name} />
          <Field label="NID Number"       value={form.nid}         onChange={e => set('nid', e.target.value)}         placeholder="10 or 17 digit NID" error={errors.nid} />
          <Field label="Phone Number"     value={form.phone}       onChange={e => set('phone', e.target.value)}       placeholder="+8801711234567"     error={errors.phone} />
          <div>
            <label>Department</label>
            <select value={form.department} onChange={e => set('department', e.target.value)}>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <Field label="Basic Salary (BDT)" value={form.basicSalary} onChange={e => set('basicSalary', e.target.value)} placeholder="50000" type="number" error={errors.basicSalary} />
        </div>
      </div>

      {/* Spouse */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <SectionHeader
          title="Spouse Information"
          action={
            <button className="btn-secondary" onClick={toggleSpouse}
              style={{ padding: '4px 12px', fontSize: 11, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              {form.spouse ? '− Remove' : '+ Add Spouse'}
            </button>
          }
        />
        <div style={{ padding: 20 }}>
          {form.spouse ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Spouse Full Name</label>
                <input placeholder="Fatema Begum" value={form.spouse.name} onChange={e => setSpouse('name', e.target.value)} />
              </div>
              <div>
                <label>Spouse NID</label>
                <input placeholder="10 or 17 digits" value={form.spouse.nid} onChange={e => setSpouse('nid', e.target.value)} />
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: '8px 0' }}>No spouse added. Click "+ Add Spouse" to include spouse details.</div>
          )}
        </div>
      </div>

      {/* Children */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <SectionHeader
          title={`Children (${form.children?.length || 0})`}
          action={
            <button className="btn-secondary" onClick={addChild}
              style={{ padding: '4px 12px', fontSize: 11, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              + Add Child
            </button>
          }
        />
        <div style={{ padding: 20 }}>
          {!form.children?.length ? (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: '8px 0' }}>No children added.</div>
          ) : form.children.map((child, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12, alignItems: 'end', paddingBottom: 12, borderBottom: i < form.children.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <label>Child {i + 1} Name</label>
                <input placeholder="Rafi Hasan" value={child.name} onChange={e => setChild(i, 'name', e.target.value)} />
              </div>
              <div>
                <label>Date of Birth</label>
                <input type="date" value={child.dateOfBirth} onChange={e => setChild(i, 'dateOfBirth', e.target.value)} />
              </div>
              <button className="btn-danger" onClick={() => removeChild(i)} style={{ height: 40 }}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '10px 28px', fontSize: 14 }}>
          {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : 'Save Employee Record'}
        </button>
      </div>
    </div>
  );
}