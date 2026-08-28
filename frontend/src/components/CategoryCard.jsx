import React from 'react';

export default function CategoryCard({ name, score, weight }) {
  const getScoreColor = (val) => {
    if (val >= 70) return 'var(--risk-low)';
    if (val >= 40) return 'var(--risk-moderate)';
    return 'var(--risk-high)';
  };

  return (
    <div className="category-card">
      <div className="category-card-header">
        <span className="category-name">{name}</span>
        <span className="category-weight">{weight} Weight</span>
      </div>
      <div 
        className="category-score" 
        style={{ color: getScoreColor(score) }}
      >
        {Math.round(score)}%
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${Math.min(100, Math.max(0, score))}%`,
            backgroundColor: getScoreColor(score) 
          }}
        ></div>
      </div>
    </div>
  );
}
