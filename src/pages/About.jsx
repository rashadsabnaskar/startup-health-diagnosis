import React, { useState } from 'react';
import { 
  Info, 
  Code, 
  Cpu, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

const VIVA_QUESTIONS = [
  {
    q: '1. What is the objective of the Startup Health Diagnosis System?',
    a: 'The objective is to provide a data-driven diagnostic tool that analyzes essential financial and operating parameters (revenue, expenses, cash, burn rate, debt, customer retention, growth) and outputs an automated 0–100 health score, risk classification, runway forecast, and customized recommendations.'
  },
  {
    q: '2. What are React Functional Components?',
    a: 'Functional components are pure JavaScript functions that accept props as an argument and return React elements (JSX). They are the modern standard in React development, enabling the use of React Hooks without writing ES6 class components.'
  },
  {
    q: '3. What is the difference between Props and State in React?',
    a: 'Props (short for properties) are read-only inputs passed from parent components to child components to configure them. State is mutable data managed locally within a component that triggers a re-render when modified via its setter function (e.g., setFormData).'
  },
  {
    q: '4. How does the useState hook work in this project?',
    a: 'useState declares state variables inside functional components. In our project, it manages the multi-section diagnostic form input fields, active wizard steps, search filter queries, mobile drawer toggles, and notification alerts.'
  },
  {
    q: '5. How is the useEffect hook utilized in the project?',
    a: 'useEffect manages side effects such as retrieving saved records from browser localStorage when the component mounts, syncing URL parameters (:id in Result.jsx), and managing timers for toast notifications.'
  },
  {
    q: '6. How does React Router facilitate single-page application (SPA) routing?',
    a: 'React Router (BrowserRouter, Routes, Route, NavLink, useNavigate, useParams) intercepts link navigation in the browser without reloading the page, rendering appropriate page components (Home, Diagnosis, Result, Dashboard, History, About) dynamically.'
  },
  {
    q: '7. How is Conditional Rendering implemented in this system?',
    a: 'Conditional rendering dynamically displays different UI elements based on state or calculated metrics. For example, rendering green/yellow/red badges based on whether healthScore >= 80, 60-79, or < 60, switching between form wizard steps, and rendering empty states when search yields no matches.'
  },
  {
    q: '8. How is List Rendering handled in React, and why are "keys" required?',
    a: 'List rendering uses JavaScript’s Array.prototype.map() to generate JSX components for arrays of startups, risks, or recommendations. Unique "key" props allow React’s virtual DOM reconciliation algorithm to identify which items have changed, been added, or removed efficiently.'
  },
  {
    q: '9. How is Event Handling performed in the application?',
    a: 'React uses synthetic event wrappers like onChange, onClick, and onSubmit. Form input changes update local state via handleInputChange, step transitions occur via handleNext, and form submission invokes validation before persisting to storage.'
  },
  {
    q: '10. How does browser localStorage work, and what are its advantages for this project?',
    a: 'localStorage is a client-side key-value Web Storage API that persists stringified JSON data across browser sessions and page refreshes without needing a dedicated backend database server. It allows the project to run entirely standalone and offline.'
  },
  {
    q: '11. How is Cash Runway defined and calculated?',
    a: 'Cash Runway is the number of months a startup can operate before exhausting liquid cash reserves: Cash Runway = Available Cash / Net Monthly Burn Rate. If a business is profitable (revenue > expenses), runway is effectively safe (36+ months).'
  },
  {
    q: '12. How is Operating Profit Margin computed in the health algorithm?',
    a: 'Profit Margin (%) = ((Monthly Revenue - Monthly Expenses) / Monthly Revenue) × 100. A positive margin indicates organic cash generation, while a negative margin indicates operating capital deficit.'
  },
  {
    q: '13. What is the weighted Health Score algorithm logic?',
    a: 'The 0–100 health score aggregates five core pillars: 1) Profitability & Unit Economics (25%), 2) Cash Runway Safety (25%), 3) Customer Growth Velocity (20%), 4) Customer Retention & Churn Shield (15%), and 5) Debt Solvency (15%), with modifier bonuses for founder tenure.'
  },
  {
    q: '14. How are startup risks automatically identified?',
    a: 'getRiskFactors() runs rule-based diagnostic heuristics: flagging critical runway if < 3 months, negative cash flow if expenses exceed revenue, high churn if retention < 60%, over-leverage if debt exceeds 6x revenue, or acquisition stagnation if growth <= 2%.'
  },
  {
    q: '15. How are personalized recommendations generated?',
    a: 'Recommendations are dynamically generated based on detected risk areas, providing prioritized checklists (e.g., renegotiating vendor software licenses if burn is high, launching loyalty/NPS playbooks if retention is weak, and preparing investor pitch decks if runway < 12 months).'
  },
  {
    q: '16. How does Recharts render visualizations in React?',
    a: 'Recharts is a declarative charting library built on React components and SVG. It provides ResponsiveContainer, BarChart, AreaChart, and PieChart that automatically resize, animate on data changes, and render custom HTML tooltips.'
  },
  {
    q: '17. What is Component Composition in React?',
    a: 'Component composition is the practice of combining smaller, single-responsibility components (e.g., MetricCard, HealthScore, RiskCard, Sidebar) into complex page structures, making code modular, maintainable, and reusable.'
  },
  {
    q: '18. Why was Vite chosen instead of Create React App (CRA)?',
    a: 'Vite leverages native ES modules and esbuild for instant cold-starts, sub-second Hot Module Replacement (HMR), and optimized production builds, whereas CRA relies on older Webpack configurations which are slower and officially deprecated.'
  },
  {
    q: '19. How can an Express.js backend be integrated with this React frontend?',
    a: 'An Express server with RESTful routes (GET /api/startups, POST /api/diagnose, DELETE /api/startups/:id) can be connected using JavaScript fetch() or axios, replacing localStorage with database queries (e.g., MongoDB Mongoose or SQLite).'
  },
  {
    q: '20. What is an API (Application Programming Interface)?',
    a: 'An API defines protocols and routines that allow the frontend client to communicate with backend servers over HTTP using standard methods like GET, POST, PUT, and DELETE with JSON payloads.'
  },
  {
    q: '21. What is the difference between MongoDB and SQLite?',
    a: 'MongoDB is a NoSQL document database storing unstructured or semi-structured BSON/JSON documents, ideal for flexible schemas. SQLite is a lightweight, serverless relational (SQL) database engine stored as a single file on disk.'
  },
  {
    q: '22. What are the key frontend design principles applied in this project?',
    a: 'The application employs a curated color system (high-contrast slate, electric blues, emerald greens for health, red for risks), consistent typography (Plus Jakarta Sans & Inter), CSS variable tokens, responsive flexbox/grid layouts, and subtle micro-animations.'
  },
  {
    q: '23. How does the system handle responsive design across mobile and desktop?',
    a: 'Using CSS3 Media Queries (@media max-width: 1024px and 768px), fluid container widths, auto-wrapping CSS grids, and a mobile hamburger menu drawer with smooth toggle transitions.'
  },
  {
    q: '24. What are the limitations of the current system?',
    a: 'Current limitations include reliance on client-side self-reported user metrics without third-party accounting API integrations (e.g., Stripe, QuickBooks), and heuristic rule-based weighting rather than trained neural network weights.'
  },
  {
    q: '25. What is the future scope and Machine Learning potential for this project?',
    a: 'Future scope involves training supervised ML models (e.g., Random Forest or XGBoost) on historical startup failure/success datasets (like Crunchbase or AngelList) to predict bankruptcy probability 12-24 months in advance, and integrating LLMs for automated pitch deck reviews.'
  }
];

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem', color: '#bfdbfe' }}>
            <Award size={16} />
            <span>Academic Mini-Project Documentation</span>
          </div>
          <h1>Startup Health Diagnosis System</h1>
          <p>
            A full-stack engineered web application designed for automated business solvency assessment, 
            capital runway projection, risk identification, and strategic growth guidance.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
        {/* Project Abstract & Overview */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Project Abstract & Objectives</h2>
          </div>
          <p style={{ marginBottom: '1rem', color: '#475569', lineHeight: 1.7 }}>
            Over 90% of early-stage startups fail within their first five years, primarily due to premature cash exhaustion, 
            miscalculated burn rates, high customer churn, and lack of product-market fit. Founders frequently lack accessible 
            diagnostic tools to objectively evaluate their financial solvency before capital runs out.
          </p>
          <p style={{ color: '#475569', lineHeight: 1.7 }}>
            The <strong>Startup Health Diagnosis System</strong> solves this problem by providing an interactive diagnostic platform. 
            By capturing operational parameters across financials, runway, customer retention, and debt obligations, the system 
            computes a standardized <strong>Startup Health Score (0–100)</strong>, categorizes risk levels, projects cash exhaustion curves, 
            and delivers prioritized, actionable mitigation strategies.
          </p>
        </div>

        {/* System Architecture & Tech Stack */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Technology Stack & Architecture</h2>
          </div>

          <div className="grid-3">
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#2563eb', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={18} /> Frontend Framework
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>React 18:</strong> Functional Components & Hooks</li>
                <li>&bull; <strong>Vite:</strong> Ultra-fast build & HMR tool</li>
                <li>&bull; <strong>React Router v6:</strong> SPA client-side routing</li>
                <li>&bull; <strong>Vanilla CSS3:</strong> Custom design system & tokens</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={18} /> Analytics & Graphics
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>Recharts:</strong> SVG Bar, Area, & Pie charts</li>
                <li>&bull; <strong>Lucide React:</strong> Clean iconography</li>
                <li>&bull; <strong>Pure JS Engine:</strong> Mathematical scoring logic</li>
                <li>&bull; <strong>SVG Circular Gauge:</strong> Animated score meter</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#6366f1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={18} /> Data Persistence
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>Browser LocalStorage:</strong> Zero-setup offline store</li>
                <li>&bull; <strong>Seed Initialization:</strong> 6 realistic benchmarks</li>
                <li>&bull; <strong>Node.js / Express Companion:</strong> REST API ready</li>
                <li>&bull; <strong>JSON / CSV Export:</strong> Audit backup engine</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 25 Viva Voce Preparation Section */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>College Viva Questions & Answers (25 Key Topics)</h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Comprehensive preparation guide for external examiner evaluation</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setOpenIndex(openIndex === -1 ? null : -1)} 
                className="btn btn-secondary btn-sm"
              >
                {openIndex === -1 ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {VIVA_QUESTIONS.map((item, idx) => {
              const isOpen = openIndex === -1 || openIndex === idx;
              return (
                <div 
                  key={idx} 
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleQuestion(idx)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: isOpen ? '#2563eb' : '#0f172a'
                    }}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
