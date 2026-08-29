from typing import List, Dict, Any
from datetime import datetime
from app.data_manager import get_questions, get_scenarios

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
    Centralized Deterministic Scoring Engine for Assessment Questionnaire.
    
    Formulas:
    1. Category Score = (Earned Points in Category / Max Category Points [30]) * 100
    2. Readiness Index = Sum(Category Score_i * Weight_i)
    3. Ransomware Risk Score = 100 - Readiness Index
    4. Risk Level: 0-30 = Low, 31-60 = Moderate, 61-100 = High
    """
    questions = get_questions()
    answers_map = {ans["question_id"]: ans["selected_option_index"] for ans in user_answers}

    category_earned_points = {cat: 0 for cat in CATEGORY_WEIGHTS.keys()}
    category_max_points = {cat: 0 for cat in CATEGORY_WEIGHTS.keys()}
    
    top_vulnerabilities = []
    
    for q in questions:
        q_id = q["id"]
        cat = q["category"]
        max_q_points = max(opt["points"] for opt in q["options"])
        category_max_points[cat] += max_q_points
        
        selected_idx = answers_map.get(q_id, 0)
        if selected_idx < 0 or selected_idx >= len(q["options"]):
            selected_idx = 0
            
        earned = q["options"][selected_idx]["points"]
        category_earned_points[cat] += earned
        
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

    top_vulnerabilities.sort(key=lambda x: (0 if x["severity"] == "High" else 1, x["earned_points"]))

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

    if ransomware_risk_score <= 30.0:
        risk_level = "Low"
    elif ransomware_risk_score <= 60.0:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    total_earned = sum(category_earned_points.values())
    total_max = sum(category_max_points.values())

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
        "top_vulnerabilities": top_vulnerabilities[:4],
        "recommendations": recommendations
    }


def simulate_scenario_risk(scenario_id: str, control_enabled: bool, base_assessment: Dict[str, Any]) -> Dict[str, Any]:
    """
    Phase 3 Deterministic Baseline-Relative Simulation Engine.
    
    Logic:
    - Disabled (control_enabled = False): Applies scenario category penalty to baseline category score.
    - Restored (control_enabled = True): Returns category score to exact baseline assessment score.
    """
    scenarios = get_scenarios()
    scenario_map = {s["id"]: s for s in scenarios}
    
    if scenario_id not in scenario_map:
        scenario = scenarios[0]
    else:
        scenario = scenario_map[scenario_id]

    base_risk_score = float(base_assessment.get("ransomware_risk_score", 50.0))
    base_readiness_index = float(base_assessment.get("readiness_index", 50.0))
    base_category_scores = base_assessment.get("category_scores", {cat: 50.0 for cat in CATEGORY_WEIGHTS})

    affected_category = scenario["affected_category"]
    penalty_pts = scenario.get("category_penalty_pts", 25.0)

    # Compute simulated category scores relative to baseline
    simulated_category_scores = dict(base_category_scores)
    
    if not control_enabled:
        # Disabled: Subtract category penalty
        current_base = float(base_category_scores.get(affected_category, 50.0))
        simulated_category_scores[affected_category] = max(0.0, round(current_base - penalty_pts, 1))
    else:
        # Restored: Return to baseline category score
        simulated_category_scores[affected_category] = float(base_category_scores.get(affected_category, 50.0))

    # Calculate simulated readiness index using weights
    simulated_readiness = 0.0
    for cat, weight in CATEGORY_WEIGHTS.items():
        cat_score = float(simulated_category_scores.get(cat, 50.0))
        simulated_readiness += (cat_score * weight)

    simulated_readiness = round(simulated_readiness, 1)
    simulated_risk_score = round(100.0 - simulated_readiness, 1)
    risk_delta = round(simulated_risk_score - base_risk_score, 1)

    if simulated_risk_score <= 30.0:
        simulated_risk_level = "Low"
    elif simulated_risk_score <= 60.0:
        simulated_risk_level = "Moderate"
    else:
        simulated_risk_level = "High"

    return {
        "scenario_id": scenario["id"],
        "scenario_name": scenario["scenario_name"],
        "security_control_affected": scenario["security_control_affected"],
        "affected_category": affected_category,
        "control_enabled": control_enabled,
        "control_status_label": "Restored (Baseline Defense)" if control_enabled else "Disabled (Simulated Attack Exposure)",
        "before_risk_score": base_risk_score,
        "after_risk_score": simulated_risk_score,
        "risk_delta": risk_delta,
        "simulated_risk_level": simulated_risk_level,
        "before_readiness_index": base_readiness_index,
        "after_readiness_index": simulated_readiness,
        "simulated_category_scores": simulated_category_scores,
        "conceptual_attack_path": scenario["conceptual_attack_path"],
        "simulated_business_impact": scenario["simulated_business_impact"],
        "recommended_remediation": scenario["recommended_remediation"]
    }
