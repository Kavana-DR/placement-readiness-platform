import React from 'react';
import '../design-system.css';

export default function Badge({ variant = 'default', children }) {
  const cls = `kpb-badge ${variant === 'accent' ? 'kpb-accent' : variant === 'success' ? 'kpb-success' : variant === 'warning' ? 'kpb-warning' : ''}`;
  return <span className={cls}>{children}</span>;
}
