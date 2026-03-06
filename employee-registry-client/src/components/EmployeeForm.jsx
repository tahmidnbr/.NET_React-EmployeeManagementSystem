import { useState } from 'react';

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT'];

const empty = {
  name: '', nid: '', phone: '', department: 'Engineering', basicSalary: '',
  spouse: null,
  children: [],
};

export default function EmployeeForm({ initial = empty, onSubmit, loading }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // Spouse helpers
  const toggleSpouse = () =>
    setForm(f => ({ ...f, spouse: f.spouse ? null : { name: '', nid: '' } }));
  const setSpouse = (field, value) =>
    setForm(f => ({ ...f, spouse: { ...f.spouse, [field]: value } }));

  // Children helpers
  const addChild = () =>
    setForm(f => ({ ...f, children: [...(f.children || []), { name: '', dateOfBirth: '' }] }));
  const setChild = (i, field, value) =>
    setForm(f => {
      const children = [...f.children];
      children[i] = { ...children[i], [field]: value };
      return { ...f, children };
    });
  const removeChild = (i) =>
    setForm(f => ({ ...f, children: f.children.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\d{10}$|^\d{17}$/.test(form.nid)) e.nid = 'NID must be 10 or 17 digits';
    if (!/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(form.phone)) e.phone = 'Invalid BD phone number';
    if (!form.basicSalary || Number(form.basicSalary) <= 0) e.basicSalary = 'Salary must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      basicSalary: Number(form.basicSalary),
      children: form.children?.map(c => ({
        name: c.name,
        dateOfBirth: c.dateOfBirth,
      })) || [],
    };
    onSubmit(payload);
  };

  const field = (label, key, placeholder, type = 'text') => (
    <div>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
      />
      {errors[key] && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Basic Info */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 20, fontSize: 15 }}>Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {field('Full Name', 'name', 'Md. Hasan Ali')}
          {field('NID', 'nid', '10 or 17 digit NID')}
          {field('Phone', 'phone', '+8801711234567 or 01711234567')}
          <div>
            <label>Department</label>
            <select value={form.department} onChange={e => set('department', e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          {field('Basic Salary (BDT)', 'basicSalary', '50000', 'number')}
        </div>
      </div>

      {/* Spouse */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: form.spouse ? 20 : 0 }}>
          <h3 style={{ fontSize: 15 }}>Spouse</h3>
          <button className="btn-ghost" onClick={toggleSpouse}>
            {form.spouse ? 'Remove Spouse' : '+ Add Spouse'}
          </button>
        </div>
        {form.spouse && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label>Spouse Name</label>
              <input placeholder="Fatema Begum" value={form.spouse.name}
                onChange={e => setSpouse('name', e.target.value)} />
            </div>
            <div>
              <label>Spouse NID</label>
              <input placeholder="10 or 17 digits" value={form.spouse.nid}
                onChange={e => setSpouse('nid', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: form.children?.length ? 20 : 0 }}>
          <h3 style={{ fontSize: 15 }}>Children ({form.children?.length || 0})</h3>
          <button className="btn-ghost" onClick={addChild}>+ Add Child</button>
        </div>
        {form.children?.map((child, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12, alignItems: 'end' }}>
            <div>
              <label>Child Name</label>
              <input placeholder="Rafi Hasan" value={child.name}
                onChange={e => setChild(i, 'name', e.target.value)} />
            </div>
            <div>
              <label>Date of Birth</label>
              <input type="date" value={child.dateOfBirth}
                onChange={e => setChild(i, 'dateOfBirth', e.target.value)} />
            </div>
            <button className="btn-danger" onClick={() => removeChild(i)} style={{ marginBottom: 0 }}>✕</button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}
        style={{ alignSelf: 'flex-end', padding: '10px 32px', fontSize: 15 }}>
        {loading ? <span className="spinner" /> : 'Save Employee'}
      </button>
    </div>
  );
}