import json
import os
from typing import Dict, List, Any

# Base path relative to backend root directory
BASE_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def load_json(filename: str) -> Any:
    filepath = os.path.join(BASE_DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Data file {filename} not found at {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(filename: str, data: Any) -> None:
    filepath = os.path.join(BASE_DATA_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_questions() -> List[Dict[str, Any]]:
    return load_json("questions.json")

def get_scenarios() -> List[Dict[str, Any]]:
    return load_json("scenarios.json")

def get_assessment_result() -> Dict[str, Any]:
    return load_json("assessment_result.json")

def save_assessment_result(result: Dict[str, Any]) -> None:
    save_json("assessment_result.json", result)
