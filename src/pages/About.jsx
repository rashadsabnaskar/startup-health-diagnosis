import React, { useState } from 'react';
import { 
  Info, 
  Code, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Award,
  Sparkles,
  Zap,
  Brain,
  TreeDeciduous,
  Trees,
  Scale,
  GitMerge,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

const ML_ALGORITHMS_INFO = [
  {
    name: '1. Decision Tree Classifier',
    icon: TreeDeciduous,
    color: '#059669',
    bg: '#ecfdf5',
    summary: 'Hierarchical rule-based splitting utilizing Gini Impurity (max_depth=5).',
    explanation: 'A non-parametric supervised learning algorithm that recursively partitions startup data into subsets based on feature threshold cutoffs. It provides clear, transparent explainability of why a company is classified as Healthy, Moderate Risk, or Critical based on key criteria like cash runway and operating profit margins.',
    hyperparameters: 'criterion="gini", max_depth=5, random_state=42'
  },
  {
    name: '2. Random Forest Classifier (Primary Robust Model)',
    icon: Trees,
    color: '#2563eb',
    bg: '#eff6ff',
    summary: 'Bagging ensemble consisting of 100 decorrelated decision trees.',
    explanation: 'Random Forest builds an ensemble of 100 diverse decision trees, each trained on a bootstrap sample of the startup dataset with random feature subspace selection. This bagging technique mitigates overfitting, handles non-linear interactions between burn rate and growth velocity, and delivers the highest stability and generalization accuracy on unseen test data.',
    hyperparameters: 'n_estimators=100, max_depth=8, criterion="gini", random_state=42'
  },
  {
    name: '3. Logistic Regression (with StandardScaler)',
    icon: Scale,
    color: '#7c3aed',
    bg: '#f5f3ff',
    summary: 'Probabilistic linear classification model using standardized feature scaling.',
    explanation: 'Logistic Regression estimates posterior class probabilities using the softmax / multinomial sigmoid function. Continuous features (such as large rupee figures for revenue vs single-digit percentages for growth) are normalized via StandardScaler (zero mean, unit variance) fitted strictly on the training partition to eliminate feature scale bias and data leakage.',
    hyperparameters: 'max_iter=1000, random_state=42, Preprocessing: StandardScaler'
  },
  {
    name: '4. Ensemble Majority Voting & Probability Tie-Breaking',
    icon: GitMerge,
    color: '#1d4ed8',
    bg: '#dbeafe',
    summary: 'Consensus engine uniting all three supervised classifiers.',
    explanation: 'The ensemble mechanism polls the independent predictions of the Decision Tree, Random Forest, and Logistic Regression models. If two or three models agree on a risk class, majority voting determines the final risk classification. If a three-way tie arises, the system calculates the average predicted class probabilities across all models and assigns the class with the highest combined confidence score.',
    hyperparameters: 'Method: Hard Voting with Soft Probability Average Tie-Breaking'
  }
];

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', marginBottom: '1rem', color: '#bfdbfe' }}>
            <Award size={16} />
            <span>AI/ML Engineering Architecture & Documentation</span>
          </div>
          <h1>Startup Health Diagnosis System</h1>
          <p>
            An intelligent dual-engine diagnostic platform combining a 5-pillar quantitative financial model 
            with three supervised Machine Learning classifiers and Ensemble voting.
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
            computes a standardized <strong>Startup Health Score (0–100)</strong>, runs dual-layer Machine Learning inference, 
            projects cash exhaustion curves, and delivers prioritized, actionable mitigation strategies.
          </p>
        </div>

        {/* System Architecture & Tech Stack */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Technology Stack & Full-Stack Architecture</h2>
          </div>

          <div className="grid-3">
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#2563eb', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={18} /> Frontend Framework
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>React 18:</strong> Functional Components & Reactive Hooks</li>
                <li>&bull; <strong>Vite:</strong> High-performance ES Module Bundler & HMR</li>
                <li>&bull; <strong>React Router v6:</strong> Declarative SPA client routing</li>
                <li>&bull; <strong>Vanilla CSS3:</strong> Curated token design system</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Brain size={18} /> Machine Learning Engine
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>scikit-learn:</strong> DT, Random Forest, Logistic Regression</li>
                <li>&bull; <strong>Ensemble Voting:</strong> Majority consensus algorithm</li>
                <li>&bull; <strong>Python / Flask:</strong> REST API service (Port 5001)</li>
                <li>&bull; <strong>Data Preprocessing:</strong> StandardScaler & Stratified Split</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#6366f1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={18} /> Analytics & Persistence
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>&bull; <strong>Recharts:</strong> Declarative SVG Area & Bar charting</li>
                <li>&bull; <strong>Browser LocalStorage:</strong> Zero-setup offline store</li>
                <li>&bull; <strong>Express.js Companion:</strong> REST API server (Port 5000)</li>
                <li>&bull; <strong>CSV Export:</strong> Audit backup & reporting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Machine Learning & AI Algorithms Section */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Machine Learning Algorithms & Ensemble Architecture</h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Three complementary supervised models combined via majority voting
                </span>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {ML_ALGORITHMS_INFO.map((algo, idx) => {
              const isOpen = openIndex === -1 || openIndex === idx;
              const IconComp = algo.icon;

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
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.98rem',
                      color: isOpen ? algo.color : '#0f172a'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '6px', 
                        background: algo.bg, 
                        color: algo.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={16} />
                      </span>
                      {algo.name}
                    </span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: 1.65, borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {algo.summary}
                      </p>
                      <p style={{ marginBottom: '0.75rem' }}>
                        {algo.explanation}
                      </p>
                      <div style={{ background: '#f1f5f9', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', color: '#334155', fontFamily: 'var(--font-mono)' }}>
                        <strong>Configuration:</strong> {algo.hyperparameters}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 8 Feature Inputs & Preprocessing Overview */}
        <div className="about-content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>Feature Engineering & Preprocessing Pipeline</h2>
          </div>

          <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            The supervised ML models analyze an 8-dimensional operational vector. Features are extracted dynamically 
            from user input and sanitized before inference:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              { name: 'runway', desc: 'Available cash divided by monthly net burn rate (months)' },
              { name: 'profit_margin', desc: '((Revenue - Expenses) / Revenue) * 100 percentage' },
              { name: 'burn_rate', desc: 'Net cash outflow per operating month' },
              { name: 'growth_rate', desc: 'Customer revenue growth percentage month-over-month' },
              { name: 'customer_growth', desc: 'Active user acquisition velocity percentage' },
              { name: 'monthly_expenses', desc: 'Total monthly operational expenditures' },
              { name: 'monthly_revenue', desc: 'Total monthly recurring revenue collections' },
              { name: 'employees', desc: 'Full-time equivalent employee headcount' }
            ].map(f => (
              <div key={f.name} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <code style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.82rem' }}>{f.name}</code>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.25rem 0 0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
