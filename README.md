# Startup Health Diagnosis System 🩺📊

A complete, professional, web-based **Startup Health Diagnosis System** built with **React.js, Vite, Recharts, and Modern Vanilla CSS**.

Evaluates startup financial solvency, operational burn rate, cash runway, customer retention, and debt leverage to generate an automated **Startup Health Score (0–100)**, risk triage, and strategic growth recommendations.

---

## 🚀 Quick Start (Installation & Execution)

### 1. Prerequisites
Ensure you have **Node.js (v18 or higher)** installed on your machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open your browser at:
```
http://localhost:5173/
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | React.js (v18), Vite, JavaScript (ES6+), HTML5, CSS3 |
| **Routing** | React Router v6 (`BrowserRouter`, `Routes`, `Route`, `NavLink`) |
| **Data Visualizations** | Recharts (`ResponsiveContainer`, `BarChart`, `PieChart`, `AreaChart`) |
| **Icons** | Lucide React |
| **State & Lifecycle** | React Hooks (`useState`, `useEffect`, Custom Logic) |
| **Storage / Persistence** | Browser `localStorage` (Zero-setup client-side persistence) |
| **Optional Companion API** | Node.js, Express.js (`server/server.js`) |

---

## 🌟 Key Features

1. **Professional SaaS Landing Page**
   - High-contrast modern dark/light theme, typography with Plus Jakarta Sans & Inter.
   - Hero banner with quick KPI metrics, feature showcase, and step-by-step diagnostic workflow.
2. **Interactive Multi-Step Diagnosis Form**
   - Step 1: Basic Information (Startup Name, Industry, Years, Employees, Founder Tenure)
   - Step 2: Financials (Revenue, Expenses, Available Cash, Burn Rate, Total Debt, Funding)
   - Step 3: Traction & Market (Growth Rate, Monthly Active Users, Customer Retention)
   - **Demo Quick-Fill Presets:** Test healthy, moderate, or distressed startups with 1-click chips!
3. **Automated Health Score & Indicator**
   - Animated SVG circular gauge displaying health score (0–100).
   - 5-pillar breakdown meters (Profitability, Runway Safety, Growth, Retention, Solvency).
   - Threshold-based status badge:
     - 🟢 **80–100:** *Healthy Startup*
     - 🟡 **60–79:** *Moderate Risk*
     - 🔴 **0–59:** *High Risk*
4. **Automated Risk Analysis Cards**
   - Dynamically identifies vulnerabilities with severity ratings (High, Medium, Low).
   - Explains root causes and recommended mitigation solutions.
5. **Personalized Strategic Recommendations**
   - Actionable checklists categorized by urgency (Immediate 30 Days, 60 Days, 90 Days).
6. **Executive Analytics Dashboard**
   - Aggregate KPIs: Total Startups Analyzed, Healthy, Moderate Risk, High Risk, Average Health Score.
   - 5 Interactive Recharts visual graphs:
     1. Revenue vs Operating Expenses
     2. Health Score Distribution (Donut Chart)
     3. Customer Growth vs Retention Trajectories (Area Chart)
     4. Health Score by Startup (Bar Chart)
     5. Identified Risk Factor Distribution (Severity Bar Chart)
7. **Diagnosis History & Audit Trail**
   - Searchable and filterable data table with category tabs (`All`, `Healthy`, `Moderate`, `High Risk`).
   - View detailed report, delete entries, or export the full database to CSV.
8. **Academic Documentation & 25 Viva Voce Questions**
   - Built directly into the application under the **About** section for effortless viva evaluation.

---

## 📁 Project Structure

```
startup-health-diagnosis/
│
├── public/
├── server/
│   └── server.js               # Node.js + Express REST API companion
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive navbar with mobile hamburger drawer
│   │   ├── Sidebar.jsx         # Admin dashboard sidebar with quick actions
│   │   ├── HealthScore.jsx     # Animated circular SVG score gauge & breakdown meters
│   │   ├── MetricCard.jsx      # Reusable KPI metric card with trends and icons
│   │   ├── DiagnosisForm.jsx   # Multi-step validated diagnostic form with preset chips
│   │   ├── RiskCard.jsx        # Identified risk card with severity badge & mitigation
│   │   ├── RecommendationCard.jsx # Actionable advice card with execution checklist
│   │   ├── StartupCard.jsx     # Individual startup summary tile for dashboard
│   │   └── Charts.jsx          # Recharts components (Bar, Pie, Area, Line, Forecast)
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Landing page (Hero, stats, features, workflow, footer)
│   │   ├── Diagnosis.jsx       # Diagnostic wizard view & formula guide
│   │   ├── Result.jsx          # Full diagnosis report with score, risks, & recommendations
│   │   ├── Dashboard.jsx       # Executive analytics dashboard with 5 Recharts graphs
│   │   ├── History.jsx         # Searchable history table with filter tabs & CSV export
│   │   └── About.jsx           # Project documentation & 25 interactive viva questions
│   │
│   ├── utils/
│   │   ├── healthCalculator.js # Pure mathematical modeling, runway, scoring, & risk heuristics
│   │   └── storage.js          # LocalStorage CRUD manager with 6 initial seed startups
│   │
│   ├── App.jsx                 # Client-side router configuration (React Router v6)
│   ├── main.jsx                # Application DOM entry point
│   ├── App.css                 # Page layouts, cards, gauges, charts, & responsive media queries
│   └── index.css               # Design system tokens, typography, utilities, buttons, & resets
│
├── index.html                  # HTML5 shell with Google Fonts
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
└── PROJECT_DOCUMENTATION.md    # 19-section college project documentation
```

---

## 🎓 Academic Evaluation & Viva Voce

Check the live **About** page (`http://localhost:5173/about`) for:
* Complete 19-section project synopsis (Problem statement, architecture, algorithms, limitations, future scope).
* Interactive accordion containing all **25 Viva Voce Questions and Model Answers**.
