import React from 'react';
import '../design-system.css';

const VARIANT_CLASS_MAP = {
  primary: 'kpb-btn-primary',
  secondary: 'kpb-btn-secondary',
  ghost: 'kpb-btn-ghost',
  danger: 'kpb-btn-danger',
}

export default function Button({ variant = 'primary', children, onClick, disabled, size = 'normal', className = '', ...rest }) {
  const variantClass = VARIANT_CLASS_MAP[variant] || VARIANT_CLASS_MAP.primary
  const sizeClass = size === 'small' ? 'kpb-btn-small' : ''
  const classes = `kpb-btn kpb-transition ${variantClass} ${sizeClass} ${className}`.trim()
  return (
    <button className={classes} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
