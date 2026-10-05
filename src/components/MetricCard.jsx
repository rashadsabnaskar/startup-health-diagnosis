import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = '#3b82f6', 
  bgColor = '#eff6ff', 
  trend,
  trendDirection = 'neutral' // 'up' | 'down' | 'neutral'
}) => {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-card-title">{title}</span>
        {Icon && (
          <div className="metric-card-icon" style={{ backgroundColor: bgColor, color: color }}>
            <Icon size={20} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div className="metric-card-value">{value}</div>

      {subtitle && (
        <div className="metric-card-footer">
          {trend && (
            <span 
              style={{ 
                fontWeight: '700', 
                color: trendDirection === 'up' ? '#10b981' : trendDirection === 'down' ? '#ef4444' : '#64748b' 
              }}
            >
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
