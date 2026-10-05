import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/healthCalculator';

const StartupCard = ({ startup }) => {
  const { id, startupName, industry, healthScore, status, riskLevel, metrics, monthlyRevenue, customerGrowthRate } = startup;

  let badgeClass = 'badge-healthy';
  let StatusIcon = ShieldCheck;
  let scoreColor = '#10b981';

  if (healthScore < 60) {
    badgeClass = 'badge-high';
    StatusIcon = AlertOctagon;
    scoreColor = '#ef4444';
  } else if (healthScore < 80) {
    badgeClass = 'badge-moderate';
    StatusIcon = AlertTriangle;
    scoreColor = '#f59e0b';
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.2rem', color: '#0f172a' }}>{startupName}</h4>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={14} />
              {industry}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: scoreColor }}>
              {healthScore}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '-4px' }}>/ 100</span>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span className={`badge ${badgeClass}`}>
            <StatusIcon size={14} />
            <span>{status}</span>
          </span>
        </div>

        {/* Quick Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>Runway</span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              {metrics?.cashRunway >= 36 ? '36+ mos' : `${metrics?.cashRunway || 0} mos`}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>Revenue</span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              {formatCurrency(monthlyRevenue)}/mo
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>Margin</span>
            <strong style={{ fontSize: '0.92rem', color: (metrics?.profitMargin || 0) >= 0 ? '#10b981' : '#ef4444' }}>
              {formatPercent(metrics?.profitMargin)}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>Growth</span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              +{customerGrowthRate}%
            </strong>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <Link 
        to={`/result/${id}`} 
        className="btn btn-secondary btn-sm" 
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <span>View Full Diagnosis</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};

export default StartupCard;
