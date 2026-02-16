import React from 'react';
import '../design-system.css';

export default function Checkbox({ checked = false, onChange, label }) {
  return (
    <label className="kpb-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
