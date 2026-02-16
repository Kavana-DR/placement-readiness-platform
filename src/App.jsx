import "./design-system/design-system.css";

import TopBar from "./design-system/layout/TopBar";
import ContextHeader from "./design-system/layout/ContextHeader";
import WorkspaceLayout from "./design-system/layout/WorkspaceLayout";
import ProofFooter from "./design-system/layout/ProofFooter";

function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <ContextHeader
        title="Placement Readiness Platform"
        subtitle="Build your preparation system with structure and clarity."
      />
      <WorkspaceLayout />
      <ProofFooter />
    </div>
  );
}

export default App;
