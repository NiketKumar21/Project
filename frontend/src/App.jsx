import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Simulation from './pages/Simulation';
import { fetchAssessmentResult, API_BASE_URL } from './services/api';
import './styles/main.css';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [assessmentData, setAssessmentData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const loadInitialData = async () => {
    setLoadingInitial(true);
    setConnectionError(false);
    const data = await fetchAssessmentResult();
    if (data) {
      setAssessmentData(data);
      setConnectionError(false);
    } else {
      setConnectionError(true);
    }
    setLoadingInitial(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className="app-container">
      <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      <main className="main-content">
        {connectionError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--risk-high)',
            color: '#fca5a5',
            padding: '1.2rem 1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <strong>⚠️ Backend Service Offline:</strong> Unable to connect to FastAPI backend at <code>{API_BASE_URL}</code>.
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Please ensure the backend is running by executing: <code>python run.py</code> inside the <code>backend/</code> folder.
              </div>
            </div>
            <button 
              className="btn-secondary" 
              onClick={loadInitialData}
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
            >
              🔄 Retry Connection
            </button>
          </div>
        )}

        {activeScreen === 'dashboard' && (
          <Dashboard 
            assessmentData={assessmentData} 
            setAssessmentData={setAssessmentData}
            setActiveScreen={setActiveScreen} 
            loadingInitial={loadingInitial}
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
        ThreatLens • See vulnerabilities before attackers do
      </footer>
    </div>
  );
}
