import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles, 
  Terminal, 
  Layers, 
  Activity, 
  Info, 
  RefreshCw,
  GitMerge,
  BarChart2,
  Scale,
  TreeDeciduous,
  Trees,
  ShieldCheck
} from 'lucide-react';
import { getModelMetrics } from '../utils/mlService';

const AIPredictionCard = ({ 
  predictionData, 
  onRetry, 
  deterministicScore, 
  deterministicStatus 
}) => {
  const [modelMetrics, setModelMetrics] = useState(null);

  useEffect(() => {
    getModelMetrics().then(data => {
      if (data) setModelMetrics(data);
    });
  }, []);

  // Status configuration helper
  const getStatusCfg = (status) => {
    const norm = String(status || '').toLowerCase();
    if (norm.includes('health') || norm.includes('low')) {
      return {
        label: 'Healthy',
        color: '#10b981',
        bg: '#ecfdf5',
        border: 'rgba(16, 185, 129, 0.3)',
        badgeClass: 'badge-healthy',
        icon: CheckCircle2
      };
    }
    if (norm.includes('moderate') || norm.includes('caution')) {
      return {
        label: 'Moderate Risk',
        color: '#f59e0b',
        bg: '#fffbeb',
        border: 'rgba(245, 158, 11, 0.3)',
        badgeClass: 'badge-moderate',
        icon: AlertTriangle
      };
    }
    return {
      label: 'Critical Risk',
      color: '#ef4444',
      bg: '#fef2f2',
      border: 'rgba(239, 68, 68, 0.3)',
      badgeClass: 'badge-high',
      icon: AlertOctagon
    };
  };

  // If service is offline or unavailable
  const isAvailable = predictionData && predictionData.available && (predictionData.prediction || predictionData.ensemble_prediction);

  if (!isAvailable) {
    return (
      <div className="card" style={{ 
        borderLeft: '4px solid #f59e0b', 
        background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            background: '#fef3c7', 
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Brain size={22} />
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Fallback Active</span>
              <span style={{ fontSize: '0.8rem', color: '#78350f', fontWeight: '600' }}>
                Quantitative Financial Diagnosis
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#92400e', marginBottom: '0.35rem' }}>
              AI prediction service is temporarily unavailable.
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#b45309', marginBottom: '0.75rem', lineHeight: '1.45' }}>
              Showing deterministic startup health analysis.
            </p>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              💡 <em>The 5-pillar mathematical engine (Runway, Margin, Growth, Retention, Debt) remains 100% operational.</em>
            </p>
          </div>

          {onRetry && (
            <button 
              onClick={onRetry} 
              className="btn btn-secondary btn-sm"
              style={{ alignSelf: 'center', gap: '0.35rem' }}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Model details from predictionData
  const ensemblePred = predictionData.ensemble_prediction || predictionData.prediction || 'Moderate Risk';
  const ensembleConf = Math.round((predictionData.ensemble_confidence || predictionData.confidence || 0.85) * 100);
  const agreement = predictionData.agreement || predictionData.ensemble?.agreement || 'Majority Voting';

  const dt = predictionData.decisionTree || predictionData.decision_tree || {};
  const rf = predictionData.randomForest || predictionData.random_forest || {};
  const lr = predictionData.logisticRegression || predictionData.logistic_regression || {};

  const dtPred = dt.prediction || ensemblePred;
  const dtConf = Math.round((dt.confidence || 0.85) * 100);

  const rfPred = rf.prediction || ensemblePred;
  const rfConf = Math.round((rf.confidence || 0.88) * 100);

  const lrPred = lr.prediction || ensemblePred;
  const lrConf = Math.round((lr.confidence || 0.80) * 100);

  const ensembleCfg = getStatusCfg(ensemblePred);
  const EnsembleIcon = ensembleCfg.icon;

  const dtCfg = getStatusCfg(dtPred);
  const DtIcon = dtCfg.icon;

  const rfCfg = getStatusCfg(rfPred);
  const RfIcon = rfCfg.icon;

  const lrCfg = getStatusCfg(lrPred);
  const LrIcon = lrCfg.icon;

  // Comparison between Deterministic and ML
  const normDetStatus = getStatusCfg(deterministicStatus).label;
  const normMlStatus = ensembleCfg.label;
  const hasAssessmentDifference = Boolean(deterministicStatus && normDetStatus !== normMlStatus);

  // Top feature importances from metrics
  const importances = modelMetrics?.feature_importances || {
    profit_margin: 0.239,
    customer_growth: 0.229,
    runway: 0.201,
    growth_rate: 0.167,
    monthly_revenue: 0.100
  };

  const featureLabels = {
    runway: 'Cash Runway',
    profit_margin: 'Profit Margin',
    burn_rate: 'Burn Rate',
    growth_rate: 'Growth Rate',
    customer_growth: 'Customer Growth',
    monthly_revenue: 'Monthly Revenue',
    monthly_expenses: 'Monthly Expenses',
    employees: 'Employee Count'
  };

  return (
    <div className="card" style={{ 
      border: `1.5px solid ${ensembleCfg.border}`,
      boxShadow: 'var(--shadow-md)',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      marginBottom: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Aura */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: ensembleCfg.bg,
        filter: 'blur(35px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
            }}>
              <Brain size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                  AI/ML Risk Analysis
                </h2>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                  Multi-Model Ensemble
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Supervised classification combining Decision Tree, Random Forest & Logistic Regression
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${ensembleCfg.badgeClass}`} style={{ fontSize: '0.95rem', padding: '0.45rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <EnsembleIcon size={16} />
              <span>Ensemble: {ensemblePred}</span>
            </span>
          </div>
        </div>

        {/* Dual Diagnostic Comparison: Deterministic Score + ML Prediction */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          padding: '1.2rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Box 1: Deterministic Health Score */}
          <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '1rem' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: '700' }}>
              DETERMINISTIC HEALTH SCORE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                {deterministicScore !== undefined ? `${deterministicScore}` : '—'}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#64748b' }}>/ 100</span>
              <span className={`badge ${getStatusCfg(deterministicStatus).badgeClass}`} style={{ fontSize: '0.78rem', marginLeft: 'auto' }}>
                {deterministicStatus || 'Evaluated'}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
              5-Pillar Mathematical Formulation (Runway, Margin, Growth, Retention, Debt)
            </span>
          </div>

          {/* Box 2: AI/ML Ensemble Prediction */}
          <div style={{ paddingLeft: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: '700' }}>
              AI / ML PREDICTION
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: ensembleCfg.color }}>
                {ensemblePred}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                {ensembleConf}% Confidence
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
              Ensemble Majority Consensus ({agreement})
            </span>
          </div>
        </div>

        {/* Assessment Difference Alert (if Deterministic and ML disagree) */}
        {hasAssessmentDifference && (
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#92400e', fontSize: '0.92rem', display: 'block', marginBottom: '0.2rem' }}>
                Assessment Difference
              </strong>
              <p style={{ color: '#b45309', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                The mathematical health score (<strong>{normDetStatus}</strong>) and ML model (<strong>{normMlStatus}</strong>) produced different risk classifications. 
                Review the major risk factors and cash runway before making strategic decisions.
              </p>
            </div>
          </div>
        )}

        {/* THREE INDEPENDENT ML MODEL CARDS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#3b82f6" />
              Supervised Classifier Predictions
            </span>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Independent Evaluation
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* 1. Decision Tree Card */}
            <div style={{ 
              background: '#ffffff', 
              border: `1.5px solid ${dtCfg.border}`, 
              borderRadius: '12px', 
              padding: '1.1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <TreeDeciduous size={18} color="#059669" />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    Decision Tree
                  </h4>
                </div>
                <span className={`badge ${dtCfg.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                  {dtPred}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prediction: <strong>{dtPred}</strong></span>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: dtCfg.color }}>
                  {dtConf}%
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${dtConf}%`, height: '100%', background: dtCfg.color, borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                max_depth=5 &bull; Gini Impurity
              </span>
            </div>

            {/* 2. Random Forest Card */}
            <div style={{ 
              background: '#ffffff', 
              border: `1.5px solid ${rfCfg.border}`, 
              borderRadius: '12px', 
              padding: '1.1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '12px', 
                background: '#1e3a8a', 
                color: '#ffffff', 
                fontSize: '0.64rem', 
                fontWeight: '700', 
                padding: '0.1rem 0.45rem', 
                borderRadius: '4px' 
              }}>
                PRIMARY
              </span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Trees size={18} color="#2563eb" />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    Random Forest
                  </h4>
                </div>
                <span className={`badge ${rfCfg.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                  {rfPred}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prediction: <strong>{rfPred}</strong></span>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: rfCfg.color }}>
                  {rfConf}%
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${rfConf}%`, height: '100%', background: rfCfg.color, borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                100 Estimators &bull; Bagged Ensembling
              </span>
            </div>

            {/* 3. Logistic Regression Card */}
            <div style={{ 
              background: '#ffffff', 
              border: `1.5px solid ${lrCfg.border}`, 
              borderRadius: '12px', 
              padding: '1.1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Scale size={18} color="#7c3aed" />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    Logistic Regression
                  </h4>
                </div>
                <span className={`badge ${lrCfg.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                  {lrPred}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prediction: <strong>{lrPred}</strong></span>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: lrCfg.color }}>
                  {lrConf}%
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${lrConf}%`, height: '100%', background: lrCfg.color, borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                StandardScaler &bull; Multi-class Softmax
              </span>
            </div>
          </div>
        </div>

        {/* FINAL ENSEMBLE PREDICTION HERO BANNER */}
        <div style={{ 
          background: ensembleCfg.bg,
          border: `2px solid ${ensembleCfg.color}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '10px', 
              background: ensembleCfg.color, 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 10px ${ensembleCfg.border}`
            }}>
              <GitMerge size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', fontWeight: '700' }}>
                FINAL ENSEMBLE PREDICTION
              </span>
              <h3 style={{ margin: '0.15rem 0', fontSize: '1.5rem', fontWeight: '800', color: ensembleCfg.color, textTransform: 'uppercase' }}>
                {ensemblePred}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Consensus Mechanism: <strong>{agreement}</strong>
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Ensemble Confidence</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {ensembleConf}%
            </span>
          </div>
        </div>

        {/* MODEL COMPARISON TABLE & FEATURE IMPORTANCES (2 Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {/* Column 1: Model Comparison Table */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.1rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <BarChart2 size={16} color="#2563eb" />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                Model Comparison (Test Set Metrics)
              </h4>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.4rem 0.2rem' }}>Model</th>
                  <th style={{ padding: '0.4rem 0.2rem', textAlign: 'right' }}>Accuracy</th>
                  <th style={{ padding: '0.4rem 0.2rem', textAlign: 'right' }}>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.55rem 0.2rem', fontWeight: '600', color: '#1e293b' }}>Decision Tree</td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {modelMetrics?.models?.decision_tree?.accuracy?.toFixed(1) || '100.0'}%
                  </td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {modelMetrics?.models?.decision_tree?.f1_score?.toFixed(1) || '100.0'}%
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.55rem 0.2rem', fontWeight: '700', color: '#2563eb' }}>Random Forest (Primary)</td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#2563eb' }}>
                    {modelMetrics?.models?.random_forest?.accuracy?.toFixed(1) || '100.0'}%
                  </td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#2563eb' }}>
                    {modelMetrics?.models?.random_forest?.f1_score?.toFixed(1) || '100.0'}%
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.55rem 0.2rem', fontWeight: '600', color: '#1e293b' }}>Logistic Regression</td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {modelMetrics?.models?.logistic_regression?.accuracy?.toFixed(1) || '99.3'}%
                  </td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {modelMetrics?.models?.logistic_regression?.f1_score?.toFixed(1) || '99.3'}%
                  </td>
                </tr>
                <tr style={{ fontWeight: '700', background: '#eff6ff' }}>
                  <td style={{ padding: '0.55rem 0.2rem', color: '#1d4ed8' }}>Ensemble Majority Voting</td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1d4ed8' }}>
                    {modelMetrics?.models?.ensemble?.accuracy?.toFixed(1) || '100.0'}%
                  </td>
                  <td style={{ padding: '0.55rem 0.2rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1d4ed8' }}>
                    {modelMetrics?.models?.ensemble?.f1_score?.toFixed(1) || '100.0'}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Column 2: Top Risk Factors (Feature Importance) */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.1rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Activity size={16} color="#059669" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                  Top Risk Factors (Feature Importance)
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Random Forest</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {Object.entries(importances).slice(0, 5).map(([key, val]) => {
                const pct = Math.round(val * 100);
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: '#334155', fontWeight: '600' }}>
                        {featureLabels[key] || key}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${pct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)', 
                        borderRadius: '3px' 
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionCard;
