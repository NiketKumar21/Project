import React from 'react';

export default function Navbar({ activeScreen, setActiveScreen }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <span className="nav-icon">🛡️</span>
          <div>
            <div className="nav-title">
              Threat<span className="nav-title-highlight">Lens</span>
            </div>
            <div className="nav-subtitle">See vulnerabilities before attackers do</div>
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
