import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-lg font-semibold">Placement Readiness</div>
          <nav className="space-x-4">
            <Link to="/" className="text-sm text-primary">Home</Link>
            <Link to="/dashboard" className="text-sm text-primary">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">Ace Your Placement</h1>
              <p className="text-lg text-gray-700 mb-6">Practice, assess, and prepare for your dream job</p>
              <Link to="/dashboard" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-semibold">Get Started</Link>
            </div>
            <div className="hidden md:block">
              <div className="h-56 bg-white rounded-lg border border-gray-100"></div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-md border">
                <div className="text-2xl mb-2">💻</div>
                <h3 className="font-semibold">Practice Problems</h3>
                <p className="text-sm text-gray-600">A curated set of coding problems to sharpen your skills.</p>
              </div>
              <div className="bg-white p-6 rounded-md border">
                <div className="text-2xl mb-2">🎥</div>
                <h3 className="font-semibold">Mock Interviews</h3>
                <p className="text-sm text-gray-600">Live and recorded mock interviews with feedback.</p>
              </div>
              <div className="bg-white p-6 rounded-md border">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor your improvement over time with simple analytics.</p>
              </div>
            </div>
          </section>

          <footer className="mt-12 py-8 text-center text-sm text-gray-600">© {new Date().getFullYear()} Placement Readiness Platform</footer>
        </div>
      </main>
    </div>
  )
}
