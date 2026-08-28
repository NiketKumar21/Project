import React from 'react';

export default function ScoreGauge({ score, riskLevel }) {
  const getBadgeClass = (level) => {
    if (level === 'Low') return 'badge-low';
    if (level === 'Moderate') return 'badge-moderate';
    return 'badge-high';
  };

  const getScoreColor = (level) => {
    if (level === 'Low') return 'var(--risk-low)';
    if (level === 'Moderate') return 'var(--risk-moderate)';
    return 'var(--risk-high)';
  };

  return (
    <div className="card metric-card">
      <div className="metric-label">Overall Ransomware Risk Score</div>
      <div 
        className="metric-value-huge" 
        style={{ color: getScoreColor(riskLevel) }}
      >
        {Math.round(score)}
      </div>
      <span className={`badge ${getBadgeClass(riskLevel)}`}>
        {riskLevel} Risk Level
      </span>
    </div>
  );
}
