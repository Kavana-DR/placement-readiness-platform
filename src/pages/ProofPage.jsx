import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProof,
  updateProof,
  getStepStatus,
  validateUrl,
  validateGitHubUrl,
  getProofStatus,
  toggleStep,
  getFormattedSubmission,
  getShippingStatus,
  STEPS
} from '../utils/proofManager';
import { getChecklistStatus } from '../utils/testChecklist';
import Card from '../design-system/components/Card';
import Button from '../design-system/components/Button';
import Input from '../design-system/components/Input';

export default function ProofPage() {
  const navigate = useNavigate();
  const [proof, setProof] = useState(getProof());
  const [stepStatus, setStepStatus] = useState(getStepStatus());
  const [checklistStatus, setChecklistStatus] = useState(getChecklistStatus());
  const [proofStatus, setProofStatus] = useState(getProofStatus());
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const proof = getProof();
    const stepStatus = getStepStatus();
    const checklistStatus = getChecklistStatus();
    const proofStatus = getProofStatus();

    setProof(proof);
    setStepStatus(stepStatus);
    setChecklistStatus(checklistStatus);
    setProofStatus(proofStatus);
  }, []);

  const handleInputChange = (field, value) => {
    const updated = { ...proof, [field]: value };
    setProof(updated);
    updateProof(updated);
    setErrors({ ...errors, [field]: '' });

    // Re-validate on change
    setTimeout(() => {
      setProofStatus(getProofStatus());
    }, 0);
  };

  const handleToggleStep = (stepKey) => {
    const updatedProof = toggleStep(stepKey);
    setProof(updatedProof);
    setStepStatus(getStepStatus());

    // Re-check shipping status
    setTimeout(() => {
      setProofStatus(getProofStatus());
    }, 0);
  };

  const handleCopySubmission = () => {
    const text = getFormattedSubmission(proof);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canCopy = 
    proof.lovable_project && 
    proof.github_repo && 
    proof.deployed_url &&
    validateUrl(proof.lovable_project) &&
    validateGitHubUrl(proof.github_repo) &&
    validateUrl(proof.deployed_url);

  const shippingStatus = getShippingStatus(checklistStatus);
  const isShipped = shippingStatus.isReadyToShip;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🎯 Final Proof</h1>
          <p className="text-lg text-slate-600">Complete your submission package</p>
        </div>

        {/* Shipping Status Overview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stepStatus.completed}/{stepStatus.total}</div>
              <div className="text-sm text-slate-600 mt-1">Steps Complete</div>
              <div className={`text-xs mt-2 font-semibold ${stepStatus.isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {stepStatus.isComplete ? '✓ Ready' : `${stepStatus.total - stepStatus.completed} pending`}
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">{checklistStatus.completed}/{checklistStatus.total}</div>
              <div className="text-sm text-slate-600 mt-1">Tests Passed</div>
              <div className={`text-xs mt-2 font-semibold ${checklistStatus.isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {checklistStatus.isComplete ? '✓ All passed' : `${checklistStatus.total - checklistStatus.completed} remaining`}
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-3xl font-bold ${proofStatus.allLinksValid ? 'text-purple-600' : 'text-slate-400'}`}>
                {proofStatus.allLinksValid ? '3' : '0'}/3
              </div>
              <div className="text-sm text-slate-600 mt-1">Links Valid</div>
              <div className={`text-xs mt-2 font-semibold ${proofStatus.allLinksValid ? 'text-green-600' : 'text-amber-600'}`}>
                {proofStatus.allLinksValid ? '✓ All set' : 'Pending validation'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isShipped
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}
              style={{
                width: `${isShipped ? 100 : Math.min(100, Math.round(
                  ((stepStatus.completed / stepStatus.total) * 0.33 +
                   (checklistStatus.completed / checklistStatus.total) * 0.33 +
                   (proofStatus.allLinksValid ? 1 : 0) * 0.34) * 100
                ))}%`
              }}
            />
          </div>

          <div className="text-center mt-4 text-sm font-medium text-slate-700">
            {isShipped ? (
              <span className="text-green-600 font-bold">✅ Ready to Ship!</span>
            ) : (
              <span className="text-amber-600">⏳ In Progress</span>
            )}
          </div>
        </Card>

        {/* Step Completion Overview */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📋 Step Completion Overview</h2>
          <p className="text-slate-600 mb-6">Mark each step as you complete them in the platform:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((step) => (
              <button
                key={step.key}
                onClick={() => handleToggleStep(step.key)}
                className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer hover:shadow-md ${
                  stepStatus.steps[step.key]
                    ? 'bg-green-50 border-green-300 hover:bg-green-100'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-bold text-white text-lg transition-all ${
                      stepStatus.steps[step.key] ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    {stepStatus.steps[step.key] ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{step.name}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!stepStatus.isComplete && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 text-sm">
                ⚠️ Complete all {stepStatus.total} steps to enable shipping. {stepStatus.total - stepStatus.completed} remaining.
              </p>
            </div>
          )}
        </Card>

        {/* Artifact Inputs */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🔗 Artifact Inputs (Required for Ship)</h2>
          <p className="text-slate-600 mb-6">Provide links to your project, repository, and deployment:</p>

          <div className="space-y-6">
            {/* Lovable Project */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lovable Project Link <span className="text-red-500">*</span>
              </label>
              <Input
                type="url"
                placeholder="https://lovable.dev/projects/..."
                value={proof.lovable_project}
                onChange={(e) => handleInputChange('lovable_project', e.target.value)}
                className={`${errors.lovable_project ? 'border-red-500' : ''} transition-colors`}
              />
              {errors.lovable_project && (
                <p className="text-red-500 text-sm mt-2">❌ {errors.lovable_project}</p>
              )}
              {proof.lovable_project && validateUrl(proof.lovable_project) && !errors.lovable_project && (
                <p className="text-green-600 text-sm mt-2">✓ Valid URL</p>
              )}
              {proof.lovable_project && !validateUrl(proof.lovable_project) && !errors.lovable_project && (
                <p className="text-amber-600 text-sm mt-2">⚠️ Invalid URL format</p>
              )}
            </div>

            {/* GitHub Repository */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                GitHub Repository Link <span className="text-red-500">*</span>
              </label>
              <Input
                type="url"
                placeholder="https://github.com/username/placement-readiness-platform"
                value={proof.github_repo}
                onChange={(e) => handleInputChange('github_repo', e.target.value)}
                className={`${errors.github_repo ? 'border-red-500' : ''} transition-colors`}
              />
              {errors.github_repo && (
                <p className="text-red-500 text-sm mt-2">❌ {errors.github_repo}</p>
              )}
              {proof.github_repo && validateGitHubUrl(proof.github_repo) && !errors.github_repo && (
                <p className="text-green-600 text-sm mt-2">✓ Valid GitHub URL</p>
              )}
              {proof.github_repo && !validateGitHubUrl(proof.github_repo) && !errors.github_repo && (
                <p className="text-amber-600 text-sm mt-2">⚠️ Not a valid GitHub URL</p>
              )}
            </div>

            {/* Deployed URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Live Deployment URL <span className="text-red-500">*</span>
              </label>
              <Input
                type="url"
                placeholder="https://your-deployment.com"
                value={proof.deployed_url}
                onChange={(e) => handleInputChange('deployed_url', e.target.value)}
                className={`${errors.deployed_url ? 'border-red-500' : ''} transition-colors`}
              />
              {errors.deployed_url && (
                <p className="text-red-500 text-sm mt-2">❌ {errors.deployed_url}</p>
              )}
              {proof.deployed_url && validateUrl(proof.deployed_url) && !errors.deployed_url && (
                <p className="text-green-600 text-sm mt-2">✓ Valid URL</p>
              )}
              {proof.deployed_url && !validateUrl(proof.deployed_url) && !errors.deployed_url && (
                <p className="text-amber-600 text-sm mt-2">⚠️ Invalid URL format</p>
              )}
            </div>
          </div>

          {!proofStatus.allLinksValid && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 text-sm">
                ⚠️ All three links are required and must be valid URLs to enable shipping.
              </p>
            </div>
          )}
        </Card>

        {/* Final Submission Export */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📤 Final Submission Export</h2>
          <p className="text-slate-600 mb-6">
            Copy your formatted submission package and share it with your placement center:
          </p>

          <button
            onClick={handleCopySubmission}
            disabled={!canCopy}
            className={`w-full py-3 rounded-lg font-semibold transition-all text-lg ${
              canCopy
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Final Submission'}
          </button>

          {canCopy && (
            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-700 whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
              {getFormattedSubmission(proof)}
            </div>
          )}

          {!canCopy && (
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <p className="text-slate-600 text-sm">
                💡 Fill in all three artifact links above and ensure they are valid to enable export.
              </p>
            </div>
          )}
        </Card>

        {/* Shipped Status Message */}
        {isShipped && (
          <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
            <div className="text-center py-8">
              <div className="text-6xl mb-6 animate-bounce">🚀</div>
              <h2 className="text-4xl font-bold text-green-900 mb-6">Status: Shipped</h2>
              <div className="bg-white rounded-lg p-8 mb-6 border border-green-200">
                <p className="text-lg text-slate-800 mb-4 leading-relaxed font-medium">
                  "You built a real product.
                </p>
                <p className="text-lg text-slate-800 mb-4 leading-relaxed font-medium">
                  Not a tutorial. Not a clone.
                </p>
                <p className="text-lg text-slate-800 mb-4 leading-relaxed font-medium">
                  A structured tool that solves a real problem.
                </p>
                <p className="text-2xl text-green-700 font-bold mt-6">
                  This is your proof of work."
                </p>
              </div>

              {/* Shipped Details */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="text-2xl text-green-600 font-bold">✓</div>
                  <div className="text-xs text-slate-600 mt-2">All 8 Steps</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="text-2xl text-green-600 font-bold">✓</div>
                  <div className="text-xs text-slate-600 mt-2">All 10 Tests</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="text-2xl text-green-600 font-bold">✓</div>
                  <div className="text-xs text-slate-600 mt-2">All 3 Links</div>
                </div>
              </div>

              <p className="text-slate-600 text-sm">
                Timestamp: {proof.submitted_at || new Date().toLocaleString()}
              </p>
            </div>
          </Card>
        )}

        {/* Status Warning */}
        {!isShipped && (
          <Card className="mb-8 bg-slate-50 border-slate-300">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏳</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Not Ready to Ship Yet</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  {!stepStatus.isComplete && (
                    <li>• Complete all {stepStatus.total} steps ({stepStatus.total - stepStatus.completed} pending)</li>
                  )}
                  {!checklistStatus.isComplete && (
                    <li>• Pass all {checklistStatus.total} checklist tests ({checklistStatus.total - checklistStatus.completed} remaining)</li>
                  )}
                  {!proofStatus.allLinksValid && (
                    <li>• Provide all three valid artifact links</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-colors font-semibold"
          >
            ← Back to Dashboard
          </button>
          {isShipped && (
            <button
              onClick={() => {
                alert('📦 Proof package is ready for submission.\n\nYour links have been validated and stored.');
                navigate('/dashboard');
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold"
            >
              ✓ Confirm Submission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
