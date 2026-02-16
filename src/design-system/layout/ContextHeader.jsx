import React from 'react';
import '../design-system.css';

export default function ContextHeader({ title, subtitle }) {
  return (
    <section className="kpb-context-header">
      <h1>{title}</h1>
      {subtitle ? <p className="kpb-text-block">{subtitle}</p> : null}
    </section>
  );
}
