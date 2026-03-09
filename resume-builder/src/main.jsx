import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Builder from './pages/Builder.jsx'
import Preview from './pages/Preview.jsx'
import Proof from './pages/Proof.jsx'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/proof" element={<Proof />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
