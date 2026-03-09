import React from 'react'
import Card from '../design-system/components/Card'
import { getStoredApplications } from '../utils/internshipRecommendations'

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState(() => getStoredApplications())

  React.useEffect(() => {
    const syncFromStorage = () => setApplications(getStoredApplications())
    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8">Applied Internships</h2>

      {applications.length === 0 ? (
        <Card>
          <div className="text-gray-600 py-6">No applications yet. Apply from Recommended Internships on the dashboard.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications
            .slice()
            .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
            .map((application) => (
              <Card key={`${application.jobTitle}-${application.company}-${application.dateApplied}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                    <p className="text-sm text-gray-700">Company: {application.company}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Applied on: {new Date(application.dateApplied).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
