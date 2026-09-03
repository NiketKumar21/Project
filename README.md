# ThreatLens — Ransomware Risk & Readiness Assessment Platform

> **Smart India Hackathon (SIH 2026) Prototype — Problem Statement SIH1452**  
> An interactive cybersecurity risk assessment and threat simulation web platform that computes deterministic ransomware readiness scores, identifies organizational security vulnerabilities, and evaluates what-if attack scenarios.

---

## 📌 Executive Overview

Ransomware remains one of the most critical cybersecurity threats facing modern organizations, educational institutions, and healthcare providers. **ThreatLens** (SIH1452) provides security leaders and IT administrators with a light-weight, explainable, and interactive platform to:

1. **Assess Defensive Readiness:** Evaluate 15 core security controls across 5 vital ransomware defense pillars.
2. **Compute Deterministic Risk Metrics:** Calculate a mathematically explainable **Readiness Index (0–100%)** and **Ransomware Risk Score (0–100)** without unpredictable black-box algorithms.
3. **Identify Top Vulnerabilities:** Pinpoint highest-risk security gaps prioritized by severity.
4. **Simulate What-If Scenarios:** Interactively model 6 safe attack scenarios to visualize score deltas, 5-stage conceptual attack flows, and simulated business impact.

> ⚠️ **Safety Guarantee:** The platform is purely educational and analytical. It contains **no real malware, payloads, exploit scripts, credential theft, file encryption, or network scanning**. All simulations utilize predefined deterministic models.

---

## 🎯 Key Features & Modules

### 1. 📊 Security Monitoring Dashboard
- **Overall Ransomware Risk Score (0–100):** High-impact SVG circular dial gauge categorized into Low (0–30), Moderate (31–60), and High (61–100) risk levels.
- **Readiness Index (0–100%):** Weighted average score representing overall organizational defense posture.
- **Category Readiness Breakdown:** Interactive visual card breakdown across 5 categories.
- **Top Vulnerability List:** Clear list of lowest-scoring security controls tagged by severity (High / Medium).
- **Demo Data Notice & Reset:** Easily reset dashboard data back to initial sample baseline data at any time.

### 2. 📝 Cybersecurity Readiness Console
- **15 Structured Assessment Questions:** 3 questions per category with 3 clear choice options ($0$, $5$, or $10$ points).
- **Progress Tracker Bar:** Displays live completion percentage and answered question counts.
- **Form Validation Safeguards:** Prevents submission of incomplete assessments.
- **Option Letter Badges `[A]`, `[B]`, `[C]`:** Enhanced option scanning with cyan border highlights upon selection.

### 3. ⚡ Threat Simulation Console
- **6 Predefined Threat Scenarios:**
  1. *MFA Disabled* (Identity & Access)
  2. *Backups Unavailable* (Backup & Recovery)
  3. *Endpoint Protection Disabled* (Endpoint & Network Defense)
  4. *Critical Systems Not Patched* (Endpoint & Network Defense)
  5. *Excessive User Privileges* (Identity & Access)
  6. *No Security Awareness Training* (Awareness & Phishing)
- **Interactive Control Status Toggle:** Switch between `🔴 Control Disabled (Simulated Vulnerability)` and `🟢 Control Restored (Simulated Defense)`.
- **Risk Change Delta Card:** Real-time computation of Before Risk, After Risk, and Risk Change Delta (e.g. `+7.5 Risk Points`).
- **5-Stage Conceptual Attack Flow Pipeline:** Safe, educational 5-step visual attack chain:
  $$\text{Initial Access} \longrightarrow \text{Account Compromise} \longrightarrow \text{Lateral Movement} \longrightarrow \text{Data Encryption Risk} \longrightarrow \text{Business Impact}$$
- **Simulated Business Loss Box:** Displays estimated downtime hours, simulated financial impact, and severity rating.
- **Actionable Remediation Recommendations:** Practical checklist to mitigate identified risks.

---

## 🧮 Deterministic Scoring Methodology

The platform utilizes a transparent, weighted scoring engine:

$$\text{Readiness Index (\%)} = \sum_{i=1}^{5} \left( \frac{\text{Earned Category Points}_i}{\text{Max Category Points}_i} \times 100 \times \text{Category Weight}_i \right)$$

$$\text{Ransomware Risk Score} = 100 - \text{Readiness Index}$$

### Category Weights (Total = 100%)
| Readiness Category | Weight | Max Points |
|---|---|---|
| 💾 **Backup & Recovery** | 25% (0.25) | 30 pts |
| 🔐 **Identity & Access** | 25% (0.25) | 30 pts |
| 🛡️ **Endpoint & Network Defense** | 20% (0.20) | 30 pts |
| 📧 **Awareness & Phishing** | 15% (0.15) | 30 pts |
| 🚨 **Incident Response** | 15% (0.15) | 30 pts |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 5, Vanilla CSS3 (Custom Cyber Dark SOC Design System).
- **Backend:** Python 3.12, FastAPI 0.115, Pydantic v2, Uvicorn server.
- **Data Storage:** JSON file-based persistence (`assessment_result.json`, `questions.json`, `scenarios.json`).
- **Charts:** Chart.js, react-chartjs-2.

---

## 🚀 How to Run the Platform

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Start the FastAPI Backend
```bash
cd backend
python run.py
```
> The API server will start at `http://127.0.0.1:8000`.  
> API health check: `http://127.0.0.1:8000/api/health`.

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
> The web application will open at `http://localhost:5173`.

---

## 🌐 Production Cloud Deployment

### 1-Click Deployment with Render Blueprint
This repository includes a `render.yaml` blueprint for automatic 1-click deployment of both the Python FastAPI backend and React Vite frontend.

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository `NiketKumar21/Project`.
4. Render will automatically detect `render.yaml` and provision:
   - **`threatlens-backend`** (Python Web Service running `uvicorn app.main:app`)
   - **`threatlens-frontend`** (Static Web Site running `npm run build`)
5. Configure environment variables:
   - **`VITE_API_URL`**: Set on `threatlens-frontend` pointing to your deployed backend API URL (e.g. `https://threatlens-backend.onrender.com`).
   - **`CORS_ORIGINS`**: Set on `threatlens-backend` (defaults to `*` for public access).

---

## 📁 Project Structure

```
Project/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI API endpoints & dynamic CORS config
│   │   ├── scoring_engine.py   # Deterministic math engine & simulation logic
│   │   └── data_manager.py     # JSON file I/O operations
│   ├── data/
│   │   ├── questions.json      # 15 assessment questions
│   │   ├── scenarios.json      # 6 simulation scenarios
│   │   └── assessment_result.json # Persistent assessment result
│   ├── Procfile                # Production start command for PaaS cloud platforms
│   ├── requirements.txt
│   └── run.py                  # Local backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (ScoreGauge, CategoryCard, etc.)
│   │   ├── pages/              # Pages (Dashboard, Assessment, Simulation)
│   │   ├── services/api.js     # API client helpers with dynamic VITE_API_URL
│   │   ├── styles/             # Cyber SOC CSS stylesheets
│   │   ├── App.jsx             # Main application shell
│   │   └── main.jsx
│   └── package.json
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
└── README.md
```

---

## 🛡️ License & SIH 2026 Notes
Developed for **Smart India Hackathon 2026 (SIH1452)**. All data, scores, attack paths, and financial impact metrics are simulated for educational and assessment purposes.
