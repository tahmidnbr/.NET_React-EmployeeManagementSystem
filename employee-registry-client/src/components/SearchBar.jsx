import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const onSearchRef = useRef(onSearch);

  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // 400ms debounce
  useEffect(() => {
    const timer = setTimeout(() => onSearchRef.current(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div style={{ position: 'relative', maxWidth: 400 }}>
      <svg
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        style={{ paddingLeft: 38 }}
        type="text"
        placeholder="Search by name, NID, or department…"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}