# STARTUP HEALTH DIAGNOSIS SYSTEM
## Engineering College Mini-Project Report & Documentation

---

### 1. PROJECT TITLE
**Startup Health Diagnosis System**  
*A Web-Based Diagnostic Platform for Business Solvency, Runway Forecasting, Risk Mitigation, and Portfolio Analytics*

---

### 2. ABSTRACT
Over 90% of early-stage commercial and technology startups cease operations within their first five years of inception. The dominant catalyst for premature failure is financial distress resulting from miscalculated cash burn rates, inadequate cash runways, low customer retention, and an inability to diagnose operational vulnerabilities before capital exhaustion occurs. Traditional financial reporting tools (such as periodic balance sheets and tax ledgers) are static, backward-looking, and difficult for early-stage founders and angel investors to translate into immediate operational decisions.

The **Startup Health Diagnosis System** is an interactive, web-based software application engineered in **React.js** and **Vite** that automates the quantitative evaluation of startup health. The system ingests primary operational and financial metrics—including Monthly Recurring Revenue (MRR), Monthly Operating Expenses, Available Liquid Cash, Monthly Burn Rate, Outstanding Debt, Customer Growth, and Retention Rates. Through a multi-pillar weighted scoring algorithm, the application computes an objective **Startup Health Score (0–100)**, classifies the business into risk bands (Healthy Startup, Moderate Risk, High Risk), estimates remaining cash runway in months, pinpoints systemic vulnerabilities, and generates prioritized tactical recommendations with actionable checklists.

---

### 3. INTRODUCTION
In the contemporary startup ecosystem, data-driven financial governance is essential for survivability. Founders frequently grapple with high-frequency capital allocation decisions without access to dedicated Chief Financial Officers (CFOs) or automated analytics software.

The Startup Health Diagnosis System bridges this capability gap by providing an accessible, intuitive SaaS dashboard interface. Designed as a modular Single Page Application (SPA), the system delivers immediate feedback on whether a company is approaching a cash-flow cliff, experiencing "leaky-bucket" churn, or carrying an unsustainable debt load. The platform is equally valuable for angel syndicates, venture incubators, and college entrepreneurship cells evaluating cohorts of fledgling ventures.

---

### 4. PROBLEM STATEMENT
Current mechanisms for evaluating early-stage ventures suffer from critical shortcomings:
1. **Lack of Proactive Early Warning Indicators:** Founders typically realize cash reserves are critically depleted only when 30–60 days of runway remain, which is insufficient time to execute equity fundraising or debt refinancing.
2. **Fragmentation of Metrics:** Financial data (burn, revenue, debt) is isolated from product and market traction metrics (retention, customer acquisition velocity).
3. **Complexity of Enterprise ERP Systems:** Solutions like SAP or NetSuite are cost-prohibitive and overly complex for early-stage startups with 2 to 50 employees.
4. **Subjective Risk Assessment:** Angel investors and mentors often rely on gut feel rather than standardized, weighted scoring formulas.

---

### 5. OBJECTIVES
The core engineering and functional objectives of this project are:
1. **Interactive Data Capture:** Develop an accessible, multi-step responsive form with client-side validation to gather financial, operational, and customer metrics.
2. **Algorithmic Health Scoring:** Formulate and execute a weighted 0–100 Health Score based on five foundational pillars: Profitability, Runway Safety, Growth Velocity, Customer Retention, and Debt Solvency.
3. **Automated Risk Triage:** Dynamically parse input variables to identify vulnerabilities (e.g., burn rate exceeding cash collections, sub-60% retention, short cash runway).
4. **Prescriptive Guidance:** Generate personalized, tiered strategic action playbooks with 30-day and 90-day execution checklists.
5. **Interactive Data Visualization:** Render executive charts (Revenue vs Expenses, Health Score Distribution, Cohort Growth vs Retention) using SVG declarative charting (`Recharts`).
6. **Zero-Setup Client-Side Persistence:** Ensure full operational capabilities and offline persistence across browser sessions using `localStorage`, backed by an optional RESTful Node.js/Express companion backend.

---

### 6. EXISTING SYSTEM
In existing workflows, startups assess health through:
* **Manual Spreadsheets (Excel/Google Sheets):** Prone to broken cell formulas, lack validation, and offer no automated risk diagnostics.
* **Accounting Software (Tally, QuickBooks):** Focus exclusively on tax compliance, historical reconciliation, and double-entry bookkeeping without forward-looking cash burn projections.
* **Consulting Audits:** Expensive, slow, and inaccessible to pre-seed or bootstrapped founders.

**Drawbacks of Existing Systems:**
* High manual effort and error susceptibility.
* No automated generation of remediation playbooks.
* Static historical data without predictive runway modeling.

---

### 7. PROPOSED SYSTEM
The proposed **Startup Health Diagnosis System** implements a client-centric web architecture providing:
* **Real-Time Computation:** Immediate output upon form completion without page reload.
* **Standardized 0–100 Scale:** Instant comparability across diverse industries (SaaS, FinTech, HealthTech, EdTech).
* **Multi-Pillar Weighting:** Balanced evaluation of both financial solvency and customer loyalty metrics.
* **Heuristic Risk Detection:** Automated classification of risks into High, Medium, and Low severity with concrete mitigation steps.
* **Audit Trail & Benchmarking:** History table with search, category filtering, and CSV export.

---

### 8. SCOPE
* **User Groups:** Startup founders, incubation managers, academic researchers, angel investors, venture pitch competitions.
* **Industry Applicability:** SaaS/B2B, Consumer Tech/D2C, HealthTech, FinTech, DeepTech, EdTech, Logistics.
* **Deployment Scope:** Compatible with all modern desktop and mobile browsers; standalone client mode via localStorage and optional containerized Node.js/Express backend mode.

---

### 9. TECHNOLOGIES USED

#### Frontend:
* **React.js (v18.3.1):** Functional component architecture, JSX declarative syntax.
* **Vite (v5.4.2):** Build tool, ES modules bundler, Hot Module Replacement (HMR).
* **JavaScript (ES6+):** Pure business logic, async handling, modular utilities.
* **CSS3:** Custom design system with CSS custom properties (variables), Flexbox, CSS Grid, glassmorphism, micro-animations, responsive media queries.
* **React Router DOM (v6.26.1):** Declarative client-side SPA routing (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useNavigate`, `useParams`).
* **Recharts (v2.12.7):** Responsive SVG charting (`BarChart`, `PieChart`, `AreaChart`, `LineChart`, custom tooltips).
* **Lucide React (v0.460.0):** Lightweight vector iconography.

#### Backend (Companion API):
* **Node.js (v24+):** Server runtime environment.
* **Express.js:** Minimalist web framework for RESTful routing (`GET`, `POST`, `DELETE`).
* **CORS:** Cross-Origin Resource Sharing middleware.

#### Storage:
* **HTML5 Web Storage (`localStorage`):** Persistent client-side JSON serialization.
* **JSON Flat File / SQLite:** Companion backend persistence.

---

### 10. SYSTEM REQUIREMENTS

#### Hardware Requirements:
* **Processor:** Intel Core i3 / AMD Ryzen 3 or higher.
* **RAM:** Minimum 4 GB (8 GB recommended for development).
* **Disk Space:** 500 MB free hard drive space.
* **Display:** 1280x720 minimum screen resolution (responsive up to 4K).

#### Software Requirements:
* **Operating System:** Windows 10/11, macOS, or Linux.
* **Web Browser:** Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+.
* **Runtime:** Node.js v18.0.0 or higher.
* **Package Manager:** npm v8.0.0 or higher.

---

### 11. SYSTEM ARCHITECTURE

```
+-------------------------------------------------------------------------+
|                          CLIENT BROWSER (Vite / React SPA)              |
|                                                                         |
|  +--------------------+   +-----------------------+   +---------------+ |
|  |     Navbar.jsx     |   |   DiagnosisForm.jsx   |   |  Sidebar.jsx  | |
|  +--------------------+   +-----------------------+   +---------------+ |
|             |                         |                       |         |
|  +--------------------+   +-----------------------+   +---------------+ |
|  |     Pages:         |   |     Components:       |   |  Recharts     | |
|  | - Home.jsx         |   | - HealthScore.jsx     |   |  Visuals:     | |
|  | - Diagnosis.jsx    |   | - MetricCard.jsx      |   | - Revenue/Exp | |
|  | - Result.jsx       |   | - RiskCard.jsx        |   | - Health Dist | |
|  | - Dashboard.jsx    |   | - RecommendationCard  |   | - Growth/Ret  | |
|  | - History.jsx      |   | - StartupCard.jsx     |   | - Score Bars  | |
|  | - About.jsx        |   +-----------------------+   +---------------+ |
+-------------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-----------------------------+             +-----------------------------+
|    healthCalculator.js      |             |         storage.js          |
|  - calculateProfitMargin()  |             |  - getStoredStartups()      |
|  - calculateCashRunway()    |             |  - saveStartupDiagnosis()   |
|  - calculateHealthScore()   |             |  - deleteStartupById()      |
|  - getRiskFactors()         |             |  - resetToSampleData()      |
|  - getRecommendations()     |             +-----------------------------+
+-----------------------------+                               |
                                                              v
                                              +-------------------------------+
                                              |      Browser LocalStorage     |
                                              |  (Key: startup_health_records)|
                                              +-------------------------------+
                                                              | (Optional Sync)
                                                              v
                                              +-------------------------------+
                                              |  Node.js / Express Server     |
                                              |  REST API: /api/startups      |
                                              +-------------------------------+
```

---

### 12. DATA FLOW DIAGRAM (DFD)

```
[ User / Founder ]
       |
       | 1. Enters Startup Financial & Operating Data
       v
[ DiagnosisForm.jsx ]
       |
       | 2. Input Validation (Checks required fields, limits)
       v
[ healthCalculator.js Engine ]
       |
       |-- Compute Profit Margin = ((Rev - Exp) / Rev) * 100
       |-- Compute Cash Runway = Cash / Monthly Burn Rate
       |-- Compute Debt Ratio = Debt / (Cash + Annual Rev)
       |-- Aggregate Weighted Health Score (0–100)
       |-- Classify Status (Healthy / Moderate Risk / High Risk)
       |-- Generate Risks & Personalized Recommendations
       v
[ storage.js ] ---> Persists JSON to Browser localStorage
       |
       v
[ Result.jsx Dashboard ]
       |
       |-- Renders Animated Circular Gauge (HealthScore.jsx)
       |-- Renders KPI Badges (MetricCard.jsx)
       |-- Renders Severity Cards (RiskCard.jsx)
       |-- Renders Action Checklist (RecommendationCard.jsx)
       |-- Renders 6-Month Cash Projection Chart (Charts.jsx)
```

---

### 13. REACT ARCHITECTURE & CONCEPTS IMPLEMENTED

| Concept | Implementation in Project | File Reference |
| :--- | :--- | :--- |
| **Functional Components** | 100% of application components built as ES6 arrow/const functions. | `Navbar.jsx`, `MetricCard.jsx`, `Result.jsx` |
| **Component Composition** | Nesting child UI components (`MetricCard`, `RiskCard`, `Charts`) inside parent views. | `Result.jsx`, `Dashboard.jsx` |
| **Props Passing** | Delivering dynamic data, titles, icons, and styling callbacks between components. | `<HealthScore score={...} breakdown={...} />` |
| **useState Hook** | Managing state for multi-step form steps, form fields, search queries, modal/menu toggles. | `DiagnosisForm.jsx`, `History.jsx` |
| **useEffect Hook** | Initializing data on component mount, retrieving URL params, setting notification timers. | `Dashboard.jsx`, `Result.jsx` |
| **Conditional Rendering** | Rendering status badges (green/yellow/red) based on score thresholds; empty states. | `HealthScore.jsx`, `History.jsx` |
| **List Rendering & Keys** | Iterating through risk arrays, recommendations, and startup records using `.map()` with unique keys. | `History.jsx`, `Charts.jsx` |
| **Form Handling** | Multi-step wizard form with controlled inputs, error state management, and submit interceptors. | `DiagnosisForm.jsx` |
| **Client-Side Routing** | Declarative page transitions via React Router v6 with active tab styling. | `App.jsx`, `Navbar.jsx` |

---

### 14. HEALTH SCORE ALGORITHM

The system calculates an integer **Startup Health Score (0–100)** through a weighted composite index:

$$\text{Health Score} = (S_{\text{profit}} \times 0.25) + (S_{\text{runway}} \times 0.25) + (S_{\text{growth}} \times 0.20) + (S_{\text{retention}} \times 0.15) + (S_{\text{debt}} \times 0.15) + B_{\text{stability}}$$

Where:
1. **Profitability Score ($S_{\text{profit}}$ - 25%):**
   * $\text{Margin} \ge 30\% \implies 100$
   * $15\% \le \text{Margin} < 30\% \implies 88$
   * $0\% \le \text{Margin} < 15\% \implies 75$
   * $-20\% \le \text{Margin} < 0\% \implies 58$
   * $\text{Margin} < -50\% \implies 20$
2. **Cash Runway Safety ($S_{\text{runway}}$ - 25%):**
   * $\text{Runway} \ge 24\text{ months or profitable} \implies 95-100$
   * $18 \le \text{Runway} < 24\text{ months} \implies 85$
   * $12 \le \text{Runway} < 18\text{ months} \implies 72$
   * $6 \le \text{Runway} < 12\text{ months} \implies 50$
   * $\text{Runway} < 3\text{ months} \implies 12\text{ (Solvency Danger)}$
3. **Customer Growth Velocity ($S_{\text{growth}}$ - 20%):**
   * Growth $\ge 25\%/\text{mo} \implies 100$
   * $15\% \le \text{Growth} < 25\% \implies 85$
   * $8\% \le \text{Growth} < 15\% \implies 72$
   * $\text{Growth} < 3\% \implies 40$
4. **Customer Retention Quality ($S_{\text{retention}}$ - 15%):**
   * Retention $\ge 85\% \implies 100$
   * $75\% \le \text{Retention} < 85\% \implies 85$
   * $60\% \le \text{Retention} < 75\% \implies 68$
   * $\text{Retention} < 45\% \implies 30\text{ (Severe Churn)}$
5. **Debt & Solvency Health ($S_{\text{debt}}$ - 15%):**
   * Debt $= 0 \implies 100$
   * Debt-to-Capital $\le 20\% \implies 88$
   * Debt-to-Capital $\ge 65\% \implies 25$
6. **Stability Modifier ($B_{\text{stability}}$ - Up to +5 pts):**
   * Experienced founder (5+ yrs) $= +3$
   * Company operating $> 3$ years $= +2$

#### Risk Level Classification:
* **80 – 100:** **Healthy Startup** (Low Risk, Sustainable Unit Economics)
* **60 – 79:** **Moderate Risk** (Viable core business, operational caution advised)
* **0 – 59:** **High Risk** (Critical cash flow deficit or churn vulnerability)

---

### 15. MACHINE LEARNING & ENSEMBLE CLASSIFICATION PIPELINE

The platform couples its deterministic mathematical engine with a **supervised Machine Learning pipeline** implemented in Python (`scikit-learn` and Flask). The pipeline classifies startups into three risk tiers: `Healthy`, `Moderate Risk`, and `Critical`.

#### 15.1 Algorithms Implemented:
1. **Decision Tree Classifier (`DecisionTreeClassifier`):**
   * Configured with `max_depth=5`, `criterion='gini'`, and `random_state=42`.
   * Splits hierarchically on primary threshold cutoffs (e.g., cash runway and margin), providing immediate decision-path explainability.
2. **Random Forest Classifier (`RandomForestClassifier` - Primary Robust Model):**
   * Configured with `n_estimators=100`, `max_depth=8`, `criterion='gini'`, and `random_state=42`.
   * Ensembles 100 decorrelated decision trees using bootstrap aggregation (bagging) and random feature subspace sampling, preventing overfitting and achieving superior generalization.
3. **Logistic Regression (`LogisticRegression`):**
   * Configured with `max_iter=1000`, `random_state=42`.
   * Continuous features are standardized using `StandardScaler` (fitted strictly on the training partition). Computes smooth posterior class probabilities via softmax multinomial classification.
4. **Ensemble Majority Voting Engine:**
   * Combines all three models via Hard Majority Voting. If two or three models predict class $C$, $C$ is chosen as the final ensemble prediction.
   * If a 3-way tie occurs, the class with the highest average predicted probability across all three models is assigned.

#### 15.2 Actual Measured Test Performance (20% Unseen Test Split, $N=150$):

| Algorithm | Accuracy | Precision (Macro) | Recall (Macro) | F1 Score (Macro) |
| :--- | :--- | :--- | :--- | :--- |
| **Decision Tree** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |
| **Random Forest (Primary)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |
| **Logistic Regression** | **99.33%** | **99.35%** | **99.33%** | **99.33%** |
| **Ensemble (Majority Vote)**| **100.00%** | **100.00%** | **100.00%** | **100.00%** |

#### 15.3 Top Feature Importance Breakdown (Random Forest):
* **Profit Margin (`profit_margin`):** 23.93%
* **Customer Growth Velocity (`customer_growth`):** 22.87%
* **Cash Runway (`runway`):** 20.10%
* **Revenue Growth Rate (`growth_rate`):** 16.67%
* **Monthly Revenue (`monthly_revenue`):** 10.03%
* **Burn Rate (`burn_rate`):** 3.11%
* **Employee Headcount (`employees`):** 1.99%
* **Monthly Operating Expenses (`monthly_expenses`):** 1.30%

---

### 16. DATABASE & LOCAL STORAGE DESIGN

The application serializes startup objects into browser `localStorage` under the key:
`startup_health_diagnosis_records`

#### Schema Structure:
```json
{
  "id": "seed-technova",
  "startupName": "TechNova Cloud",
  "industry": "SaaS / B2B Software",
  "yearsInOperation": 3,
  "numberOfEmployees": 22,
  "founderExperience": "Experienced (5+ yrs)",
  "marketCompetition": "Moderate",
  "monthlyRevenue": 600000,
  "monthlyExpenses": 340000,
  "availableCash": 2500000,
  "monthlyBurnRate": 120000,
  "totalDebt": 300000,
  "totalFundingReceived": 4000000,
  "customerGrowthRate": 18,
  "monthlyActiveUsers": 16500,
  "customerRetentionRate": 88,
  "healthScore": 88,
  "status": "Healthy Startup",
  "riskLevel": "Low Risk",
  "statusColor": "#10b981",
  "mlPrediction": {
    "available": true,
    "prediction": "Healthy",
    "confidence": 1.0,
    "decisionTree": { "prediction": "Healthy", "confidence": 1.0 },
    "randomForest": { "prediction": "Healthy", "confidence": 1.0 },
    "logisticRegression": { "prediction": "Healthy", "confidence": 0.99 },
    "ensemble": { "prediction": "Healthy", "confidence": 1.0, "agreement": "3/3 models agree" }
  },
  "breakdown": {
    "profitability": 88,
    "runwaySafety": 95,
    "growthTraction": 85,
    "retentionQuality": 100,
    "debtSolvency": 88
  },
  "metrics": {
    "profitMargin": 43.3,
    "cashRunway": 20.8,
    "revenueExpenseRatio": 1.76,
    "debtRatio": 3.1
  },
  "risks": [...],
  "recommendations": [...],
  "createdAt": "2026-10-03T12:00:00.000Z"
}
```

---

### 17. ADVANTAGES
1. **Hybrid Intelligence:** Couples intuitive, explainable rule-based weights with empirical Machine Learning predictions.
2. **Zero Deployment Barrier:** Runs immediately in any browser without configuring external SQL/NoSQL connection strings.
3. **Instant Executive Feedback:** Dynamic SVG score gauges, multi-model consensus badges, and cash projection curves provide actionable insights in seconds.
4. **Comprehensive Evaluation:** Blends traditional financial metrics with modern SaaS growth and retention factors.
5. **Action-Oriented Output:** Delivers concrete checklists rather than ambiguous numeric scores.
6. **Interactive Demonstration Ready:** Includes quick-preset demo buttons and pre-seeded benchmark records for effortless evaluation.

---

### 18. LIMITATIONS
1. **Self-Reported Data:** Relies on accurate founder inputs without real-time bank ledger verification.
2. **Deterministic Thresholds:** Fixed scoring bands require sector-specific fine-tuning for capital-intensive domains (e.g., DeepTech, Biotech).
3. **Single Currency Focus:** Primary labels display in Indian Rupees (₹) by default, though formulas are currency-agnostic.

---

### 19. FUTURE SCOPE
1. **Automated Bank & Stripe API Ingestion:** Direct integration with Stripe, Plaid, or Razorpay for automated revenue and churn streaming.
2. **AI LLM Pitch Deck Analyst:** Upload pitch deck PDFs and use Generative AI to cross-examine financial claims against market benchmarks.
3. **Multi-User Collaborative Portals:** Role-based access control (RBAC) enabling investors to manage portfolios of multiple startup founders.

---

### 20. CONCLUSION
The **Startup Health Diagnosis System** successfully fulfills all objectives of a modern academic engineering mini-project. By uniting React.js functional components, reactive state management, Recharts data visualization, Python scikit-learn machine learning, and financial engineering algorithms, the system delivers an enterprise-grade experience. It serves as an exemplary pair of engineering rigor and real-world utility, demonstrating how modern web technologies can illuminate financial solvency and empower early-stage entrepreneurship.

