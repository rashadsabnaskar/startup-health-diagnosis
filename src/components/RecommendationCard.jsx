import React from 'react';
import { Lightbulb, CheckSquare, Clock, Zap } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const { title, category, impact, timeframe, description, actionSteps } = recommendation;

  return (
    <div className="rec-card">
      <div className="rec-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lightbulb size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{title}</h4>
            {category && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                {category}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {timeframe && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem',
              color: '#475569',
              background: '#f1f5f9',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              <Clock size={13} />
              {timeframe}
            </span>
          )}

          <span className={`badge ${impact === 'High' ? 'badge-healthy' : 'badge-neutral'}`} style={{ fontSize: '0.75rem' }}>
            <Zap size={13} />
            {impact} Priority
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.85rem 0' }}>
        {description}
      </p>

      {actionSteps && actionSteps.length > 0 && (
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckSquare size={14} /> Action Checklist
          </span>
          <ul className="rec-steps-list">
            {actionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
