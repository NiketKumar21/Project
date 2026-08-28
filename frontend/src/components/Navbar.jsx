import React from 'react';

export default function Navbar({ activeScreen, setActiveScreen }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <span className="nav-icon">🛡️</span>
          <div>
            <div className="nav-title">RansomGuard 360</div>
            <div className="nav-subtitle">SIH1452 Prototype</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-button ${activeScreen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveScreen('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-button ${activeScreen === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveScreen('assessment')}
          >
            📝 Risk Assessment
          </button>
          <button
            className={`nav-button ${activeScreen === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveScreen('simulation')}
          >
            ⚡ What-if Simulation
          </button>
        </nav>
      </div>
    </header>
  );
}
