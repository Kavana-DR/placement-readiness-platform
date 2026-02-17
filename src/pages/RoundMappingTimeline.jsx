import React, { useState } from 'react'
import Card from '../design-system/components/Card'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function RoundMappingTimeline({ rounds }) {
  const [expandedRound, setExpandedRound] = useState(0)

  if (!rounds || rounds.length === 0) return null

  const getRoundIcon = (type) => {
    const icons = {
      'online-test': '💻',
      'technical-dsa': '🧠',
      'technical-advanced': '🏗️',
      'technical-projects': '🎬',
      'hr-round': '👥'
    }
    return icons[type] || '📋'
  }

  const getRoundColor = (type, index) => {
    const colors = {
      'online-test': 'from-blue-500 to-blue-600',
      'technical-dsa': 'from-purple-500 to-purple-600',
      'technical-advanced': 'from-orange-500 to-orange-600',
      'technical-projects': 'from-green-500 to-green-600',
      'hr-round': 'from-red-500 to-red-600'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">📌 Interview Round Mapping</h3>
        <p className="text-sm text-gray-600">
          Expected interview flow based on <span className="font-semibold">company size</span> and <span className="font-semibold">detected skills</span>
        </p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-4">
        {rounds.map((round, index) => (
          <div key={round.round} className="relative">
            {/* Timeline connector line */}
            {index < rounds.length - 1 && (
              <div className="absolute left-5 top-20 w-1 h-12 bg-gradient-to-b from-primary to-gray-300 opacity-50"></div>
            )}

            {/* Card */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => setExpandedRound(expandedRound === index ? -1 : index)}
            >
              <div className="flex items-start gap-4">
                {/* Icon Node */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br ${getRoundColor(
                    round.type,
                    index
                  )} text-white font-bold`}
                >
                  {getRoundIcon(round.type)}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          Round {round.round}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{round.estimatedDuration}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{round.title}</h4>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 ml-2">
                      {expandedRound === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedRound === index && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                      {/* Details */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          What to Expect
                        </p>
                        <ul className="space-y-2">
                          {round.details.map((detail, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                              <span className="text-primary font-bold">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Why It Matters */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Why This Round Matters
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{round.whyItMatters}</p>
                      </div>

                      {/* Preparation Tip */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-blue-900">
                          <span className="font-semibold">💡 Tip:</span> {getPreparationTip(round.type)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <Card className="bg-green-50 border border-green-200 mt-8">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Next Steps</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Review Round 1 requirements immediately</li>
              <li>• Practice the specific skills mentioned</li>
              <li>• Use the 7-Day Plan to structure your prep</li>
              <li>• Mark skills in the overview to track progress</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getPreparationTip(roundType) {
  const tips = {
    'online-test': 'Practice on coding platforms (LeetCode/HackerRank). Focus on time management and clean code.',
    'technical-dsa': 'Be ready to explain your approach clearly. Discuss trade-offs and optimizations.',
    'technical-advanced': 'Research common system design questions. Think about scale and distributed concepts.',
    'technical-projects': 'Prepare 2-3 strong projects with clear impact. Practice explaining architecture decisions.',
    'hr-round': 'Prepare stories using STAR method. Research company values and align your narrative.'
  }
  return tips[roundType] || 'Prepare thoroughly and be ready to discuss your experience.'
}
