import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import Button from '../design-system/components/Button'
import { isReadyToShip, getChecklistStatus } from '../utils/testChecklist'
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react'

export default function ShipPage() {
  const navigate = useNavigate()
  const [canShip, setCanShip] = React.useState(false)
  const [status, setStatus] = React.useState(null)

  useEffect(() => {
    const ready = isReadyToShip()
    setCanShip(ready)
    setStatus(getChecklistStatus())

    if (!ready) {
      // Redirect after 2 seconds if not ready
      const timer = setTimeout(() => {
        navigate('/prp/07-test')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [navigate])

  if (!canShip) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Lock size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-red-900">Shipping Locked 🔒</h1>
          </div>

          <Card className="mb-6 bg-red-50 border border-red-200">
            <p className="text-red-800 font-medium mb-3">
              {status && status.total - status.completed} test{status && status.total - status.completed > 1 ? 's' : ''} still pending
            </p>
            <p className="text-red-700 text-sm">
              Complete all {status?.total || 10} tests in the Pre-Ship Checklist before you can deploy to production.
            </p>
          </Card>

          <Button
            variant="primary"
            onClick={() => navigate('/prp/07-test')}
            className="w-full"
          >
            Return to Test Checklist
            <ArrowRight size={16} className="ml-2 inline" />
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Redirecting in 3 seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle2 size={80} className="mx-auto text-green-500 mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-green-900 mb-2">Ready to Ship! 🚀</h1>
          <p className="text-xl text-green-700">All tests passed. Platform is production-ready.</p>
        </div>

        {/* Deployment Details */}
        <Card className="mb-6 bg-white border-2 border-green-200">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-green-600">10</div>
              <p className="text-sm text-gray-600 mt-1">Tests Passed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <p className="text-sm text-gray-600 mt-1">Coverage Complete</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">✓</div>
              <p className="text-sm text-gray-600 mt-1">Quality Gate Passed</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 text-green-900">Deployment Checklist</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-800">✓ All validation tests passed</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-800">✓ Feature functionality verified</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-800">✓ Data persistence validated</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-800">✓ Export functionality confirmed</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-800">✓ No console errors detected</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Deployment Instructions */}
        <Card className="mb-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📦 Next Steps</h3>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
            <li>Run <code className="bg-blue-100 px-2 py-1 rounded">npm run build</code> to create production bundle</li>
            <li>Deploy dist/ folder to your hosting platform (Vercel, Netlify, Azure, etc.)</li>
            <li>Run smoke tests on production environment</li>
            <li>Monitor error logs and user feedback</li>
            <li>Celebrate! 🎉</li>
          </ol>
        </Card>

        {/* Pre-Deployment Notes */}
        <Card className="mb-6 bg-amber-50 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3">⚠️ Pre-Deployment Checklist</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>✓ Verify environment variables are set correctly</li>
            <li>✓ Confirm API endpoints are configured for production</li>
            <li>✓ Review localStorage quota and cleanup strategy</li>
            <li>✓ Test on production-like network conditions (throttle, offline)</li>
            <li>✓ Verify analytics and error tracking are configured</li>
            <li>✓ Ensure HTTPS is enabled for all connections</li>
            <li>✓ Backup current production data before deployment</li>
          </ul>
        </Card>

        {/* Build Command Reference */}
        <Card className="mb-6 bg-gray-50 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">🛠️ Build Command</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            npm run build
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This will create an optimized production bundle in the <code>dist/</code> directory.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate('/prp/07-test')}
          >
            Back to Tests
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Return to Dashboard
          </Button>
        </div>

        {/* Status Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            🎯 Deployment Status: <span className="font-bold text-green-600">READY</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
