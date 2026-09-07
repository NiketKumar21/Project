// Dynamic API URL from environment variable (VITE_API_URL) with localhost fallback
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    let cleaned = envUrl.trim().replace(/\/$/, '');
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = `https://${cleaned}`;
    }
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
  }
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch health check status
 */
export async function fetchHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend health check failed');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

/**
 * Fetch current assessment result (or initial DEMO data)
 */
export async function fetchAssessmentResult() {
  try {
    const response = await fetch(`${API_BASE_URL}/assessment`);
    if (!response.ok) throw new Error('Failed to fetch assessment result');
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchAssessmentResult):', error);
    return null;
  }
}

/**
 * Fetch the 15 assessment questions
 */
export async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchQuestions):', error);
    return [];
  }
}

/**
 * Fetch safe simulation scenarios
 */
export async function fetchScenarios() {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios`);
    if (!response.ok) throw new Error('Failed to fetch scenarios');
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchScenarios):', error);
    return [];
  }
}

/**
 * Submit filled 15-question risk assessment to backend scoring engine
 */
export async function submitAssessment(answers) {
  try {
    const response = await fetch(`${API_BASE_URL}/assess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to submit assessment');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error (submitAssessment):', error);
    throw error;
  }
}

/**
 * Reset assessment data back to sample initial DEMO data
 */
export async function resetAssessment() {
  try {
    const response = await fetch(`${API_BASE_URL}/assessment/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reset assessment');
    return await response.json();
  } catch (error) {
    console.error('API Error (resetAssessment):', error);
    throw error;
  }
}

/**
 * Execute Phase 3 Safe What-If Attack Simulation calculation
 */
export async function runSimulation(scenarioId, controlEnabled = true) {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario_id: scenarioId,
        control_enabled: controlEnabled
      }),
    });
    if (!response.ok) throw new Error('Failed to execute simulation');
    return await response.json();
  } catch (error) {
    console.error('API Error (runSimulation):', error);
    throw error;
  }
}
