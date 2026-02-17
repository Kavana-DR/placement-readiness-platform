import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import Button from '../design-system/components/Button'
import Checkbox from '../design-system/components/Checkbox'
import { getChecklist, toggleTest, getChecklistStatus, resetChecklist } from '../utils/testChecklist'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TestChecklistPage() {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState([])
  const [status, setStatus] = useState({ completed: 0, total: 10, isComplete: false })

  useEffect(() => {
    const initial = getChecklist()
    setChecklist(initial)
    const initialStatus = getChecklistStatus()
    setStatus(initialStatus)
  }, [])

  const handleToggle = (testId) => {
    const updated = toggleTest(testId)
    setChecklist(updated)
    setStatus(getChecklistStatus())
  }

  const handleReset = () => {
    if (window.confirm('Reset all tests? This will uncheck everything.')) {
      const reset = resetChecklist()
      setChecklist(reset)
      setStatus(getChecklistStatus())
    }
  }

  const handleShip = () => {
    if (status.isComplete) {
      navigate('/prp/08-ship')
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🚀 Pre-Ship Test Checklist</h1>
          <p className="text-gray-600">Run through all 10 tests before shipping to production</p>
        </div>

        {/* Progress Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">
                {status.completed} <span className="text-lg text-gray-600">/ {status.total}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Tests Passed</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{status.percentage}%</div>
              <p className="text-sm text-gray-600 mt-1">Complete</p>
            </div>
            <div className="w-32 h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                style={{ width: `${status.percentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Warning Banner */}
        {!status.isComplete && (
          <Card className="mb-6 bg-amber-50 border border-amber-200">
            <div className="flex gap-3 items-start">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Fix issues before shipping</h3>
                <p className="text-sm text-amber-800 mt-1">
                  {status.total - status.completed} test{status.total - status.completed > 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Success Banner */}
        {status.isComplete && (
          <Card className="mb-6 bg-green-50 border border-green-200">
            <div className="flex gap-3 items-start">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">All tests passed! ✨</h3>
                <p className="text-sm text-green-800 mt-1">
                  Platform is ready to ship. Proceed to production deployment.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Checklist Items */}
        <div className="space-y-3 mb-8">
          {checklist.map((test, index) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={test.completed}
                    onChange={() => handleToggle(test.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Test {index + 1}
                    </span>
                    {test.completed && (
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        ✓ Passed
                      </span>
                    )}
                  </div>
                  <h3 className={`font-medium ${test.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {test.name}
                  </h3>
                  {test.hint && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      💡 {test.hint}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Reset Checklist
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={handleShip}
              disabled={!status.isComplete}
              className={!status.isComplete ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {status.isComplete ? '🚀 Ship to Production' : '🔒 Complete All Tests to Ship'}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Test Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Complete tests in the suggested order (1-3 are basics, 4-7 are features, 8-10 are integration)</li>
            <li>✓ Each test has a "How to test" hint - click to expand or hover to see details</li>
            <li>✓ Test in different scenarios: empty inputs, edge cases, multi-entry flows</li>
            <li>✓ Use browser DevTools (F12) to check the Console for errors</li>
            <li>✓ Your checklist progress is saved automatically</li>
            <li>✓ Once all 10 tests ✓ pass, the "Ship to Production" button unlocks</li>
          </ul>
        </Card>

        {/* Test Distribution */}
        <Card className="mt-6 bg-indigo-50 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3">🎯 Test Categories</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-indigo-900">Input Validation</div>
              <p className="text-indigo-700 text-xs mt-1">Tests 1-2: Verify JD validation</p>
            </div>
            <div>
              <div className="font-medium text-indigo-900">Feature Logic</div>
              <p className="text-indigo-700 text-xs mt-1">Tests 3-6: Skills, rounds, scores, toggles</p>
            </div>
            <div>
              <div className="font-medium text-indigo-900">Persistence & Export</div>
              <p className="text-indigo-700 text-xs mt-1">Tests 7-10: Data, history, exports, console</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
