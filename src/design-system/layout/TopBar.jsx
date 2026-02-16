import React from 'react';
import '../design-system.css';

export default function TopBar({ projectName = 'KodNest Project', step = { current: 1, total: 3 }, status = 'Not Started' }) {
  return (
    <header className="kpb-topbar kpb-radius kpb-transition" role="banner">
      <div className="kpb-title">{projectName}</div>
      <div className="kpb-center" aria-hidden>
        <div className="kpb-badge">Step {step.current} / {step.total}</div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <span className={`kpb-badge ${status === 'Shipped' ? 'kpb-success' : status === 'In Progress' ? 'kpb-accent' : ''}`}>{status}</span>
      </div>
    </header>
  );
}
