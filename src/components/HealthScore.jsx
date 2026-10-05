import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

const HealthScore = ({ score = 0, status = 'Healthy Startup', riskLevel = 'Low Risk', breakdown, size = 190 }) => {
  // SVG circular calculation
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  let badgeClass = 'badge-healthy';
  let StatusIcon = ShieldCheck;

  if (score < 60) {
    strokeColor = '#ef4444'; // Red
    badgeClass = 'badge-high';
    StatusIcon = AlertOctagon;
  } else if (score < 80) {
    strokeColor = '#f59e0b'; // Amber
    badgeClass = 'badge-moderate';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="health-score-card">
      <div style={{ marginBottom: '1rem', width: '100%' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
          Overall Diagnostic Score
        </span>
      </div>

      <div className="score-circle-wrapper" style={{ width: size, height: size }}>
        <svg className="score-svg" width={size} height={size}>
          <circle
            className="score-bg-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="score-progress-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="score-number-center">
          <span className="score-big-digit" style={{ color: strokeColor }}>
            {score}
          </span>
          <span className="score-scale-denom">/ 100</span>
        </div>
      </div>

      {/* Status Badge */}
      <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.95rem', padding: '0.45rem 1rem' }}>
          <StatusIcon size={18} />
          <span>{status}</span>
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '280px' }}>
        Assessed classification: <strong style={{ color: strokeColor }}>{riskLevel}</strong>
      </p>

      {/* Diagnostic Sub-pillar breakdown meters */}
      {breakdown && (
        <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '0.85rem', textAlign: 'left' }}>
            Score Pillar Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569' }}>Profitability & Margin</span>
                <strong>{breakdown.profitability}%</strong>
              </div>
              <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${breakdown.profitability}%`, background: strokeColor, height: '100%', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569' }}>Runway & Burn Safety</span>
                <strong>{breakdown.runwaySafety}%</strong>
              </div>
              <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${breakdown.runwaySafety}%`, background: strokeColor, height: '100%', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569' }}>Growth Velocity</span>
                <strong>{breakdown.growthTraction}%</strong>
              </div>
              <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${breakdown.growthTraction}%`, background: strokeColor, height: '100%', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569' }}>Retention & Churn Shield</span>
                <strong>{breakdown.retentionQuality}%</strong>
              </div>
              <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${breakdown.retentionQuality}%`, background: strokeColor, height: '100%', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569' }}>Debt & Solvency Health</span>
                <strong>{breakdown.debtSolvency}%</strong>
              </div>
              <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${breakdown.debtSolvency}%`, background: strokeColor, height: '100%', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthScore;
