import React, { useState, useEffect } from 'react';
import { fetchQuestions, submitAssessment } from '../services/api';
import '../styles/assessment.css';

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
        <h1 className="assessment-title">📝 Ransomware Risk & Readiness Assessment</h1>
        <p className="assessment-instructions">
          Complete the 15 questions below (3 for each ransomware readiness category). Your responses will be processed by our centralized scoring engine to compute your organization's Readiness Index and Risk Score.
        </p>

        {/* Progress Tracker */}
        <div style={{ marginTop: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>Progress Tracker</span>
            <span style={{ color: progress.percentage === 100 ? 'var(--risk-low)' : 'var(--primary-teal-hover)' }}>
              {progress.count} of {progress.total} Questions Answered ({progress.percentage}%)
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress.percentage}%`, backgroundColor: progress.percentage === 100 ? 'var(--risk-low)' : 'var(--primary-teal)' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Validation or API Error Alerts */}
      {validationError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--risk-high)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          ⚠️ {validationError}
        </div>
      )}

      {apiError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--risk-high)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          ❌ {apiError}
        </div>
      )}

      {loading ? (
        <div className="card">Loading 15 assessment questions from server...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {['Backup & Recovery', 'Identity & Access', 'Endpoint & Network Defense', 'Awareness & Phishing', 'Incident Response'].map((cat) => {
            const catQuestions = questions.filter(q => q.category === cat);
            return (
              <div key={cat} className="category-block">
                <div className="category-block-header">
                  <div className="category-block-title">🛡️ {cat}</div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>3 Questions</span>
                </div>
                {catQuestions.map((q) => {
                  const isSelected = userAnswers[q.id] !== undefined;
                  return (
                    <div key={q.id} className="question-card" style={{ borderLeft: isSelected ? '4px solid var(--primary-teal)' : '1px solid var(--border-color)' }}>
                      <div className="question-text">
                        <span style={{ color: 'var(--primary-teal-hover)', marginRight: '0.5rem' }}>Question {q.id}:</span>
                        {q.question}
                      </div>
                      <div className="options-group">
                        {q.options.map((opt, i) => (
                          <label key={i} className="option-label" style={{ borderColor: userAnswers[q.id] === i ? 'var(--primary-teal)' : 'var(--border-color)' }}>
                            <input 
                              type="radio" 
                              name={`question_${q.id}`} 
                              value={i}
                              checked={userAnswers[q.id] === i}
                              onChange={() => handleOptionSelect(q.id, i)}
                              className="option-input"
                            />
                            <span>{opt.text} <strong>({opt.points} pts)</strong></span>
                          </label>
                        ))}
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
              {submitting ? 'Calculating Risk Score...' : '🚀 Submit Assessment & View Results'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
