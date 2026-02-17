import React from 'react'
import Card from '../design-system/components/Card'
import Badge from '../design-system/components/Badge'

export default function CompanyIntelCard({ companyIntel }) {
  if (!companyIntel) return null

  const { name, size, industry, sizeCategory, knownCompany, hiringFocus } = companyIntel

  const sizeColor = {
    'Startup': 'bg-emerald-100 text-emerald-800',
    'Mid-size': 'bg-blue-100 text-blue-800',
    'Enterprise': 'bg-purple-100 text-purple-800'
  }[size] || 'bg-gray-100 text-gray-800'

  return (
    <div className="space-y-4">
      {/* Main Company Info Card */}
      <Card className="border-l-4 border-l-primary">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{industry}</p>
          </div>
          <div className="flex flex-col items-end justify-start">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${sizeColor}`}>
              {size}
            </span>
            <p className="text-xs text-gray-500 mt-2">{sizeCategory}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            💼 Typical Hiring Focus
          </p>
          <h4 className="text-lg font-bold text-primary mb-3">{hiringFocus.title}</h4>
          <ul className="space-y-2">
            {hiringFocus.focus.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="flex-shrink-0">{item.split(' ')[0]}</span>
                <span>{item.substring(item.indexOf(' ') + 1)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 italic mt-4 pt-4 border-t border-gray-200">
            {hiringFocus.description}
          </p>
        </div>

        {!knownCompany && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">ℹ️ Demo Mode:</span> Company intel generated heuristically. Verify details with{' '}
              <span className="font-semibold">{name}</span>'s actual job posting for accuracy.
            </p>
          </div>
        )}

        {knownCompany && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-800">
              <span className="font-semibold">✓ Known Company:</span> Intel based on established interview patterns.
            </p>
          </div>
        )}
      </Card>

      {/* Interview Difficulty Indicator */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-1">
            {size === 'Enterprise' && '🎯'}
            {size === 'Mid-size' && '⚙️'}
            {size === 'Startup' && '🚀'}
          </div>
          <div className="">
            <h4 className="font-semibold text-gray-900 mb-1">Interview Complexity</h4>
            <p className="text-sm text-gray-700">
              {size === 'Enterprise' && 'Expect rigorous technical assessments with emphasis on DSA, system design, and CS fundamentals. Multiple rounds of increasing difficulty.'}
              {size === 'Mid-size' && 'Balanced approach: practical coding skills and tech stack depth matter. Usually 3-4 rounds with mix of technical and cultural fit.'}
              {size === 'Startup' && 'Fast-paced process focusing on shipping ability and adaptability. Fewer rounds but expect to discuss end-to-end product impact.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
