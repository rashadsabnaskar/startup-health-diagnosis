import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Award, 
  PlusCircle, 
  RotateCcw, 
  TrendingUp, 
  Filter, 
  ArrowUpRight,
  Brain
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import StartupCard from '../components/StartupCard';
import AIPredictionCard from '../components/AIPredictionCard';
import MLPerformanceCard from '../components/MLPerformanceCard';
import { 
  RevenueExpensesChart, 
  HealthDistributionChart, 
  CustomerGrowthRetentionChart, 
  HealthScoreChart, 
  RiskDistributionChart 
} from '../components/Charts';
import { getStoredStartups, resetToSampleData } from '../utils/storage';
import { predictStartupWithML } from '../utils/mlService';

const Dashboard = () => {
  const [startups, setStartups] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [mlPredictionData, setMlPredictionData] = useState(null);

  const loadData = () => {
    const list = getStoredStartups();
    setStartups(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (startups.length > 0) {
      const activeId = selectedStartupId || startups[0].id;
      const targetStartup = startups.find(s => s.id === activeId) || startups[0];
      if (targetStartup.mlPrediction && targetStartup.mlPrediction.available) {
        setMlPredictionData(targetStartup.mlPrediction);
      } else {
        predictStartupWithML(targetStartup, targetStartup.metrics).then(res => {
          setMlPredictionData(res);
        });
      }
    }
  }, [startups, selectedStartupId]);

  const handleStartupSelectForML = (e) => {
    setSelectedStartupId(e.target.value);
  };

  const handleRetryDashboardML = async () => {
    if (startups.length > 0) {
      const activeId = selectedStartupId || startups[0].id;
      const targetStartup = startups.find(s => s.id === activeId) || startups[0];
      const res = await predictStartupWithML(targetStartup, targetStartup.metrics);
      setMlPredictionData(res);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset data back to the default 6 benchmark startups?')) {
      const resetList = resetToSampleData();
      setStartups(resetList);
    }
  };

  // Compute Aggregates
  const totalStartups = startups.length;
  const healthyCount = startups.filter(s => s.healthScore >= 80).length;
  const moderateCount = startups.filter(s => s.healthScore >= 60 && s.healthScore < 80).length;
  const highRiskCount = startups.filter(s => s.healthScore < 60).length;

  const averageHealthScore = totalStartups > 0
    ? Math.round(startups.reduce((acc, s) => acc + (s.healthScore || 0), 0) / totalStartups)
    : 0;

  // Filtered startups for charts and list
  const filteredStartups = selectedIndustry === 'All'
    ? startups
    : startups.filter(s => s.industry === selectedIndustry);

  const industries = ['All', ...new Set(startups.map(s => s.industry))];

  return (
    <div className="dashboard-wrapper">
      {/* Admin Sidebar */}
      <Sidebar totalStartups={totalStartups} onResetData={handleReset} />

      {/* Main Dashboard Workspace */}
      <main className="dashboard-main">
        {/* Header Bar */}
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              <span>Executive Intelligence Portal</span>
            </div>
            <h1>System Analytics Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Real-time portfolio overview of evaluated startups, risk classification, and solvency dynamics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Restore sample demo startups">
              <RotateCcw size={16} />
              <span>Reset Demo Startups</span>
            </button>
            <Link to="/diagnosis" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Diagnose New</span>
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Summary Cards (5 Metrics as requested) */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <MetricCard
            title="Total Startups"
            value={totalStartups}
            subtitle="Analyzed in system"
            icon={Building2}
            color="#2563eb"
            bgColor="#eff6ff"
          />

          <MetricCard
            title="Healthy Startups"
            value={healthyCount}
            subtitle={`${totalStartups > 0 ? Math.round((healthyCount / totalStartups) * 100) : 0}% of portfolio (80-100)`}
            icon={ShieldCheck}
            color="#10b981"
            bgColor="#ecfdf5"
            trend={`${healthyCount} Stable`}
            trendDirection="up"
          />

          <MetricCard
            title="Moderate Risk"
            value={moderateCount}
            subtitle="Monitoring required (60-79)"
            icon={AlertTriangle}
            color="#f59e0b"
            bgColor="#fffbeb"
            trend="Warning"
            trendDirection="neutral"
          />

          <MetricCard
            title="High Risk Startups"
            value={highRiskCount}
            subtitle="Immediate intervention (0-59)"
            icon={AlertOctagon}
            color="#ef4444"
            bgColor="#fef2f2"
            trend="Critical"
            trendDirection="down"
          />
        </div>

        {/* Secondary KPI Bar: Average Health Score Banner */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={26} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bfdbfe', fontWeight: '600' }}>
                Portfolio Benchmark
              </span>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.4rem' }}>
                Average Startup Health Score: <strong style={{ fontFamily: 'var(--font-mono)' }}>{averageHealthScore} / 100</strong>
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: '#bfdbfe', display: 'block' }}>Health Classification</span>
              <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                {averageHealthScore >= 80 ? 'Generally Resilient' : averageHealthScore >= 60 ? 'Cautious / Mixed' : 'Distressed Portfolio'}
              </strong>
            </div>
            <Link to="/history" className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a', border: 'none' }}>
              <span>View All Records</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* ================================================================
            AI / MACHINE LEARNING DECISION TREE DIAGNOSIS SECTION
            ================================================================ */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  AI / Machine Learning Classification
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Live inference powered by Decision Tree Classifier algorithm (scikit-learn)
                </span>
              </div>
            </div>

            {startups.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '600' }}>Select Startup:</span>
                <select
                  value={selectedStartupId || (startups[0] && startups[0].id)}
                  onChange={handleStartupSelectForML}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                    fontWeight: '600',
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  {startups.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.startupName} ({s.industry})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* AI / ML Prediction Card */}
          {(() => {
            const activeStartup = startups.find(s => s.id === (selectedStartupId || (startups[0] && startups[0].id))) || startups[0];
            return (
              <AIPredictionCard 
                predictionData={mlPredictionData} 
                onRetry={handleRetryDashboardML}
                deterministicScore={activeStartup?.healthScore}
                deterministicStatus={activeStartup?.status}
              />
            );
          })()}

          {/* ML Model Performance & Evaluation Metrics Card */}
          <MLPerformanceCard />
        </div>

        {/* Industry Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Filter Visualizations:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                fontWeight: '500'
              }}
            >
              {industries.map((ind, i) => (
                <option key={i} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Showing data for {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Charts Grid: All 5 charts required by prompt */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem', marginBottom: '2rem' }}>
          {/* Chart 1: Revenue vs Expenses */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>1. Revenue vs Operating Expenses</h3>
                <span className="chart-subtitle">Monthly comparison of gross revenue versus total cash spend</span>
              </div>
            </div>
            <RevenueExpensesChart data={filteredStartups} height={280} />
          </div>

          {/* Chart 2: Startup Health Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>2. Health Score Distribution</h3>
                <span className="chart-subtitle">Breakdown across Healthy, Moderate, and High Risk segments</span>
              </div>
            </div>
            <HealthDistributionChart data={filteredStartups} height={280} />
          </div>

          {/* Chart 3: Customer Growth vs Retention */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>3. Customer Growth & Retention Trajectory</h3>
                <span className="chart-subtitle">MoM acquisition velocity vs cohort retention rate</span>
              </div>
            </div>
            <CustomerGrowthRetentionChart data={filteredStartups} height={280} />
          </div>

          {/* Chart 4: Health Score by Startup */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>4. Health Score Comparison (0–100)</h3>
                <span className="chart-subtitle">Direct comparison with color-coded risk bands</span>
              </div>
            </div>
            <HealthScoreChart data={filteredStartups} height={280} />
          </div>
        </div>

        {/* Chart 5: Risk Distribution */}
        <div className="chart-card" style={{ marginBottom: '2.5rem' }}>
          <div className="chart-header">
            <div>
              <h3>5. Identified Risk Factor Distribution</h3>
              <span className="chart-subtitle">Frequency of High, Medium, and Low severity vulnerabilities identified by diagnosis algorithms</span>
            </div>
          </div>
          <RiskDistributionChart data={filteredStartups} height={220} />
        </div>

        {/* Startup Portfolio Cards Grid */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Startup Diagnoses</h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Click any card to inspect full score pillars, risks, and recommendations</span>
          </div>
          <Link to="/history" className="btn btn-outline btn-sm">
            View History Table
          </Link>
        </div>

        <div className="grid-3">
          {filteredStartups.slice(0, 6).map((item) => (
            <StartupCard key={item.id} startup={item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
