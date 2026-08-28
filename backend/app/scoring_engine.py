from typing import List, Dict, Any
from datetime import datetime
from app.data_manager import get_questions

# Category weight constants (Sum = 1.00 / 100%)
CATEGORY_WEIGHTS = {
    "Backup & Recovery": 0.25,
    "Identity & Access": 0.25,
    "Endpoint & Network Defense": 0.20,
    "Awareness & Phishing": 0.15,
    "Incident Response": 0.15
}

def calculate_assessment_scores(user_answers: List[Dict[str, int]]) -> Dict[str, Any]:
    """
    Centralized Deterministic Scoring Engine.
    
    Formulas:
    1. Category Score = (Earned Points in Category / Max Category Points [30]) * 100
    2. Readiness Index = Sum(Category Score_i * Weight_i)
    3. Ransomware Risk Score = 100 - Readiness Index
    4. Risk Level: 0-30 = Low, 31-60 = Moderate, 61-100 = High
    """
    questions = get_questions()
    questions_by_id = {q["id"]: q for q in questions}

    # Map user answers by question ID
    answers_map = {ans["question_id"]: ans["selected_option_index"] for ans in user_answers}

    # Track points per category
    category_earned_points = {cat: 0 for cat in CATEGORY_WEIGHTS.keys()}
    category_max_points = {cat: 0 for cat in CATEGORY_WEIGHTS.keys()}
    
    top_vulnerabilities = []
    
    for q in questions:
        q_id = q["id"]
        cat = q["category"]
        max_q_points = max(opt["points"] for opt in q["options"])
        category_max_points[cat] += max_q_points
        
        selected_idx = answers_map.get(q_id, 0)
        # Ensure selected_idx is valid
        if selected_idx < 0 or selected_idx >= len(q["options"]):
            selected_idx = 0
            
        earned = q["options"][selected_idx]["points"]
        category_earned_points[cat] += earned
        
        # Track vulnerability if question score is low (0 or 5 pts)
        if earned < max_q_points:
            severity = "High" if earned == 0 else "Medium"
            top_vulnerabilities.append({
                "question_id": q_id,
                "category": cat,
                "question": q["question"],
                "score_text": q["options"][selected_idx]["text"],
                "earned_points": earned,
                "max_points": max_q_points,
                "severity": severity
            })

    # Sort vulnerabilities by severity (High first, then lowest earned points)
    top_vulnerabilities.sort(key=lambda x: (0 if x["severity"] == "High" else 1, x["earned_points"]))

    # Compute category percentage scores
    category_scores = {}
    readiness_index = 0.0

    for cat, weight in CATEGORY_WEIGHTS.items():
        max_pts = category_max_points[cat]
        earned_pts = category_earned_points[cat]
        cat_score = (earned_pts / max_pts * 100.0) if max_pts > 0 else 0.0
        category_scores[cat] = round(cat_score, 1)
        readiness_index += (cat_score * weight)

    readiness_index = round(readiness_index, 1)
    ransomware_risk_score = round(100.0 - readiness_index, 1)

    # Determine Risk Level
    if ransomware_risk_score <= 30.0:
        risk_level = "Low"
    elif ransomware_risk_score <= 60.0:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    total_earned = sum(category_earned_points.values())
    total_max = sum(category_max_points.values())

    # Generate remediation recommendations based on top vulnerabilities
    recommendations = []
    seen_categories = set()
    for vuln in top_vulnerabilities:
        if vuln["category"] not in seen_categories:
            seen_categories.add(vuln["category"])
            recommendations.append(f"Improve {vuln['category']}: Address '{vuln['question']}'")
        if len(recommendations) >= 4:
            break

    formatted_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "is_demo_data": False,
        "data_notice": f"Calculated Assessment Result (Submitted on {formatted_timestamp})",
        "timestamp": formatted_timestamp,
        "readiness_index": readiness_index,
        "ransomware_risk_score": ransomware_risk_score,
        "risk_level": risk_level,
        "total_earned_points": total_earned,
        "total_max_points": total_max,
        "category_scores": category_scores,
        "top_vulnerabilities": top_vulnerabilities[:4],  # Top 4 vulnerabilities
        "recommendations": recommendations
    }
