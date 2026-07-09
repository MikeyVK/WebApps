import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TriageStoplicht from './pages/TriageStoplicht';
import FysiekFabriekFlowchart from './pages/FysiekFabriekFlowchart';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/triage" element={<TriageStoplicht />} />
        <Route path="/flowchart" element={<FysiekFabriekFlowchart />} />
      </Routes>
    </Router>
  );
}