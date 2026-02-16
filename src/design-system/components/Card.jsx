import React from 'react';
import '../design-system.css';

export default function Card({ children, className = '', ...rest }) {
  return (
    <div className={`kpb-card kpb-transition kpb-radius ${className}`} {...rest}>
      {children}
    </div>
  );
}
