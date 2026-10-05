import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency } from '../utils/healthCalculator';

// Color Palette for charts
const COLORS = {
  healthy: '#10b981',
  moderate: '#f59e0b',
  high: '#ef4444',
  primary: '#2563eb',
  accent: '#6366f1',
  purple: '#8b5cf6',
  cyan: '#06b6d4'
};

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

// Custom Tooltip for Currency
const CurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        fontSize: '0.85rem'
      }}>
        <p style={{ fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: '#64748b' }}>{entry.name}:</span>
            <strong style={{ color: '#0f172a' }}>{formatCurrency(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Percentages / Scores
const StandardTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        fontSize: '0.85rem'
      }}>
        <p style={{ fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: '#64748b' }}>{entry.name}:</span>
            <strong style={{ color: '#0f172a' }}>{entry.value}{unit}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * 1. Revenue vs Expenses Chart (Grouped Bar Chart)
 */
export const RevenueExpensesChart = ({ data = [], height = 300 }) => {
  const chartData = data.map(item => ({
    name: item.startupName.length > 12 ? `${item.startupName.substring(0, 10)}...` : item.startupName,
    fullName: item.startupName,
    Revenue: Number(item.monthlyRevenue) || 0,
    Expenses: Number(item.monthlyExpenses) || 0
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
          <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Monthly Revenue" />
          <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Monthly Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 2. Startup Health Distribution (Donut Chart)
 */
export const HealthDistributionChart = ({ data = [], height = 300 }) => {
  let healthyCount = 0;
  let moderateCount = 0;
  let highRiskCount = 0;

  data.forEach(item => {
    if (item.healthScore >= 80) healthyCount++;
    else if (item.healthScore >= 60) moderateCount++;
    else highRiskCount++;
  });

  const chartData = [
    { name: 'Healthy (80-100)', value: healthyCount, color: '#10b981' },
    { name: 'Moderate Risk (60-79)', value: moderateCount, color: '#f59e0b' },
    { name: 'High Risk (0-59)', value: highRiskCount, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Fallback if empty
  const displayData = chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#cbd5e1' }];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<StandardTooltip unit=" Startups" />} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 3. Customer Growth & Retention Chart (Area / Line Chart)
 */
export const CustomerGrowthRetentionChart = ({ data = [], height = 300 }) => {
  const chartData = data.map(item => ({
    name: item.startupName.length > 12 ? `${item.startupName.substring(0, 10)}...` : item.startupName,
    fullName: item.startupName,
    GrowthRate: Number(item.customerGrowthRate) || 0,
    RetentionRate: Number(item.customerRetentionRate) || 0
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<StandardTooltip unit="%" />} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
          <Area 
            type="monotone" 
            dataKey="RetentionRate" 
            stroke="#10b981" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#retentionGrad)" 
            name="Retention Rate (%)"
          />
          <Area 
            type="monotone" 
            dataKey="GrowthRate" 
            stroke="#3b82f6" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#growthGrad)" 
            name="Monthly Growth Rate (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 4. Health Score Comparison Chart (Bar Chart with dynamic colors)
 */
export const HealthScoreChart = ({ data = [], height = 300 }) => {
  const chartData = data.map(item => ({
    name: item.startupName.length > 12 ? `${item.startupName.substring(0, 10)}...` : item.startupName,
    fullName: item.startupName,
    score: item.healthScore,
    color: item.healthScore >= 80 ? '#10b981' : item.healthScore >= 60 ? '#f59e0b' : '#ef4444'
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip content={<StandardTooltip unit="/100" />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Health Score">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 5. Risk Distribution Chart
 */
export const RiskDistributionChart = ({ data = [], height = 300 }) => {
  let highRisks = 0;
  let mediumRisks = 0;
  let lowRisks = 0;

  data.forEach(item => {
    if (item.risks && Array.isArray(item.risks)) {
      item.risks.forEach(r => {
        if (r.severity === 'High') highRisks++;
        else if (r.severity === 'Medium') mediumRisks++;
        else lowRisks++;
      });
    }
  });

  const chartData = [
    { category: 'High Severity Risks', count: highRisks, fill: '#ef4444' },
    { category: 'Medium Severity Risks', count: mediumRisks, fill: '#f59e0b' },
    { category: 'Low / Minor Notices', count: lowRisks, fill: '#10b981' }
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
          <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={12} width={130} tickLine={false} />
          <Tooltip content={<StandardTooltip unit=" Identified" />} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Risk Count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Single Startup Projection Chart (Used on Diagnosis Result Page)
 */
export const SingleStartupFinancialChart = ({ startup, height = 280 }) => {
  if (!startup) return null;
  const rev = Number(startup.monthlyRevenue) || 0;
  const exp = Number(startup.monthlyExpenses) || 0;
  const burn = Number(startup.monthlyBurnRate) || Math.max(0, exp - rev);
  const cash = Number(startup.availableCash) || 0;

  // 6-month projected cash flow
  const months = ['Current', 'Month +1', 'Month +2', 'Month +3', 'Month +4', 'Month +5', 'Month +6'];
  const projectionData = months.map((m, idx) => {
    const projectedCash = Math.max(0, cash - burn * idx);
    return {
      month: m,
      CashBalance: projectedCash,
      Revenue: rev,
      Burn: burn
    };
  });

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={projectionData} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="cashProjGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
          />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
          <Area 
            type="monotone" 
            dataKey="CashBalance" 
            stroke="#2563eb" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#cashProjGrad)" 
            name="Projected Cash Balance"
          />
          <Line 
            type="monotone" 
            dataKey="Revenue" 
            stroke="#10b981" 
            strokeWidth={2} 
            strokeDasharray="4 4" 
            dot={false}
            name="Monthly Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
