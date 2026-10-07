import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles,
  Zap,
  PieChart,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';
import { getStoredStartups } from '../utils/storage';

const Home = () => {
  const startups = getStoredStartups();
  const totalAnalyzed = startups.length;

  return (
    <div className="home-page">
      {/* ==================================================================
          HERO SECTION
          ================================================================== */}
      <section className="hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={16} color="#3b82f6" />
            <span>Next-Generation Startup Analytics Engine</span>
          </div>

          <h1 className="hero-title animate-fade-in">
            Startup Health <span className="text-gradient">Diagnosis System</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">
            Empowering founders, angel investors, and incubators with real-time financial solvency diagnostics, 
            cash runway forecasting, risk identification, and data-backed strategic recommendations.
          </p>

          <div className="hero-actions animate-fade-in">
            <Link to="/diagnosis" className="btn btn-primary btn-lg">
              <Zap size={18} />
              <span>Start Diagnosis</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              <BarChart3 size={18} />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="stats-banner animate-fade-in">
            <div className="stats-banner-item">
              <h3>{totalAnalyzed}+</h3>
              <p>Startups Evaluated</p>
            </div>
            <div className="stats-banner-item">
              <h3>0–100</h3>
              <p>Dynamic Health Score</p>
            </div>
            <div className="stats-banner-item">
              <h3>5 Pillars</h3>
              <p>Financial Modeling</p>
            </div>
            <div className="stats-banner-item">
              <h3>Instant</h3>
              <p>Risk & Mitigation Engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          FEATURES SECTION
          ================================================================== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Powerful Capabilities</span>
            <h2 className="section-title">Everything You Need to Gauge Startup Health</h2>
            <p>
              Traditional financial statements are static. Our diagnostic framework dynamically analyzes unit economics, 
              burn rate sustainability, and retention trends.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                <Activity size={26} />
              </div>
              <h3>Automated Health Score</h3>
              <p>
                Calculates a weighted 0–100 startup health score synthesized across 5 critical dimensions: profit margins, runway safety, growth velocity, retention, and solvency.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <TrendingUp size={26} />
              </div>
              <h3>Cash Runway & Burn Modeling</h3>
              <p>
                Accurately estimates true survival runway in months, tracking net burn against current cash reserves to prevent capital depletion surprises.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                <AlertTriangle size={26} />
              </div>
              <h3>Intelligent Risk Identification</h3>
              <p>
                Flags critical vulnerabilities such as leaky-bucket churn, dangerous debt obligations, stagnant acquisition, and runaway operating expenditure.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <Lightbulb size={26} />
              </div>
              <h3>Strategic Action Playbooks</h3>
              <p>
                Generates personalized, prioritized recommendations categorized by urgency (30-day tactical fixes vs 90-day scaling roadmap).
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                <PieChart size={26} />
              </div>
              <h3>Interactive Visual Analytics</h3>
              <p>
                Explore interactive Recharts visualizations: Revenue vs Expenses comparison, Health distribution pie charts, and growth-retention trajectories.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                <Database size={26} />
              </div>
              <h3>Historical Records & Benchmarks</h3>
              <p>
                Persists diagnosis reports using browser local storage with search, risk-level filtering, and instant export capabilities for investor reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          HOW IT WORKS SECTION
          ================================================================== */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Diagnostic Workflow</span>
            <h2 className="section-title">How The System Works</h2>
            <p>From raw operational metrics to a comprehensive health diagnosis in four streamlined steps.</p>
          </div>

          <div className="grid-4">
            <div className="step-card">
              <div className="step-badge">1</div>
              <h4>Input Business Data</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
                Enter foundational financials: monthly revenue, operating burn, available cash reserves, debt, and user retention.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">2</div>
              <h4>Algorithmic Processing</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
                Mathematical engine computes financial ratios, profit margins, cash runway, and assigns multi-pillar weighted scores.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">3</div>
              <h4>Risk Classification</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
                Classifies startup into Healthy (80–100), Moderate Risk (60–79), or High Risk (0–59) with categorized severity tags.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">4</div>
              <h4>Action Roadmap</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
                Review interactive score circles, cash flow projections, identified pitfalls, and tailored strategic checklists.
              </p>
            </div>
          </div>

          {/* Call to action card */}
          <div className="cta-banner">
            <h2>Ready to Diagnose Your Startup?</h2>
            <p>
              Test our diagnostic engine with your own metrics or try out our pre-loaded benchmarks with one click.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/diagnosis" className="btn btn-primary btn-lg" style={{ background: '#ffffff', color: '#1e3a8a' }}>
                <span>Run Diagnostic Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/history" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <span>Browse History Table</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          FOOTER SECTION
          ================================================================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Activity size={18} />
                </div>
                <h4 style={{ margin: 0 }}>StartupHealth</h4>
              </div>
              <p>
                An engineering college mini-project built with React.js, Vite, and Recharts demonstrating financial intelligence algorithms, risk triage, and modern SaaS UX.
              </p>
            </div>

            <div className="footer-col">
              <h5>Navigation</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/diagnosis">Run Diagnosis</Link></li>
                <li><Link to="/dashboard">Analytics Dashboard</Link></li>
                <li><Link to="/history">Diagnosis History</Link></li>
                <li><Link to="/about">About Project</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Core Metrics</h5>
              <ul className="footer-links">
                <li><a href="#!">Health Score (0–100)</a></li>
                <li><a href="#!">Cash Runway Analysis</a></li>
                <li><a href="#!">Operating Profit Margin</a></li>
                <li><a href="#!">Retention & Growth Ratio</a></li>
                <li><a href="#!">Solvency & Debt Exposure</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Project Info</h5>
              <ul className="footer-links">
                <li><span style={{ color: '#ffffff', fontWeight: '600' }}>Tech:</span> React 18 + Vite</li>
                <li><span style={{ color: '#ffffff', fontWeight: '600' }}>Charts:</span> Recharts</li>
                <li><span style={{ color: '#ffffff', fontWeight: '600' }}>Icons:</span> Lucide React</li>
                <li><span style={{ color: '#ffffff', fontWeight: '600' }}>Storage:</span> LocalStorage</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} Startup Health Diagnosis System. Designed for Academic Evaluation & Demonstration.
            </div>
            <div>
              React Functional Components &bull; Custom Hooks &bull; Dynamic Risk Algorithms
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
