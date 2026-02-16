import React from 'react';
import '../design-system.css';

export default function Input({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      className="kpb-input kpb-transition"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      {...rest}
    />
  );
}
