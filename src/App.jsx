import "./design-system/design-system.css";
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import PracticePage from './pages/dashboard/PracticePage'
import AssessmentsPage from './pages/dashboard/AssessmentsPage'
import ResourcesPage from './pages/dashboard/ResourcesPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import AnalyzePage from './pages/dashboard/AnalyzePage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import ApplicationsPage from './pages/ApplicationsPage'
import TestChecklistPage from './pages/TestChecklistPage'
import ShipPage from './pages/ShipPage'
import ProofPage from './pages/ProofPage'
import ResumeBuilder from '../resume-builder/src/App'
import ResumeBuilderHome from '../resume-builder/src/pages/Home'
import ResumeBuilderBuilder from '../resume-builder/src/pages/Builder'
import ResumeBuilderPreview from '../resume-builder/src/pages/Preview'
import '../resume-builder/src/index.css'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route index element={<DashboardHome/>} />
          <Route path="practice" element={<PracticePage/>} />
          <Route path="assessments" element={<AssessmentsPage/>} />
          <Route path="resources" element={<ResourcesPage/>} />
          <Route path="profile" element={<ProfilePage/>} />
        </Route>
        <Route path="/analyze" element={<DashboardLayout/>}>
          <Route index element={<AnalyzePage/>} />
        </Route>
        <Route path="/history" element={<DashboardLayout/>}>
          <Route index element={<HistoryPage/>} />
        </Route>
        <Route path="/applications" element={<DashboardLayout/>}>
          <Route index element={<ApplicationsPage/>} />
        </Route>
        <Route path="/results/:id" element={<DashboardLayout/>}>
          <Route index element={<ResultsPage/>} />
        </Route>
        <Route path="/prp/07-test" element={<DashboardLayout/>}>
          <Route index element={<TestChecklistPage/>} />
        </Route>
        <Route path="/prp/08-ship" element={<DashboardLayout/>}>
          <Route index element={<ShipPage/>} />
        </Route>
        <Route path="/prp/proof" element={<DashboardLayout/>}>
          <Route index element={<ProofPage/>} />
        </Route>
        <Route path="/resume-builder" element={<DashboardLayout/>}>
          <Route element={<ResumeBuilder />}>
            <Route index element={<ResumeBuilderHome />} />
            <Route path="builder" element={<ResumeBuilderBuilder />} />
            <Route path="preview" element={<ResumeBuilderPreview />} />
            <Route path="proof" element={<Navigate to="/resume-builder/preview" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
