import React from 'react';
import ScoreGauge from '../components/ScoreGauge';
import CategoryCard from '../components/CategoryCard';
import CategoryChart from '../components/CategoryChart';
import VulnerabilityList from '../components/VulnerabilityList';
import { resetAssessment } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard({ assessmentData, setAssessmentData, setActiveScreen, loadingInitial }) {
  if (loadingInitial && !assessmentData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--cyan-bright)', fontWeight: 700 }}>⏳ Loading Security Assessment Posture...</p>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: 'var(--risk-high)', marginBottom: '0.5rem' }}>⚠️ Dashboard Data Unavailable</h3>
        <p style={{ color: 'var(--text-muted)' }}>Backend scoring service is disconnected. Please start the Python backend server.</p>
      </div>
    );
  }

  const categoryWeights = {
    'Backup & Recovery': '25%',
    'Identity & Access': '25%',
    'Endpoint & Network Defense': '20%',
    'Awareness & Phishing': '15%',
    'Incident Response': '15%'
  };

  const handleResetToDemo = async () => {
    if (window.confirm("Reset dashboard data back to initial sample demo data?")) {
      const demoData = await resetAssessment();
      setAssessmentData(demoData);
    }
  };

  const readinessVal = Math.round(assessmentData.readiness_index || 0);

  // SVG Gauge Math for Readiness Index Dial
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessVal / 100) * circumference;

  return (
    <div className="dashboard-container">
      {/* Banner: Demo Data vs Actual Assessment Result */}
      {assessmentData.is_demo_data ? (
        <div className="demo-banner">
          <span className="demo-banner-tag">SAMPLE DEMO DATA</span>
          <span className="demo-banner-icon">ℹ️</span>
          <span>
            {assessmentData.data_notice ||
              "Currently displaying sample baseline data. Complete the assessment to compute your organization's actual risk score."}
          </span>
        </div>
      ) : (
        <div className="demo-banner" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--risk-low)', color: '#a7f3d0' }}>
          <span className="demo-banner-tag" style={{ backgroundColor: 'var(--risk-low)', color: '#000' }}>VERIFIED ASSESSMENT RESULT</span>
          <span className="demo-banner-icon">✅</span>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>
              Actual Organizational Assessment Result (Calculated on {assessmentData.timestamp || 'Latest Run'})
            </span>
            <button 
              className="btn-secondary" 
              onClick={handleResetToDemo}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Reset to Sample Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Ransomware Risk & Readiness Posture</h1>
          <p className="dashboard-subtitle">
            Executive Security Monitoring & Centralized Deterministic Scoring Overview
          </p>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn-primary"
            onClick={() => setActiveScreen('assessment')}
          >
            📝 {assessmentData.is_demo_data ? 'Start Risk Assessment' : 'Retake Risk Assessment'}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setActiveScreen('simulation')}
          >
            ⚡ Run What-If Simulation
          </button>
        </div>
      </div>

      {/* Top Dual Metrics Row - Equal Height Gauge Cards */}
      <div className="metrics-row">
        <ScoreGauge 
          score={assessmentData.ransomware_risk_score} 
          riskLevel={assessmentData.risk_level} 
        />

        <div className="card metric-card">
          <div className="metric-label">Readiness Index</div>
          
          {/* Circular SVG Dial for Readiness Index */}
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0.75rem auto' }}>
            <svg width="160" height="160" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="var(--cyan-primary)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>

            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="metric-value-huge" style={{ color: 'var(--cyan-bright)', margin: 0, fontSize: '3rem' }}>
                {readinessVal}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                DEFENSIVE SCORE
              </span>
            </div>
          </div>

          <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-bright)', border: '1px solid var(--cyan-primary)' }}>
            Weighted Defensive Posture
          </span>
        </div>
      </div>

      {/* 5 Categories Grid */}
      <div className="categories-section">
        <h2 className="section-heading">🛡️ Ransomware Readiness Categories</h2>
        <div className="categories-grid">
          {Object.entries(assessmentData.category_scores || {}).map(([catName, score]) => (
            <CategoryCard 
              key={catName}
              name={catName}
              score={score}
              weight={categoryWeights[catName] || '20%'}
            />
          ))}
        </div>
      </div>

      {/* Chart & Vulnerability List Lower Grid */}
      <div className="lower-grid">
        <CategoryChart categoryScores={assessmentData.category_scores} />
        <VulnerabilityList vulnerabilities={assessmentData.top_vulnerabilities} />
      </div>
    </div>
  );
}
