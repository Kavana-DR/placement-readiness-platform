/**
 * Proof & Submission Manager
 * Manages final submission artifacts and step completion tracking
 * Storage: localStorage['prp_final_submission']
 */

const STORAGE_KEY = 'prp_final_submission';

export const STEPS = [
  { key: 'step_analyze', name: 'Analyze & Extract', description: 'JD skill extraction' },
  { key: 'step_assessment', name: 'Assessment', description: 'Skills evaluation' },
  { key: 'step_strategy', name: 'Strategy', description: 'Round mapping' },
  { key: 'step_planning', name: 'Planning', description: 'Prep plan creation' },
  { key: 'step_practice', name: 'Practice', description: 'Mock interviews' },
  { key: 'step_resources', name: 'Resources', description: 'Learning materials' },
  { key: 'step_readiness', name: 'Readiness', description: 'Overall assessment' },
  { key: 'step_submission', name: 'Submission', description: 'Final proof' }
];

/**
 * Initialize proof structure in localStorage
 */
export function initializeProof() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultProof = {
      lovable_project: '',
      github_repo: '',
      deployed_url: '',
      steps: {
        step_analyze: false,
        step_assessment: false,
        step_strategy: false,
        step_planning: false,
        step_practice: false,
        step_resources: false,
        step_readiness: false,
        step_submission: false
      },
      submitted_at: null,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProof));
    return defaultProof;
  }
  return JSON.parse(existing);
}

/**
 * Get current proof data from localStorage
 */
export function getProof() {
  const proof = localStorage.getItem(STORAGE_KEY);
  if (!proof) {
    return initializeProof();
  }
  return JSON.parse(proof);
}

/**
 * Update proof data in localStorage
 */
export function updateProof(updates) {
  const proof = getProof();
  const updated = { ...proof, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Update individual step completion status
 */
export function updateStep(stepKey, completed) {
  const proof = getProof();
  proof.steps[stepKey] = completed;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proof));
  return proof;
}

/**
 * Toggle step completion
 */
export function toggleStep(stepKey) {
  const proof = getProof();
  proof.steps[stepKey] = !proof.steps[stepKey];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proof));
  return proof;
}

/**
 * Get step completion status
 */
export function getStepStatus() {
  const proof = getProof();
  const steps = proof.steps;
  const completed = Object.values(steps).filter(s => s).length;
  const total = Object.keys(steps).length;
  return {
    completed,
    total,
    isComplete: completed === total,
    steps
  };
}

/**
 * Validate URL format
 */
export function validateUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate GitHub URL specifically
 */
export function validateGitHubUrl(url) {
  if (!url) return false;
  if (!validateUrl(url)) return false;
  return url.toLowerCase().includes('github.com');
}

/**
 * Get complete proof status
 * Returns: { allStepsComplete, allLinksProvided, allLinksValid, proof }
 */
export function getProofStatus() {
  const proof = getProof();
  const stepStatus = getStepStatus();
  
  const hasAllLinks = 
    proof.lovable_project && 
    proof.github_repo && 
    proof.deployed_url;
  
  const validLinks = 
    validateUrl(proof.lovable_project) &&
    validateGitHubUrl(proof.github_repo) &&
    validateUrl(proof.deployed_url);
  
  return {
    allStepsComplete: stepStatus.isComplete,
    allLinksProvided: hasAllLinks,
    allLinksValid: validLinks,
    proof,
    stepStatus
  };
}

/**
 * Get shipping readiness status
 * Checks all 3 conditions for "Shipped" status
 */
export function getShippingStatus(checklistStatus) {
  const proofStatus = getProofStatus();
  
  return {
    allStepsComplete: proofStatus.allStepsComplete,
    allTestsPassed: checklistStatus.isComplete,
    allLinksProvided: proofStatus.allLinksProvided && proofStatus.allLinksValid,
    isReadyToShip: 
      proofStatus.allStepsComplete && 
      checklistStatus.isComplete && 
      proofStatus.allLinksProvided &&
      proofStatus.allLinksValid
  };
}

/**
 * Mark submission as shipped
 */
export function markAsShipped() {
  const proof = getProof();
  proof.submitted_at = new Date().toISOString();
  proof.status = 'shipped';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proof));
  return proof;
}

/**
 * Reset all proof data
 */
export function resetProof() {
  localStorage.removeItem(STORAGE_KEY);
  return initializeProof();
}

/**
 * Mark all steps as completed (for testing)
 */
export function completeAllSteps() {
  const proof = getProof();
  Object.keys(proof.steps).forEach(key => {
    proof.steps[key] = true;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proof));
  return proof;
}

/**
 * Get formatted submission text
 */
export function getFormattedSubmission(proof) {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${proof.lovable_project}
GitHub Repository: ${proof.github_repo}
Live Deployment: ${proof.deployed_url}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
}
