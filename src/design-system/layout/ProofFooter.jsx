import React, { useState } from 'react';
import '../design-system.css';

const CHECKS = [
  'UI Built',
  'Logic Working',
  'Test Passed',
  'Deployed'
];

export default function ProofFooter() {
  const [checked, setChecked] = useState(() => CHECKS.map(() => false));
  const [proofs, setProofs] = useState(() => CHECKS.map(() => ''));

  const toggle = (i) => {
    const next = [...checked]; next[i] = !next[i]; setChecked(next);
  };

  const updateProof = (i, v) => {
    const next = [...proofs]; next[i] = v; setProofs(next);
  };

  return (
    <footer className="kpb-proof-footer">
      {CHECKS.map((label, i) => (
        <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <label className="kpb-checkbox">
            <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
            <span>{label}</span>
          </label>
          <div style={{ minWidth: 220 }}>
            <input
              className="kpb-input"
              placeholder={`Proof for ${label} (link, note)`}
              value={proofs[i]}
              onChange={(e) => updateProof(i, e.target.value)}
            />
          </div>
        </div>
      ))}
    </footer>
  );
}
