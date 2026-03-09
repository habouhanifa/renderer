import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index.jsx'
import ComponentPage from './pages/ComponentPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/components/:slug" element={<ComponentPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
