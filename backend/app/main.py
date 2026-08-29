from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from app.data_manager import get_questions, get_scenarios, get_assessment_result, save_assessment_result
from app.scoring_engine import calculate_assessment_scores, simulate_scenario_risk

app = FastAPI(
    title="SIH1452 - Interactive Ransomware Risk and Readiness Assessment Platform",
    description="Backend API for Ransomware Risk Assessment & Safe Attack Simulation",
    version="1.0.0"
)

# Configure CORS to allow communication from React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for API Input Validation
class AnswerItem(BaseModel):
    question_id: int = Field(..., description="ID of the question (1 to 15)")
    selected_option_index: int = Field(..., description="Index of selected option (0, 1, or 2)")

class AssessmentSubmission(BaseModel):
    answers: List[AnswerItem] = Field(..., description="List of 15 question answers")

class SimulationRequest(BaseModel):
    scenario_id: str = Field(..., description="ID of the selected scenario")
    control_enabled: bool = Field(True, description="True for Restored control, False for Disabled control")

# Initial Demo Data Constant for Reset Endpoint
INITIAL_DEMO_RESULT = {
    "is_demo_data": True,
    "data_notice": "DEMO / INITIAL SAMPLE DATA — Complete an assessment to calculate your organization's actual risk score.",
    "timestamp": "2026-08-28T00:00:00Z",
    "readiness_index": 48.0,
    "ransomware_risk_score": 52.0,
    "risk_level": "Moderate",
    "total_earned_points": 72,
    "total_max_points": 150,
    "category_scores": {
        "Backup & Recovery": 50.0,
        "Identity & Access": 40.0,
        "Endpoint & Network Defense": 50.0,
        "Awareness & Phishing": 60.0,
        "Incident Response": 43.3
    },
    "top_vulnerabilities": [
        {
            "category": "Identity & Access",
            "question": "Is Multi-Factor Authentication (MFA) enforced for all employees, remote access, and administrative logins?",
            "score_text": "Not enforced or optional for internal systems",
            "severity": "High"
        },
        {
            "category": "Incident Response",
            "question": "Does your organization have a documented and tested Ransomware Incident Response Playbook?",
            "score_text": "Documented on paper but never tested via tabletop exercises",
            "severity": "High"
        },
        {
            "category": "Backup & Recovery",
            "question": "Does your organization maintain offline, immutable, or air-gapped backups?",
            "score_text": "Backups exist online with periodic manual copies",
            "severity": "Medium"
        }
    ]
}

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend service status."""
    return {
        "status": "healthy",
        "message": "SIH1452 Ransomware Risk & Readiness API is running",
        "version": "1.0.0"
    }

@app.get("/api/assessment")
def get_assessment():
    """Fetch current active assessment results (or demo data)."""
    return get_assessment_result()

@app.get("/api/questions")
def get_assessment_questions():
    """Fetch the 15 assessment questions across 5 categories."""
    return get_questions()

@app.get("/api/scenarios")
def get_simulation_scenarios():
    """Fetch predefined safe threat simulation scenarios."""
    return get_scenarios()

@app.post("/api/assess", status_code=status.HTTP_200_OK)
def submit_assessment(submission: AssessmentSubmission):
    """
    Process 15 question answers, calculate risk scores via centralized scoring engine,
    persist results to JSON file, and return calculated assessment overview.
    """
    questions = get_questions()
    expected_ids = {q["id"] for q in questions}
    submitted_ids = {ans.question_id for ans in submission.answers}

    if len(submitted_ids) < len(expected_ids) or submitted_ids != expected_ids:
        missing = expected_ids - submitted_ids
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incomplete assessment. Please answer all 15 questions. Missing question IDs: {sorted(list(missing))}"
        )

    raw_answers = [{"question_id": a.question_id, "selected_option_index": a.selected_option_index} for a in submission.answers]
    result = calculate_assessment_scores(raw_answers)
    save_assessment_result(result)
    return result

@app.post("/api/assessment/reset")
def reset_assessment():
    """Reset assessment data back to sample initial DEMO data."""
    save_assessment_result(INITIAL_DEMO_RESULT)
    return INITIAL_DEMO_RESULT

@app.post("/api/simulate")
def run_simulation(req: SimulationRequest):
    """
    Execute Phase 3 What-If Attack Simulation.
    Calculates baseline-relative risk score change when control is Disabled vs Restored.
    """
    base_assessment = get_assessment_result()
    return simulate_scenario_risk(req.scenario_id, req.control_enabled, base_assessment)
