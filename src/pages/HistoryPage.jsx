import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../design-system/components/Card'
import Button from '../design-system/components/Button'
import { getHistory, deleteEntry, clearHistory, getLoadError } from '../utils/historyManager'
import { AlertCircle } from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState(() => getHistory())
  const loadError = getLoadError()
  const navigate = useNavigate()

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry?')) {
      deleteEntry(id)
      setHistory(history.filter(e => e.id !== id))
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 max-w-5xl">
        <h2 className="text-3xl font-semibold">Analysis History</h2>
        {history.length > 0 && (
          <Button variant="secondary" onClick={handleClear} className="bg-red-100 text-red-700">
            Clear All
          </Button>
        )}
      </div>

      {/* Load Error Alert */}
      {loadError && (
        <Card className="mb-6 bg-amber-50 border border-amber-200">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Data Loading Issue</h3>
              <p className="text-sm text-amber-800">{loadError}</p>
            </div>
          </div>
        </Card>
      )}

      {history.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-600">
            <p>No analyses yet.</p>
            <Button variant="primary" onClick={() => navigate('/analyze')} className="mt-4">
              Create Your First Analysis
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map(entry => (
            <Card key={entry.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/results/${entry.id}`)}>
                  <h3 className="font-semibold">{entry.company || 'Unknown Company'}</h3>
                  <p className="text-sm text-gray-600">{entry.role || 'Unknown Role'}</p>
                  <p className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{entry.finalScore || entry.readinessScore || 0}</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/results/${entry.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-100 text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
