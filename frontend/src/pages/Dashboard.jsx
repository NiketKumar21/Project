import React from 'react';
import ScoreGauge from '../components/ScoreGauge';
import CategoryCard from '../components/CategoryCard';
import CategoryChart from '../components/CategoryChart';
import VulnerabilityList from '../components/VulnerabilityList';
import { resetAssessment } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard({ assessmentData, setAssessmentData, setActiveScreen }) {
  if (!assessmentData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading assessment data...</p>
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

  return (
    <div className="dashboard-container">
      {/* Banner: Demo Data vs Actual Assessment Result */}
      {assessmentData.is_demo_data ? (
        <div className="demo-banner">
          <span className="demo-banner-tag">SAMPLE DEMO DATA</span>
          <span className="demo-banner-icon">ℹ️</span>
          <span>
            {assessmentData.data_notice ||
              "Currently displaying sample baseline data. Complete the assessment to compute your actual risk score."}
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
            Executive Security Overview & Centralized Deterministic Scoring Overview
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

      {/* Top Metrics Row */}
      <div className="metrics-row">
        <ScoreGauge 
          score={assessmentData.ransomware_risk_score} 
          riskLevel={assessmentData.risk_level} 
        />

        <div className="card metric-card">
          <div className="metric-label">Readiness Index</div>
          <div className="metric-value-huge" style={{ color: 'var(--primary-teal-hover)' }}>
            {Math.round(assessmentData.readiness_index)}%
          </div>
          <span className="badge" style={{ backgroundColor: 'rgba(13, 148, 136, 0.2)', color: 'var(--primary-teal-hover)' }}>
            Weighted Defensive Posture
          </span>
        </div>
      </div>

      {/* 5 Categories Grid */}
      <div className="categories-section">
        <h2 className="section-heading">Ransomware Readiness Categories</h2>
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
