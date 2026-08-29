import React from 'react';

export default function Navbar({ activeScreen, setActiveScreen }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <span className="nav-icon">🛡️</span>
          <div>
            <div className="nav-title">
              RansomGuard <span className="nav-title-highlight">360</span>
            </div>
            <div className="nav-subtitle">SIH 2026 • Ransomware Readiness Platform</div>
          </div>
        </div>

        <div className="system-status-badge">
          <span className="pulse-dot"></span>
          <span>SOC API ONLINE</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-button ${activeScreen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveScreen('dashboard')}
          >
            📊 Security Dashboard
          </button>
          <button
            className={`nav-button ${activeScreen === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveScreen('assessment')}
          >
            📝 Readiness Console
          </button>
          <button
            className={`nav-button ${activeScreen === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveScreen('simulation')}
          >
            ⚡ Attack Simulation
          </button>
        </nav>
      </div>
    </header>
  );
}
