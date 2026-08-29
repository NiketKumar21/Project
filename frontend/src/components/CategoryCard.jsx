import React from 'react';

const CATEGORY_ICONS = {
  'Backup & Recovery': '💾',
  'Identity & Access': '🔐',
  'Endpoint & Network Defense': '🛡️',
  'Awareness & Phishing': '📧',
  'Incident Response': '🚨'
};

export default function CategoryCard({ name, score, weight }) {
  const roundedScore = Math.round(score || 0);
  const icon = CATEGORY_ICONS[name] || '🛡️';

  const getScoreColor = (val) => {
    if (val >= 70) return 'var(--risk-low)';
    if (val >= 40) return 'var(--risk-moderate)';
    return 'var(--risk-high)';
  };

  return (
    <div className="category-card">
      <div className="category-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span className="category-name">{name}</span>
        </div>
        <span className="category-weight">{weight} Weight</span>
      </div>
      <div 
        className="category-score" 
        style={{ color: getScoreColor(roundedScore) }}
      >
        {roundedScore}%
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${Math.min(100, Math.max(0, roundedScore))}%`,
            backgroundColor: getScoreColor(roundedScore),
            boxShadow: `0 0 10px ${getScoreColor(roundedScore)}`
          }}
        ></div>
      </div>
    </div>
  );
}
