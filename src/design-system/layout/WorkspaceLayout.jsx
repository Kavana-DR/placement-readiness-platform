import React from 'react';
import '../design-system.css';

export default function WorkspaceLayout({ children, secondary }) {
  // children expected to be main content (primary)
  return (
    <div className="kpb-workspace">
      <main className="kpb-primary">
        {children}
      </main>
      <aside className="kpb-secondary">
        <div className="kpb-card kpb-radius kpb-transition">
          {secondary}
        </div>
      </aside>
    </div>
  );
}
