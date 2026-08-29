import React, { useState, useEffect } from 'react';
import { fetchQuestions, submitAssessment } from '../services/api';
import '../styles/assessment.css';

const CATEGORY_ICONS = {
  'Backup & Recovery': '💾',
  'Identity & Access': '🔐',
  'Endpoint & Network Defense': '🛡️',
  'Awareness & Phishing': '📧',
  'Incident Response': '🚨'
};

const OPTION_LETTERS = ['A', 'B', 'C'];

export default function Assessment({ onAssessmentComplete, setActiveScreen }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // { question_id: selected_option_index }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchQuestions();
      setQuestions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleOptionSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setValidationError(null);
  };

  const calculateProgress = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const totalCount = questions.length || 15;
    return {
      count: answeredCount,
      total: totalCount,
      percentage: Math.round((answeredCount / totalCount) * 100)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    // Validation: Check if all questions are answered
    const unanswered = questions.filter(q => userAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      const missingNumbers = unanswered.map(q => `#${q.id}`).join(', ');
      setValidationError(`Incomplete Assessment: Please answer all 15 questions before submitting. Unanswered questions: ${missingNumbers}`);
      return;
    }

    // Format payload for API
    const formattedAnswers = Object.entries(userAnswers).map(([qId, optIdx]) => ({
      question_id: parseInt(qId, 10),
      selected_option_index: optIdx
    }));

    try {
      setSubmitting(true);
      const result = await submitAssessment(formattedAnswers);
      setSubmitting(false);
      
      // Update global parent state & navigate to Dashboard
      if (onAssessmentComplete) {
        onAssessmentComplete(result);
      }
      setActiveScreen('dashboard');
    } catch (err) {
      setSubmitting(false);
      setApiError(err.message || 'Failed to submit assessment to backend scoring engine. Please check if backend server is running.');
    }
  };

  const progress = calculateProgress();

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h1 className="assessment-title">📝 Cybersecurity Readiness Console</h1>
        <p className="assessment-instructions">
          Complete the 15 security readiness questions below (3 for each readiness category). Your responses will be evaluated by our centralized deterministic scoring engine to compute your organization's Readiness Index and Risk Score.
        </p>

        {/* Progress Tracker */}
        <div style={{ marginTop: '1.25rem', background: '#0f172a', padding: '1.1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-main)' }}>Assessment Completion Progress</span>
            <span style={{ color: progress.percentage === 100 ? 'var(--risk-low)' : 'var(--cyan-bright)', fontWeight: 800 }}>
              {progress.count} of {progress.total} Questions Answered ({progress.percentage}%)
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${progress.percentage}%`, 
                backgroundColor: progress.percentage === 100 ? 'var(--risk-low)' : 'var(--cyan-primary)',
                boxShadow: progress.percentage === 100 ? '0 0 10px var(--risk-low)' : '0 0 10px var(--cyan-primary)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Validation or API Error Alerts */}
      {validationError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--risk-high)', color: '#fca5a5', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ⚠️ {validationError}
        </div>
      )}

      {apiError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--risk-high)', color: '#fca5a5', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ❌ {apiError}
        </div>
      )}

      {loading ? (
        <div className="card">Loading 15 assessment questions from server...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {['Backup & Recovery', 'Identity & Access', 'Endpoint & Network Defense', 'Awareness & Phishing', 'Incident Response'].map((cat) => {
            const catQuestions = questions.filter(q => q.category === cat);
            const icon = CATEGORY_ICONS[cat] || '🛡️';
            return (
              <div key={cat} className="category-block">
                <div className="category-block-header">
                  <div className="category-block-title">
                    <span>{icon}</span>
                    <span>{cat}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--cyan-bright)', fontWeight: 700, backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    3 Questions
                  </span>
                </div>
                {catQuestions.map((q) => {
                  const isSelected = userAnswers[q.id] !== undefined;
                  return (
                    <div key={q.id} className="question-card" style={{ borderLeft: isSelected ? '4px solid var(--cyan-bright)' : '1px solid var(--border-color)', backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'var(--bg-surface)' }}>
                      <div className="question-text">
                        <span style={{ color: 'var(--cyan-bright)', marginRight: '0.5rem', fontWeight: 800 }}>Q{q.id}:</span>
                        {q.question}
                      </div>
                      <div className="options-group">
                        {q.options.map((opt, i) => {
                          const isOptionChecked = userAnswers[q.id] === i;
                          return (
                            <label 
                              key={i} 
                              className="option-label" 
                              style={{ 
                                borderColor: isOptionChecked ? 'var(--cyan-bright)' : 'var(--border-color)',
                                backgroundColor: isOptionChecked ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                                boxShadow: isOptionChecked ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
                              }}
                            >
                              <input 
                                type="radio" 
                                name={`question_${q.id}`} 
                                value={i}
                                checked={isOptionChecked}
                                onChange={() => handleOptionSelect(q.id, i)}
                                className="option-input"
                              />
                              <span style={{ color: 'var(--cyan-bright)', fontWeight: 800, fontSize: '0.82rem', minWidth: '24px' }}>
                                [{OPTION_LETTERS[i] || i}]
                              </span>
                              <span style={{ flex: 1 }}>{opt.text} <strong style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>({opt.points} pts)</strong></span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="submit-container" style={{ gap: '1rem' }}>
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => setActiveScreen('dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              {submitting ? 'Calculating Risk Score...' : '🚀 Submit Assessment & Compute Results'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
