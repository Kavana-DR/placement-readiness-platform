import React from 'react'
import Card from '../../design-system/components/Card'
import {
  completePracticeTopic,
  getPracticeProgress,
  resetPracticeProgress,
  savePracticeProgress,
} from '../../utils/practiceProgress'

const TOPICS = [
  'Arrays',
  'Dynamic Programming',
  'Graphs',
  'System Design',
  'Behavioral Interview',
]

export default function PracticePage() {
  const [progress, setProgress] = React.useState(() => getPracticeProgress())
  const [topic, setTopic] = React.useState(TOPICS[0])

  React.useEffect(() => {
    const sync = () => setProgress(getPracticeProgress())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const handleComplete = () => {
    const next = completePracticeTopic(topic)
    setProgress(next)
  }

  const handleReset = () => {
    const next = resetPracticeProgress()
    setProgress(next)
  }

  const handleTargetChange = (value) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    const next = savePracticeProgress({ ...progress, total: parsed })
    setProgress(next)
  }

  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Practice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Topic</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              >
                {TOPICS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Practice Target</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="number"
                min={1}
                value={progress.total}
                onChange={(event) => handleTargetChange(event.target.value)}
              />
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="bg-primary h-3 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>

            <div className="text-sm text-gray-600">
              {progress.completed}/{progress.total} completed ({Math.min(100, pct)}%)
            </div>

            <div className="flex gap-3">
              <button type="button" className="bg-primary text-white px-4 py-2 rounded-md" onClick={handleComplete}>
                Mark Topic Complete
              </button>
              <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md" onClick={handleReset}>
                Reset Progress
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Current Snapshot</h3>
            <p className="text-sm text-gray-700">Last Topic: {progress.lastTopic || 'Not started'}</p>
            <p className="text-sm text-gray-700">Weekly Solved: {progress.weeklySolved}/{progress.weeklyTarget}</p>
            <p className="text-sm text-gray-500">Last Updated: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleString() : 'Not available'}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
