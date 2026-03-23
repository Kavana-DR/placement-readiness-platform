import React from 'react';
import '../design-system.css';

export default function Card({ children, className = '', hover = true, ...rest }) {
  const hoverClass = hover ? 'kpb-card-hover' : ''
  return (
    <div className={`kpb-card kpb-transition ${hoverClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}
