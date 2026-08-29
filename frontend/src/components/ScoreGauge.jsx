import React from 'react';

export default function ScoreGauge({ score, riskLevel }) {
  const roundedScore = Math.round(score || 0);

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

  // SVG Gauge Math
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <div className="card metric-card" style={{ position: 'relative' }}>
      <div className="metric-label">Overall Ransomware Risk Score</div>
      
      {/* High-Tech Circular SVG Gauge */}
      <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0.75rem auto' }}>
        <svg width="160" height="160" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Gauge Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={getScoreColor(riskLevel)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        {/* Central Numerical Score Value */}
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
          <span className="metric-value-huge" style={{ color: getScoreColor(riskLevel), margin: 0, fontSize: '3rem' }}>
            {roundedScore}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
            / 100 MAX RISK
          </span>
        </div>
      </div>

      <span className={`badge ${getBadgeClass(riskLevel)}`}>
        {riskLevel} Risk Posture
      </span>
    </div>
  );
}
