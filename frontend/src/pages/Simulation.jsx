import React, { useState, useEffect } from 'react';
import { fetchScenarios, runSimulation } from '../services/api';
import '../styles/simulation.css';

export default function Simulation({ assessmentData, setActiveScreen }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [controlEnabled, setControlEnabled] = useState(false); // Default to Disabled (Attack Exposure)
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  // Load scenarios from API on mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchScenarios();
      setScenarios(data);
      if (data.length > 0) {
        setSelectedScenarioId(data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Run simulation calculation whenever scenario selection or control status toggle changes
  useEffect(() => {
    if (!selectedScenarioId) return;

    async function executeSim() {
      try {
        setSimulating(true);
        const result = await runSimulation(selectedScenarioId, controlEnabled);
        setSimulationResult(result);
        setSimulating(false);
      } catch (err) {
        console.error('Simulation execution failed:', err);
        setSimulating(false);
      }
    }

    executeSim();
  }, [selectedScenarioId, controlEnabled, assessmentData]);

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId);

  return (
    <div className="simulation-container">
      {/* Page Header */}
      <div className="simulation-header">
        <h1 className="simulation-title">⚡ Threat Simulation Console</h1>
        <p className="simulation-subtitle">
          Test the impact of 6 predefined security scenarios against baseline risk posture. Evaluates score deltas, conceptual attack flows, and simulated business impact.
        </p>
      </div>

      {loading ? (
        <div className="card">Loading simulation scenarios from server...</div>
      ) : (
        <div className="simulation-grid">
          {/* Panel 1: Scenario Selector & Interactive Controls */}
          <div className="card">
            <div className="card-title">🎯 Select Threat Scenario</div>
            <div className="scenario-selector">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Predefined Safe Attack Scenarios (6 Available):
              </label>
              <select 
                className="scenario-select"
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
              >
                {scenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    {sc.scenario_name}
                  </option>
                ))}
              </select>
            </div>

            {currentScenario && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  {currentScenario.description}
                </p>

                {/* Control Status Toggle */}
                <div className="control-toggle-container">
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    🛡️ Security Control Affected:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--cyan-bright)', fontWeight: 700, marginTop: '0.25rem' }}>
                    {currentScenario.security_control_affected} ({currentScenario.affected_category})
                  </div>

                  <div className="toggle-group">
                    <button 
                      className={`toggle-btn ${!controlEnabled ? 'active-disabled' : ''}`}
                      onClick={() => setControlEnabled(false)}
                      type="button"
                    >
                      🔴 Control Disabled<br />
                      <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>(Simulated Vulnerability Attack)</span>
                    </button>

                    <button 
                      className={`toggle-btn ${controlEnabled ? 'active-restored' : ''}`}
                      onClick={() => setControlEnabled(true)}
                      type="button"
                    >
                      🟢 Control Restored<br />
                      <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>(Simulated Security Defense)</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  * Baseline assessment score is fetched directly from your active assessment posture.
                </div>
              </div>
            )}
          </div>

          {/* Panel 2: Simulation Results */}
          <div className="card">
            <div className="card-title">📊 Simulated Risk Output & Delta</div>

            {simulating ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Calculating simulation score delta...</div>
            ) : simulationResult ? (
              <div>
                {/* Score Comparison Box */}
                <div className="comparison-box">
                  <div className="comparison-card">
                    <div className="comparison-label">Before Risk</div>
                    <div className="comparison-value" style={{ color: 'var(--text-main)' }}>
                      {Math.round(simulationResult.before_risk_score)}
                    </div>
                  </div>

                  <div className="comparison-card">
                    <div className="comparison-label">After Risk</div>
                    <div className="comparison-value" style={{ color: simulationResult.after_risk_score > simulationResult.before_risk_score ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                      {Math.round(simulationResult.after_risk_score)}
                    </div>
                  </div>

                  <div className="comparison-card">
                    <div className="comparison-label">Risk Change Delta</div>
                    <div 
                      className="comparison-value" 
                      style={{ 
                        fontSize: '1.4rem', 
                        color: simulationResult.risk_delta > 0 ? 'var(--risk-high)' : simulationResult.risk_delta < 0 ? 'var(--risk-low)' : 'var(--cyan-bright)' 
                      }}
                    >
                      {simulationResult.risk_delta > 0 
                        ? `+${simulationResult.risk_delta} Risk` 
                        : simulationResult.risk_delta < 0 
                          ? `${simulationResult.risk_delta} Risk` 
                          : `0.0 (Baseline)`}
                    </div>
                  </div>
                </div>

                {/* Status Notice */}
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '1.25rem', 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  color: simulationResult.control_enabled ? 'var(--risk-low)' : 'var(--risk-high)' 
                }}>
                  Status: {simulationResult.control_status_label}
                </div>

                {/* High-Level 5-Stage Conceptual Attack Path Diagram with Stage Connectors */}
                <div className="attack-path-section">
                  <div className="attack-path-heading">
                    <span>⚡ Conceptual 5-Stage Attack Path Pipeline</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>(Safe & Educational)</span>
                  </div>

                  <div className="attack-path-pipeline">
                    {simulationResult.conceptual_attack_path?.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div 
                          className={`attack-stage-card ${simulationResult.control_enabled ? 'restored-stage' : 'disabled-stage'}`}
                        >
                          <div className="attack-stage-header">
                            <span className="attack-stage-tag">{step.stage}</span>
                          </div>
                          <div className="attack-stage-title">{step.title}</div>
                          <div className="attack-stage-desc">{step.description}</div>
                        </div>
                        {idx < simulationResult.conceptual_attack_path.length - 1 && (
                          <div style={{ textAlign: 'center', color: 'var(--cyan-bright)', fontSize: '0.9rem', lineHeight: '1', margin: '-0.2rem 0' }}>
                            ↓
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* SIMULATED / DEMO Business Impact Box */}
                <div className="impact-demo-box">
                  <div className="impact-demo-header">
                    <span>ℹ️ SIMULATED / DEMO BUSINESS IMPACT</span>
                    <span className="impact-badge-tag">DEMO VALUES</span>
                  </div>

                  <div className="impact-metric-row">
                    <span>• Operational Downtime Exposure:</span>
                    <strong>{simulationResult.simulated_business_impact?.downtime_hours} Hours</strong>
                  </div>

                  <div className="impact-metric-row">
                    <span>• Projected Financial Exposure:</span>
                    <strong>{simulationResult.simulated_business_impact?.financial_impact_demo}</strong>
                  </div>

                  <div className="impact-metric-row">
                    <span>• Exposure Severity Rating:</span>
                    <strong style={{ color: 'var(--risk-high)' }}>{simulationResult.simulated_business_impact?.risk_exposure_rating}</strong>
                  </div>
                </div>

                {/* Recommended Remediation */}
                <div className="remediation-section">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--cyan-bright)' }}>
                    💡 Recommended Security Remediation
                  </div>
                  <ul className="remediation-list">
                    {simulationResult.recommended_remediation?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>No simulation result available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
