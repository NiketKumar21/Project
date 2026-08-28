import React, { useState, useEffect } from 'react';
import { fetchScenarios } from '../services/api';
import '../styles/simulation.css';

export default function Simulation({ assessmentData, setActiveScreen }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchScenarios();
      setScenarios(data);
      if (data.length > 0) setSelectedScenarioId(data[0].id);
      setLoading(false);
    }
    loadData();
  }, []);

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId);

  return (
    <div className="simulation-container">
      <div className="simulation-header">
        <h1 className="simulation-title">⚡ Safe What-If Ransomware Attack Simulation</h1>
        <p className="simulation-subtitle">
          Test defensive security controls against simulated ransomware scenarios to measure risk reduction.
        </p>
      </div>

      {loading ? (
        <div className="card">Loading simulation scenarios...</div>
      ) : (
        <div className="simulation-grid">
          {/* Scenario & Controls Panel */}
          <div className="card">
            <div className="card-title">🎯 Select Threat Scenario</div>
            <div className="scenario-selector">
              <select 
                className="scenario-select"
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
              >
                {scenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.attack_vector})
                  </option>
                ))}
              </select>
            </div>

            {currentScenario && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {currentScenario.description}
                </p>

                <div className="card-title" style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
                  🛡️ Security Control Toggles
                </div>

                <div className="controls-list">
                  {currentScenario.controls.map((ctrl) => (
                    <div key={ctrl.id} className="control-item">
                      <input 
                        type="checkbox" 
                        id={ctrl.id} 
                        className="control-checkbox" 
                        defaultChecked={false}
                      />
                      <div className="control-details">
                        <label htmlFor={ctrl.id} className="control-title" style={{ cursor: 'pointer' }}>
                          {ctrl.name}
                        </label>
                        <div className="control-meta">
                          {ctrl.category} • -{ctrl.impact_points} Risk Points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simulation Output Panel */}
          <div className="card">
            <div className="card-title">📊 Simulated Impact & Risk Delta</div>
            
            <div className="comparison-box">
              <div className="comparison-card">
                <div className="comparison-label">Before Risk</div>
                <div className="comparison-value" style={{ color: 'var(--risk-moderate)' }}>
                  {Math.round(assessmentData?.ransomware_risk_score || 52)}
                </div>
              </div>

              <div className="comparison-card">
                <div className="comparison-label">After Risk</div>
                <div className="comparison-value" style={{ color: 'var(--risk-low)' }}>
                  32
                </div>
              </div>

              <div className="comparison-card">
                <div className="comparison-label">Risk Reduction</div>
                <div className="comparison-value" style={{ color: 'var(--primary-teal-hover)' }}>
                  -20 pts
                </div>
              </div>
            </div>

            {/* DEMO Impact Banner */}
            <div className="impact-demo-box">
              <div className="impact-demo-header">
                <span>ℹ️ DEMO / SIMULATED IMPACT VALUES</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                • Projected Downtime Savings: <strong>48 Hours Saved</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                • Projected Business Loss Mitigation: <strong>$60,000 SIMULATED SAVINGS</strong>
              </p>
            </div>

            <div className="card-title" style={{ fontSize: '1rem' }}>
              💡 Recommended Remediation Steps
            </div>
            {currentScenario && (
              <ul className="remediation-list">
                {currentScenario.remediation.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
