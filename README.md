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
├── vercel.json                 # Vercel routing & serverless configuration
├── requirements.txt            # Root dependencies for Vercel Python runtime
├── .env.example                # Template for environment variables
└── package.json
```

---

## 🚀 Deployment

The Startup Health Diagnosis System is architected for seamless deployment on **Vercel** with a unified monorepo or split deployment topology (React frontend + Python Serverless ML API).

### 1. How to Run Locally

#### Step 1: Clone and install frontend dependencies
```bash
git clone <repository-url>
cd startup-health-diagnosis
npm install
```

#### Step 2: Set up Python virtual environment and ML dependencies
```bash
cd ml_model
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

#### Step 3: Run the Machine Learning API
```bash
# Inside ml_model/ with active venv:
python app.py
```
The Flask API starts listening at `http://localhost:5001`.

#### Step 4: Run the React frontend
In a separate terminal at the project root:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

### 2. How to Deploy the Frontend on Vercel

The frontend is built with React 18 and Vite:
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Log into [Vercel](https://vercel.com/) and click **"Add New" > "Project"**.
3. Import your repository.
4. Set the Build and Output settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**. Vercel will build the frontend assets into `dist/`. The included `vercel.json` rewrite configuration ensures client-side routing (`/dashboard`, `/diagnosis`, `/result`, `/about`, `/history`) refreshes without 404 errors.

---

### 3. How to Deploy the ML API

The ML API can run on Vercel as a Serverless Python Function or as an independent microservice:

#### Option A: Unified Full-Stack Vercel Deployment (Recommended)
This repository contains `api/index.py`, `vercel.json`, and `requirements.txt`.
- When you deploy the repository to Vercel, Vercel automatically detects the Python runtime in `api/index.py`.
- Requests to `/predict` or `/api/predict` are routed directly to the Python serverless entry point.
- The pre-trained scikit-learn models (`decision_tree.pkl`, `random_forest.pkl`, `logistic_regression.pkl`, and `scaler.pkl`) are bundled with the deployment and loaded via portable relative paths (`pathlib`).

#### Option B: Standalone ML Microservice Deployment
If deploying the Python API as a separate Vercel project or cloud container:
1. Create a new Vercel project with the Root Directory set to `ml_model` (or pointing to `api/`).
2. Deploy the Python application.
3. Note the assigned deployment URL (e.g., `https://startup-health-ml-api.vercel.app`).

---

### 4. Which Environment Variable is Required

The primary environment variable is:

```text
VITE_ML_API_URL
```

- **Local Development:** Not required (leave blank or unset). Defaults automatically to `http://localhost:5001`.
- **Production (Separate ML deployment):** Set to your deployed ML API URL:
  ```text
  VITE_ML_API_URL=https://YOUR-VERCEL-ML-API.vercel.app
  ```
- **Production (Unified Vercel deployment):** Can be left blank (defaults to same-origin `/api/predict`) or set to your production domain:
  ```text
  VITE_ML_API_URL=https://your-domain.vercel.app
  ```

Copy `.env.example` to `.env.local` for local overrides:
```bash
cp .env.example .env.local
```

---

### 5. How to Connect the Frontend to the ML API

1. In the Vercel Dashboard for your Frontend Project, navigate to **Settings > Environment Variables**.
2. Add a new variable:
   - **Key:** `VITE_ML_API_URL`
   - **Value:** `https://YOUR-VERCEL-ML-API.vercel.app` (your deployed ML API URL without trailing slash)
   - **Environments:** Production, Preview, Development
3. Redeploy the frontend so Vite bakes the environment variable into the production build bundle (`import.meta.env.VITE_ML_API_URL`).
4. `src/utils/mlService.js` automatically uses this URL for all prediction and metrics requests.

---

### 6. How to Test the Deployed Application

1. **Verify Health Endpoint:**
   Visit `https://YOUR-DEPLOYED-URL/api/health` or `https://YOUR-DEPLOYED-URL/health` in your browser.
   Expected response:
   ```json
   {
     "status": "healthy",
     "models_loaded": true,
     "algorithms": [
       "Decision Tree Classifier",
       "Random Forest Classifier",
       "Logistic Regression",
       "Ensemble Voting"
     ]
   }
   ```

2. **Test ML Prediction (`POST /predict`):**
   Using cURL or Postman:
   ```bash
   curl -X POST https://YOUR-DEPLOYED-URL/api/predict \
     -H "Content-Type: application/json" \
     -d '{
       "monthlyRevenue": 1500000,
       "monthlyExpenses": 800000,
       "monthlyBurnRate": 300000,
       "availableCash": 5000000,
       "runway": 16.7,
       "customerGrowthRate": 15,
       "employees": 35
     }'
   ```
   Verify that the response returns predictions and confidence values for `decision_tree`, `random_forest`, `logistic_regression`, and `ensemble`.

3. **Test Full End-to-End Diagnostic UI:**
   - Open `https://YOUR-DEPLOYED-URL/diagnosis`.
   - Click the **"✨ Healthy SaaS (TechNova)"** preset button.
   - Click through steps and submit.
   - Confirm that the **Result Page** displays both:
     - The **Deterministic Health Score (90 / 100 - Healthy)**
     - The **AI/ML Risk Analysis (Ensemble: Healthy, 98% Confidence)** with independent cards for Decision Tree, Random Forest, and Logistic Regression.
   - Refresh the page at `/result/<id>` and verify it does NOT produce a 404 error.
   - Test offline resilience: even if the ML API is unreachable, verify the fallback message:
     *"AI prediction service is temporarily unavailable. Showing deterministic startup health analysis."*

