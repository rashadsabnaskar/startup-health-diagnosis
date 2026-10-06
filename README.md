# Startup Health Diagnosis System 🩺📊

An intelligent, web-based **Startup Health Diagnosis System** built with **React.js, Vite, Recharts, scikit-learn, Python Flask, and Node.js/Express**.

Evaluates startup financial solvency, operational burn rate, cash runway, customer retention, and debt leverage using a **dual-engine architecture**:
1. **Deterministic 5-Pillar Financial Engine** calculating a normalized Startup Health Score (0–100).
2. **Supervised Machine Learning & Ensemble Pipeline** combining **Decision Tree**, **Random Forest (Primary)**, and **Logistic Regression** via **Majority Voting** to predict startup risk:
   - 🟢 **Healthy**
   - 🟡 **Moderate Risk**
   - 🔴 **Critical**

---

## 🚀 Quick Start (Installation & Execution)

### 1. Prerequisites
- **Node.js (v18 or higher)**
- **Python (v3.10 or higher)**

### 2. Frontend Application (React 18 + Vite)
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
Open browser at: `http://localhost:5173/`

### 3. Machine Learning Microservice (Python Flask API)
```bash
cd ml_model

# Train models on dataset
python train.py

# Launch Flask ML API on port 5001
python app.py
```
ML API runs on: `http://localhost:5001/`

### 4. (Optional) Node.js Companion Backend
```bash
cd server
npm install
node server.js
```
Express REST API runs on: `http://localhost:5000/`

---

## 🤖 Supervised Machine Learning Algorithms

The application incorporates three complementary scikit-learn classifiers and an ensemble consensus mechanism:

### 1. Decision Tree Classifier
- **Algorithm:** `DecisionTreeClassifier(max_depth=5, criterion='gini', random_state=42)`
- **Role:** Transparent hierarchical decision thresholds splitting on cash runway and unit margins. Highly explainable for early-stage venture triage.

### 2. Random Forest Classifier (Primary Robust Model)
- **Algorithm:** `RandomForestClassifier(n_estimators=100, max_depth=8, criterion='gini', random_state=42)`
- **Role:** Bagging ensemble of 100 decorrelated decision trees with random feature subsampling. Delivers optimal stability and generalization on unseen test data.

### 3. Logistic Regression (with StandardScaler)
- **Algorithm:** `LogisticRegression(max_iter=1000, random_state=42)`
- **Role:** Softmax multinomial regression with standardized numerical scaling (`StandardScaler` fitted strictly on training data).

### 4. Ensemble Majority Voting
- **Method:** Hard Majority Voting with Soft Probability Average Tie-Breaking
- **Role:** If 2 or 3 models agree on a risk class, majority voting determines the final risk level. If a 3-way tie arises, the system selects the class with the highest average predicted probability across all models.

---

## 📊 Actual Model Performance (Measured on 20% Unseen Test Split)

| Algorithm | Accuracy | Precision (Macro) | Recall (Macro) | F1 Score (Macro) |
| :--- | :--- | :--- | :--- | :--- |
| **Decision Tree** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |
| **Random Forest (Primary)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |
| **Logistic Regression** | **99.33%** | **99.35%** | **99.33%** | **99.33%** |
| **Ensemble (Majority Vote)**| **100.00%** | **100.00%** | **100.00%** | **100.00%** |

### Top Feature Importances (Random Forest)
1. **Profit Margin (`profit_margin`):** 23.93%
2. **Customer Growth Velocity (`customer_growth`):** 22.87%
3. **Cash Runway (`runway`):** 20.10%
4. **Revenue Growth Rate (`growth_rate`):** 16.67%
5. **Monthly Revenue (`monthly_revenue`):** 10.03%

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | React.js (v18), Vite, JavaScript (ES6+), HTML5, CSS3 |
| **Routing** | React Router v6 (`BrowserRouter`, `Routes`, `Route`, `NavLink`) |
| **Data Visualizations** | Recharts (`ResponsiveContainer`, `BarChart`, `PieChart`, `AreaChart`) |
| **Icons** | Lucide React |
| **Machine Learning** | Python 3, scikit-learn, pandas, numpy, joblib |
| **ML Microservice** | Flask, Flask-CORS (Port 5001) |
| **State & Lifecycle** | React Hooks (`useState`, `useEffect`, Custom Logic) |
| **Persistence** | Browser `localStorage` (Zero-setup client persistence) + Node.js / Express |

---

## 📁 Project Structure

```text
startup-health-diagnosis/
│
├── ml_model/                   # Machine Learning Pipeline & Microservice
│   ├── app.py                  # Flask REST API (Port 5001)
│   ├── train.py                # Multi-model training and evaluation script
│   ├── generate_dataset.py     # Realistic 750-record dataset generator
│   ├── dataset.csv             # Training and evaluation dataset
│   ├── requirements.txt        # Python dependencies
│   ├── model_metrics.json      # Actual evaluated metrics & feature importances
│   ├── models/                 # Serialized model artifacts (.pkl)
│   │   ├── decision_tree.pkl
│   │   ├── random_forest.pkl
│   │   ├── logistic_regression.pkl
│   │   └── scaler.pkl
│   └── README.md
│
├── server/
│   ├── server.js               # Node.js + Express REST API companion (Port 5000)
│   └── package.json            # Server dependencies
│
├── src/
│   ├── components/
│   │   ├── AIPredictionCard.jsx    # Multi-model risk card with ensemble consensus
│   │   ├── MLPerformanceCard.jsx   # Confusion matrix & feature importance breakdown
│   │   ├── HealthScore.jsx         # Animated radial SVG score gauge
│   │   ├── MetricCard.jsx          # Reusable KPI metric card with trends
│   │   ├── DiagnosisForm.jsx       # 4-step wizard form with 1-click test presets
│   │   ├── RiskCard.jsx            # Vulnerability card with severity badge & fix
│   │   ├── RecommendationCard.jsx  # Strategic advice card with action checklist
│   │   ├── StartupCard.jsx         # Startup summary tile for dashboard
│   │   ├── Charts.jsx              # Recharts components (Area, Bar, Pie, Forecast)
│   │   ├── Navbar.jsx              # Responsive navigation header
│   │   └── Sidebar.jsx             # Admin sidebar
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Landing page (Hero, metrics, workflow)
│   │   ├── Diagnosis.jsx       # Diagnostic wizard intake
│   │   ├── Result.jsx          # Executive report (Deterministic score + ML ensemble)
│   │   ├── Dashboard.jsx       # Aggregate portfolio analytics & ML model explorer
│   │   ├── History.jsx         # Searchable table with CSV export
│   │   └── About.jsx           # Technical architecture & algorithm documentation
│   │
│   ├── utils/
│   │   ├── healthCalculator.js # 5-pillar mathematical scoring & recommendation engine
│   │   ├── mlService.js        # Multi-model ML API client with offline fallback
│   │   └── storage.js          # LocalStorage CRUD manager with benchmark seeds
│   │
│   ├── App.jsx                 # Router configuration
│   ├── main.jsx                # DOM mount
│   ├── App.css                 # Layout styles & responsive design
│   └── index.css               # Design tokens & utilities
│
├── PROJECT_DOCUMENTATION.md    # Comprehensive technical documentation
├── PROJECT_REPORT.md           # Engineering project report
└── package.json
```
