import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const RiskCard = ({ risk }) => {
  const { title, severity, category, explanation, solution } = risk;

  let badgeClass = 'badge-moderate';
  let Icon = AlertTriangle;

  if (severity === 'High') {
    badgeClass = 'badge-high';
    Icon = AlertCircle;
  } else if (severity === 'Low') {
    badgeClass = 'badge-healthy';
    Icon = ShieldCheck;
  }

  return (
    <div className={`risk-card severity-${severity}`}>
      <div className="risk-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Icon 
            size={20} 
            color={severity === 'High' ? '#ef4444' : severity === 'Medium' ? '#f59e0b' : '#10b981'} 
          />
          <h4>{title}</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {category && (
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
              {category}
            </span>
          )}
          <span className={`badge ${badgeClass}`}>
            {severity} Risk
          </span>
        </div>
      </div>

      <p className="risk-desc">{explanation}</p>

      {solution && (
        <div className="risk-solution-box">
          <strong>Recommended Mitigation:</strong>
          <span>{solution}</span>
        </div>
      )}
    </div>
  );
};

export default RiskCard;
