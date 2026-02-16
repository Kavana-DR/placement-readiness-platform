import React from 'react';
import '../design-system.css';

export default function Button({ variant = 'primary', children, onClick, disabled, size = 'normal', ...rest }) {
  const className = `kpb-btn kpb-transition kpb-radius ${variant === 'primary' ? 'kpb-primary' : 'kpb-secondary'} ${size === 'small' ? 'kpb-btn-small' : ''}`;
  return (
    <button className={className} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
