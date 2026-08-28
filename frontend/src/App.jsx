import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Simulation from './pages/Simulation';
import { fetchAssessmentResult } from './services/api';
import './styles/main.css';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [assessmentData, setAssessmentData] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      const data = await fetchAssessmentResult();
      setAssessmentData(data);
    }
    loadInitialData();
  }, []);

  return (
    <div className="app-container">
      <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      <main className="main-content">
        {activeScreen === 'dashboard' && (
          <Dashboard 
            assessmentData={assessmentData} 
            setAssessmentData={setAssessmentData}
            setActiveScreen={setActiveScreen} 
          />
        )}

        {activeScreen === 'assessment' && (
          <Assessment 
            onAssessmentComplete={(newResult) => setAssessmentData(newResult)}
            setActiveScreen={setActiveScreen} 
          />
        )}

        {activeScreen === 'simulation' && (
          <Simulation 
            assessmentData={assessmentData} 
            setActiveScreen={setActiveScreen} 
          />
        )}
      </main>

      <footer className="footer">
        SIH1452 — Interactive Ransomware Risk and Readiness Assessment Platform • Prototype Version 2.0 (Safe Deterministic Analytics Only)
      </footer>
    </div>
  );
}
