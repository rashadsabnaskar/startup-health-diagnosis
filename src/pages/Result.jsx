import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Calendar, 
  Building2, 
  Users, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import HealthScore from '../components/HealthScore';
import MetricCard from '../components/MetricCard';
import RiskCard from '../components/RiskCard';
import RecommendationCard from '../components/RecommendationCard';
import AIPredictionCard from '../components/AIPredictionCard';
import { SingleStartupFinancialChart } from '../components/Charts';
import { getStartupById, getStoredStartups } from '../utils/storage';
import { formatCurrency, formatPercent } from '../utils/healthCalculator';
import { predictStartupWithML } from '../utils/mlService';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [copied, setCopied] = useState(false);
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    if (id) {
      const found = getStartupById(id);
      if (found) {
        setStartup(found);
        return;
      }
    }

    // If no ID or not found, fallback to the latest stored startup
    const all = getStoredStartups();
    if (all && all.length > 0) {
      setStartup(all[0]);
    } else {
      navigate('/diagnosis');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (startup) {
      if (startup.mlPrediction && startup.mlPrediction.available) {
        setMlData(startup.mlPrediction);
      } else {
        predictStartupWithML(startup, startup.metrics).then(res => {
          setMlData(res);
        });
      }
    }
  }, [startup]);

  const handleRetryML = async () => {
    if (startup) {
      const res = await predictStartupWithML(startup, startup.metrics);
      setMlData(res);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!startup) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading diagnosis results...</p>
      </div>
    );
  }

  const {
    startupName,
    industry,
    yearsInOperation,
    numberOfEmployees,
    healthScore,
    status,
    riskLevel,
    metrics,
    monthlyRevenue,
    monthlyExpenses,
    availableCash,
    monthlyBurnRate,
    customerGrowthRate,
    customerRetentionRate,
    risks = [],
    recommendations = [],
    breakdown,
    createdAt
  } = startup;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="result-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Top Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
          <Link to="/history" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back to History</span>
          </Link>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleShare} className="btn btn-secondary btn-sm" title="Copy shareable link">
              <Share2 size={16} />
              <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
            </button>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print or save as PDF">
              <Printer size={16} />
              <span>Print / Export PDF</span>
            </button>
            <Link to="/diagnosis" className="btn btn-primary btn-sm">
              <RotateCcw size={16} />
              <span>Run New Diagnosis</span>
            </Link>
          </div>
        </div>

        {/* Startup Report Header Banner */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-neutral" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Diagnostic Report
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  Evaluated on {formattedDate}
                </span>
              </div>

              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.4rem', color: '#0f172a' }}>
                {startupName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={16} /> {industry}
                </span>
                <span>&bull;</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={16} /> {yearsInOperation} Years in Operation
                </span>
                <span>&bull;</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users size={16} /> {numberOfEmployees} Employees
                </span>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${healthScore >= 80 ? 'badge-healthy' : healthScore >= 60 ? 'badge-moderate' : 'badge-high'}`} style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
                {status}
              </span>
              <span style={{ display: 'block', fontSize: '0.82rem', color: '#64748b', marginTop: '0.4rem' }}>
                Risk Classification: <strong>{riskLevel}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* AI/ML Multi-Model Risk Analysis & Ensemble Prediction */}
        <AIPredictionCard 
          predictionData={mlData} 
          onRetry={handleRetryML} 
          deterministicScore={healthScore}
          deterministicStatus={status}
        />

        {/* Main Diagnostic Body: 2 Columns (Health Score Gauge & Key Metrics Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {/* Column 1: Health Score Circular Indicator */}
          <div>
            <HealthScore 
              score={healthScore}
              status={status}
              riskLevel={riskLevel}
              breakdown={breakdown}
              size={190}
            />
          </div>

          {/* Column 2: Key Financial & Operating Metrics */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Executive Diagnostic Metrics</h3>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Benchmark & Solvency Indicators</span>
            </div>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <MetricCard
                title="Profit Margin"
                value={formatPercent(metrics?.profitMargin)}
                subtitle={metrics?.profitMargin >= 0 ? 'Operating cash positive' : 'Consuming capital'}
                icon={DollarSign}
                color={metrics?.profitMargin >= 0 ? '#10b981' : '#ef4444'}
                bgColor={metrics?.profitMargin >= 0 ? '#ecfdf5' : '#fef2f2'}
                trend={metrics?.profitMargin >= 0 ? '+Healthy' : '-Burn'}
                trendDirection={metrics?.profitMargin >= 0 ? 'up' : 'down'}
              />

              <MetricCard
                title="Cash Runway"
                value={metrics?.cashRunway >= 36 ? '36+ Months' : `${metrics?.cashRunway} Mos`}
                subtitle={metrics?.cashRunway >= 12 ? 'Safe operational cushion' : 'Urgent capital required'}
                icon={Clock}
                color={metrics?.cashRunway >= 12 ? '#10b981' : metrics?.cashRunway >= 6 ? '#f59e0b' : '#ef4444'}
                bgColor={metrics?.cashRunway >= 12 ? '#ecfdf5' : metrics?.cashRunway >= 6 ? '#fffbeb' : '#fef2f2'}
                trend={metrics?.cashRunway >= 12 ? 'Safe' : 'Critical'}
                trendDirection={metrics?.cashRunway >= 12 ? 'up' : 'down'}
              />

              <MetricCard
                title="Monthly Burn Rate"
                value={formatCurrency(monthlyBurnRate)}
                subtitle="Net monthly capital outflow"
                icon={TrendingUp}
                color="#6366f1"
                bgColor="#eef2ff"
              />

              <MetricCard
                title="Customer Growth"
                value={`+${customerGrowthRate}%`}
                subtitle="Month-over-month user velocity"
                icon={TrendingUp}
                color="#2563eb"
                bgColor="#eff6ff"
                trend={customerGrowthRate >= 10 ? 'Strong' : 'Sub-par'}
                trendDirection={customerGrowthRate >= 10 ? 'up' : 'neutral'}
              />

              <MetricCard
                title="Retention Rate"
                value={`${customerRetentionRate}%`}
                subtitle="Cohort stickiness score"
                icon={ShieldCheck}
                color={customerRetentionRate >= 80 ? '#10b981' : '#f59e0b'}
                bgColor={customerRetentionRate >= 80 ? '#ecfdf5' : '#fffbeb'}
              />

              <MetricCard
                title="Debt-to-Capital"
                value={`${metrics?.debtRatio}%`}
                subtitle="Liabilities vs liquid capital"
                icon={AlertTriangle}
                color={metrics?.debtRatio > 40 ? '#ef4444' : '#10b981'}
                bgColor={metrics?.debtRatio > 40 ? '#fef2f2' : '#ecfdf5'}
              />
            </div>

            {/* Runway Forecast Chart */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>6-Month Cash Balance Projection</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated capital exhaustion curve based on current monthly burn</span>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Forecasting Model</span>
              </div>
              <SingleStartupFinancialChart startup={startup} height={220} />
            </div>
          </div>
        </div>

        {/* Section 6 & 7: Identified Risks and Personalized Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem', marginBottom: '3rem' }}>
          {/* Left: Identified Vulnerabilities */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertOctagon size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>Identified Vulnerabilities & Risks</h3>
              </div>
              <span className="badge badge-neutral">{risks.length} Detected</span>
            </div>

            {risks.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h4>No Critical Risks Detected</h4>
                <p style={{ fontSize: '0.88rem' }}>The startup is currently operating with healthy margins and adequate runway.</p>
              </div>
            ) : (
              risks.map((risk, index) => (
                <RiskCard key={risk.id || index} risk={risk} />
              ))
            )}
          </div>

          {/* Right: Personalized Recommendations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>Tailored Strategic Action Plan</h3>
              </div>
              <span className="badge badge-neutral">{recommendations.length} Actions</span>
            </div>

            {recommendations.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h4>Maintain Current Trajectory</h4>
                <p style={{ fontSize: '0.88rem' }}>Continue monitoring monthly metrics and unit economics.</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <RecommendationCard key={rec.id || index} recommendation={rec} />
              ))
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="card no-print" style={{ background: '#f8fafc', textAlign: 'center', padding: '2rem' }}>
          <h4>Want to analyze another startup or compare benchmarks?</h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.5rem 0 1.25rem' }}>
            Check out aggregate metrics across all startups in the administrative dashboard.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/dashboard" className="btn btn-primary">
              View Analytics Dashboard
            </Link>
            <Link to="/diagnosis" className="btn btn-secondary">
              Diagnose Another Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
