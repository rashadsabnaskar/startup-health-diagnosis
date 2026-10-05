/**
 * Startup Health Diagnosis System - Calculation Engine
 * Pure business logic and mathematical modeling for startup financial health,
 * runway projection, risk identification, and strategic recommendations.
 */

// Helper to format currency in Indian Rupees (₹) or standard notation
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
};

/**
 * Profit Margin = ((Revenue - Expenses) / Revenue) * 100
 */
export const calculateProfitMargin = (revenue, expenses) => {
  const rev = Number(revenue) || 0;
  const exp = Number(expenses) || 0;
  if (rev <= 0) {
    return exp > 0 ? -100 : 0;
  }
  return ((rev - exp) / rev) * 100;
};

/**
 * Cash Runway = Available Cash / Monthly Burn Rate (in months)
 * If Burn Rate <= 0 (profitable or breakeven), runway is effectively safe (represented as 999 or 36+)
 */
export const calculateCashRunway = (cash, burnRate, monthlyRevenue = 0, monthlyExpenses = 0) => {
  const availableCash = Number(cash) || 0;
  let netBurn = Number(burnRate) || 0;

  // If burnRate is 0 or negative, check revenue vs expenses
  if (netBurn <= 0 && monthlyExpenses > monthlyRevenue) {
    netBurn = monthlyExpenses - monthlyRevenue;
  }

  if (netBurn <= 0) {
    return 36; // Profitable / Cash-flow positive buffer
  }

  const runwayMonths = availableCash / netBurn;
  return Number(Math.max(0, runwayMonths).toFixed(1));
};

/**
 * Revenue-to-Expense Ratio = Monthly Revenue / Monthly Expenses
 */
export const calculateRevenueExpenseRatio = (revenue, expenses) => {
  const exp = Number(expenses) || 1;
  const rev = Number(revenue) || 0;
  if (exp === 0) return rev > 0 ? 10 : 1;
  return Number((rev / exp).toFixed(2));
};

/**
 * Debt Ratio = Total Debt / (Total Cash + Monthly Revenue * 12)
 */
export const calculateDebtRatio = (debt, revenue, cash) => {
  const totalDebt = Number(debt) || 0;
  const annualRev = (Number(revenue) || 0) * 12;
  const totalCash = Number(cash) || 0;
  const totalAssetsOrCapital = Math.max(1, annualRev + totalCash);
  return Number(((totalDebt / totalAssetsOrCapital) * 100).toFixed(1));
};

/**
 * Funding Strength calculation
 */
export const calculateFundingStrength = (funding, cash, burnRate) => {
  const fund = Number(funding) || 0;
  const c = Number(cash) || 0;
  const burn = Number(burnRate) || 1;
  const runway = c / Math.max(burn, 1);

  if (fund > 10000000 || runway >= 18) return 'Strong';
  if (fund > 2500000 || runway >= 9) return 'Moderate';
  return 'Limited';
};

/**
 * Weighted Startup Health Score calculation (0 - 100)
 */
export const calculateHealthScore = (data) => {
  const rev = Number(data.monthlyRevenue) || 0;
  const exp = Number(data.monthlyExpenses) || 0;
  const cash = Number(data.availableCash) || 0;
  const burn = Number(data.monthlyBurnRate) || Math.max(0, exp - rev);
  const debt = Number(data.totalDebt) || 0;
  const growth = Number(data.customerGrowthRate) || 0;
  const retention = Number(data.customerRetentionRate) || 0;
  const years = Number(data.yearsInOperation) || 1;

  // 1. Profitability & Efficiency Score (25%)
  const profitMargin = calculateProfitMargin(rev, exp);
  let profitScore = 50;
  if (profitMargin >= 30) profitScore = 100;
  else if (profitMargin >= 15) profitScore = 88;
  else if (profitMargin >= 0) profitScore = 75;
  else if (profitMargin >= -20) profitScore = 58;
  else if (profitMargin >= -50) profitScore = 40;
  else profitScore = 20;

  // 2. Runway & Cash Safety Score (25%)
  const runway = calculateCashRunway(cash, burn, rev, exp);
  let runwayScore = 50;
  if (profitMargin >= 0 && runway >= 18) runwayScore = 100;
  else if (runway >= 24) runwayScore = 95;
  else if (runway >= 18) runwayScore = 85;
  else if (runway >= 12) runwayScore = 72;
  else if (runway >= 6) runwayScore = 50;
  else if (runway >= 3) runwayScore = 30;
  else runwayScore = 12;

  // 3. Customer Growth & Traction Score (20%)
  let growthScore = 50;
  if (growth >= 25) growthScore = 100;
  else if (growth >= 15) growthScore = 85;
  else if (growth >= 8) growthScore = 72;
  else if (growth >= 3) growthScore = 55;
  else if (growth >= 0) growthScore = 40;
  else growthScore = 20;

  // 4. Customer Retention & Market Fit Score (15%)
  let retentionScore = 50;
  if (retention >= 85) retentionScore = 100;
  else if (retention >= 75) retentionScore = 85;
  else if (retention >= 60) retentionScore = 68;
  else if (retention >= 45) retentionScore = 50;
  else retentionScore = 30;

  // 5. Debt & Solvency Score (15%)
  const debtRatio = calculateDebtRatio(debt, rev, cash);
  let debtScore = 80;
  if (debt === 0) debtScore = 100;
  else if (debtRatio <= 20) debtScore = 88;
  else if (debtRatio <= 40) debtScore = 70;
  else if (debtRatio <= 65) debtScore = 50;
  else debtScore = 25;

  // Experience & Longevity Bonus (+ up to 5 points modifier)
  let stabilityBonus = 0;
  if (data.founderExperience === 'Experienced (5+ yrs)') stabilityBonus += 3;
  if (years >= 3) stabilityBonus += 2;

  // Weighted aggregate
  const weighted =
    profitScore * 0.25 +
    runwayScore * 0.25 +
    growthScore * 0.20 +
    retentionScore * 0.15 +
    debtScore * 0.15 +
    stabilityBonus;

  const finalScore = Math.min(100, Math.max(5, Math.round(weighted)));

  return {
    score: finalScore,
    breakdown: {
      profitability: Math.round(profitScore),
      runwaySafety: Math.round(runwayScore),
      growthTraction: Math.round(growthScore),
      retentionQuality: Math.round(retentionScore),
      debtSolvency: Math.round(debtScore)
    }
  };
};

/**
 * Health Status Classifier
 * 80-100: Healthy Startup
 * 60-79: Moderate Risk
 * 0-59: High Risk
 */
export const getHealthStatus = (score) => {
  if (score >= 80) {
    return {
      status: 'Healthy Startup',
      riskLevel: 'Low Risk',
      color: '#10b981', // Emerald
      badgeClass: 'badge-healthy',
      summary: 'Strong financial runway, solid customer metrics, and well-managed burn rate.'
    };
  }
  if (score >= 60) {
    return {
      status: 'Moderate Risk',
      riskLevel: 'Moderate Risk',
      color: '#f59e0b', // Amber
      badgeClass: 'badge-moderate',
      summary: 'Viable core business, but operational vulnerabilities require prompt strategic adjustments.'
    };
  }
  return {
    status: 'High Risk',
    riskLevel: 'High Risk',
    color: '#ef4444', // Red
    badgeClass: 'badge-high',
    summary: 'Critical challenges in cash flow, burn sustainability, or customer traction needing urgent triage.'
  };
};

/**
 * Automatically identify risk factors with severity and actionable recommendations
 */
export const getRiskFactors = (data, metrics) => {
  const risks = [];
  const rev = Number(data.monthlyRevenue) || 0;
  const exp = Number(data.monthlyExpenses) || 0;
  const cash = Number(data.availableCash) || 0;
  const runway = metrics.cashRunway;
  const profitMargin = metrics.profitMargin;
  const retention = Number(data.customerRetentionRate) || 0;
  const growth = Number(data.customerGrowthRate) || 0;
  const debt = Number(data.totalDebt) || 0;

  // 1. Runway Risk
  if (runway < 3) {
    risks.push({
      id: 'runway-crit',
      title: 'Critical Cash Runway (< 3 Months)',
      severity: 'High',
      category: 'Cash Flow',
      explanation: `Startup has only ${runway} months of cash runway remaining before reserves deplete. Immediate solvency danger.`,
      solution: 'Execute immediate cost containment, freeze non-essential hires, and initiate emergency bridge financing or credit lines.'
    });
  } else if (runway < 6) {
    risks.push({
      id: 'runway-warn',
      title: 'Short Cash Runway (< 6 Months)',
      severity: 'Medium',
      category: 'Cash Flow',
      explanation: `With ${runway} months of runway, your fundraising lead time is constrained. VC or institutional rounds typically take 4-6 months.`,
      solution: 'Start investor outreach immediately and develop a 15-20% lean budget scenario to extend runway past 9 months.'
    });
  }

  // 2. High Operating Expenses / Negative Profit
  if (exp > rev * 1.5) {
    risks.push({
      id: 'exp-high',
      title: 'Excessive Operating Burn Ratio',
      severity: 'High',
      category: 'Financial',
      explanation: `Operating expenses (₹${exp.toLocaleString()}) exceed monthly revenue (₹${rev.toLocaleString()}) by ${(exp / Math.max(rev, 1)).toFixed(1)}x.`,
      solution: 'Audit SaaS subscriptions, contractor costs, and paid marketing channels to eliminate inefficient expenditures.'
    });
  } else if (exp > rev) {
    risks.push({
      id: 'exp-mod',
      title: 'Negative Operating Margin',
      severity: 'Medium',
      category: 'Financial',
      explanation: `Current profit margin is negative (${profitMargin.toFixed(1)}%). Business is consuming capital rather than generating surplus.`,
      solution: 'Focus on high-margin product tiers and upsell existing customer accounts to reach operating break-even.'
    });
  }

  // 3. Customer Retention / Churn Risk
  if (retention < 60) {
    risks.push({
      id: 'ret-low',
      title: 'Low Customer Retention (< 60%)',
      severity: 'High',
      category: 'Market & Product',
      explanation: `Retention rate of ${retention}% indicates severe leaky bucket syndrome. High customer churn erodes customer acquisition cost (CAC).`,
      solution: 'Conduct customer exit interviews, introduce proactive onboarding walkthroughs, and re-examine core product value.'
    });
  } else if (retention < 75) {
    risks.push({
      id: 'ret-mod',
      title: 'Sub-Optimal Retention (60-75%)',
      severity: 'Medium',
      category: 'Market & Product',
      explanation: `Customer retention at ${retention}% is below top-quartile industry benchmarks (85%+ for healthy SaaS/services).`,
      solution: 'Deploy customer success playbooks, loyalty perks, and regular feature engagement check-ins.'
    });
  }

  // 4. Stagnant Growth
  if (growth <= 2) {
    risks.push({
      id: 'growth-low',
      title: 'Stagnant Customer Growth (≤ 2%)',
      severity: 'High',
      category: 'Growth',
      explanation: 'Customer acquisition rate has plateaued, signaling potential market saturation or ineffective acquisition channels.',
      solution: 'Experiment with viral referral loops, outbound sales sequences, or adjacent target demographic niches.'
    });
  } else if (growth < 7) {
    risks.push({
      id: 'growth-mod',
      title: 'Moderate Growth Momentum (3-7%)',
      severity: 'Low',
      category: 'Growth',
      explanation: 'Growth is steady but may not outpace category competitors or attract top venture valuations.',
      solution: 'Double down on your highest converting distribution channel and test search engine optimization (SEO).'
    });
  }

  // 5. Debt Over-leverage
  if (debt > rev * 6 && debt > cash) {
    risks.push({
      id: 'debt-high',
      title: 'High Debt Burden Relative to Assets',
      severity: 'High',
      category: 'Solvency',
      explanation: `Total liabilities of ₹${debt.toLocaleString()} outstrip available cash reserves and pose debt-service distress.`,
      solution: 'Restructure term loan amortizations, negotiate interest rates, or consider equity conversion mechanisms.'
    });
  } else if (debt > 0 && debt > rev * 3) {
    risks.push({
      id: 'debt-mod',
      title: 'Noticeable Debt-to-Revenue Exposure',
      severity: 'Medium',
      category: 'Solvency',
      explanation: 'Significant debt relative to monthly revenue creates recurring cash outflows for interest servicing.',
      solution: 'Prioritize paying down high-interest liabilities using retained operational earnings.'
    });
  }

  // If no high risks detected, add positive or minor operational notice
  if (risks.length === 0) {
    risks.push({
      id: 'risk-optimal',
      title: 'Balanced Financial Operations',
      severity: 'Low',
      category: 'Operational',
      explanation: 'No critical systemic risks detected. Current burn, runway, and retention metrics are in resilient territory.',
      solution: 'Maintain conservative cash reserves while exploring disciplined growth expansion.'
    });
  }

  return risks;
};

/**
 * Generate comprehensive strategic recommendations
 */
export const getRecommendations = (data, metrics, risks) => {
  const recommendations = [];
  const rev = Number(data.monthlyRevenue) || 0;
  const exp = Number(data.monthlyExpenses) || 0;
  const runway = metrics.cashRunway;
  const retention = Number(data.customerRetentionRate) || 0;
  const growth = Number(data.customerGrowthRate) || 0;

  // Recommendation 1: Financial & Burn Management
  if (exp > rev) {
    recommendations.push({
      id: 'rec-1',
      title: 'Streamline Operating Overhead & Trim Burn Rate',
      category: 'Cost Optimization',
      impact: 'High',
      timeframe: 'Immediate (Next 30 Days)',
      description: 'Align monthly operating expenditures directly with cash collections to stop capital dilution.',
      actionSteps: [
        'Perform a 100% audit of software tools, cloud servers, and redundant SaaS licenses.',
        'Renegotiate vendor terms and office leases for quarterly payment flexibility.',
        'Target a 15-20% reduction in non-direct revenue generating overhead.'
      ]
    });
  } else {
    recommendations.push({
      id: 'rec-reinvest',
      title: 'Disciplined Capital Reinvestment for Scaling',
      category: 'Growth Strategy',
      impact: 'Medium',
      timeframe: 'Medium-term (90 Days)',
      description: 'Leverage positive cash flow margins to reinvest into proven ROI customer acquisition channels.',
      actionSteps: [
        'Allocate 15-25% of net profit into high-performing digital advertising channels.',
        'Expand engineering velocity by automating core developer workflows.',
        'Maintain at least 12 months operating buffer in liquid yield accounts.'
      ]
    });
  }

  // Recommendation 2: Customer Retention & Unit Economics
  if (retention < 80) {
    recommendations.push({
      id: 'rec-retention',
      title: 'Upgrade Customer Retention & Loyalty Framework',
      category: 'Product & Customer Success',
      impact: 'High',
      timeframe: 'Next 60 Days',
      description: 'LTV (Lifetime Value) expansion is the single most cost-effective path to startup profitability.',
      actionSteps: [
        'Deploy an automated onboarding email journey with interactive milestone checklists.',
        'Implement Net Promoter Score (NPS) surveys to identify at-risk accounts 30 days before renewal.',
        'Introduce an annual prepaid billing discount (e.g., 20% off) to lock in customer commitment.'
      ]
    });
  } else {
    recommendations.push({
      id: 'rec-expansion',
      title: 'Deploy Account Expansion & Upsell Mechanics',
      category: 'Revenue Expansion',
      impact: 'Medium',
      timeframe: 'Medium-term (90 Days)',
      description: 'High existing retention creates prime opportunities for net revenue retention (NRR) > 115%.',
      actionSteps: [
        'Introduce premium enterprise add-ons (analytics, priority support, API access).',
        'Create usage-based pricing tiers that naturally scale as your clients grow.'
      ]
    });
  }

  // Recommendation 3: Capital & Runway Strategy
  if (runway < 12) {
    recommendations.push({
      id: 'rec-capital',
      title: 'Prepare Fundraise Deck & Pitch Materials',
      category: 'Capital Raising',
      impact: 'High',
      timeframe: 'Immediate (Next 30-45 Days)',
      description: 'Securing institutional venture or angel funding requires minimum 4-6 months of consistent pipeline work.',
      actionSteps: [
        'Refine financial models with 3 scenarios: Conservative, Expected, and Aggressive.',
        'Build a targeted investor pipeline of 40+ relevant angel investors or seed funds.',
        'Draft an updated 12-slide investor pitch deck highlighting traction and unit economics.'
      ]
    });
  } else {
    recommendations.push({
      id: 'rec-runway-safe',
      title: 'Optimize Working Capital and Treasury Yield',
      category: 'Financial Strategy',
      impact: 'Low',
      timeframe: 'Ongoing',
      description: 'Your cash runway is healthy. Protect cash purchasing power against inflation.',
      actionSteps: [
        'Store reserves in conservative treasury bills or overnight liquidity funds.',
        'Establish strategic bank lines of credit before they are urgently needed.'
      ]
    });
  }

  // Recommendation 4: Growth Engine
  if (growth < 15) {
    recommendations.push({
      id: 'rec-growth',
      title: 'Diversify Customer Acquisition Channels',
      category: 'Marketing & Sales',
      impact: 'Medium',
      timeframe: 'Quarterly',
      description: 'Relying on a single acquisition funnel creates revenue fragility.',
      actionSteps: [
        'Launch an affiliate or customer referral program offering reciprocal credits.',
        'Publish in-depth case studies and engineering blogs to drive inbound organic search traffic.',
        'Test targeted LinkedIn/Google ads against high-intent commercial keywords.'
      ]
    });
  }

  return recommendations;
};

/**
 * Complete diagnosis runner: processes raw input form and calculates all metrics,
 * score, risks, recommendations, and timestamp.
 */
export const runDiagnosis = (formData) => {
  const monthlyRevenue = Number(formData.monthlyRevenue) || 0;
  const monthlyExpenses = Number(formData.monthlyExpenses) || 0;
  const availableCash = Number(formData.availableCash) || 0;
  const monthlyBurnRate = Number(formData.monthlyBurnRate) || Math.max(0, monthlyExpenses - monthlyRevenue);
  const totalDebt = Number(formData.totalDebt) || 0;
  const totalFundingReceived = Number(formData.totalFundingReceived) || 0;
  const customerGrowthRate = Number(formData.customerGrowthRate) || 0;
  const monthlyActiveUsers = Number(formData.monthlyActiveUsers) || 0;
  const customerRetentionRate = Number(formData.customerRetentionRate) || 0;
  const yearsInOperation = Number(formData.yearsInOperation) || 1;
  const numberOfEmployees = Number(formData.numberOfEmployees) || 1;

  const profitMargin = calculateProfitMargin(monthlyRevenue, monthlyExpenses);
  const cashRunway = calculateCashRunway(availableCash, monthlyBurnRate, monthlyRevenue, monthlyExpenses);
  const revenueExpenseRatio = calculateRevenueExpenseRatio(monthlyRevenue, monthlyExpenses);
  const debtRatio = calculateDebtRatio(totalDebt, monthlyRevenue, availableCash);
  const fundingStrength = calculateFundingStrength(totalFundingReceived, availableCash, monthlyBurnRate);

  const { score, breakdown } = calculateHealthScore({
    ...formData,
    monthlyRevenue,
    monthlyExpenses,
    availableCash,
    monthlyBurnRate,
    totalDebt,
    customerGrowthRate,
    customerRetentionRate,
    yearsInOperation
  });

  const statusInfo = getHealthStatus(score);

  const metrics = {
    profitMargin,
    cashRunway,
    revenueExpenseRatio,
    debtRatio,
    fundingStrength,
    netMonthlyCashFlow: monthlyRevenue - monthlyExpenses,
    burnRate: monthlyBurnRate
  };

  const risks = getRiskFactors(formData, metrics);
  const recommendations = getRecommendations(formData, metrics, risks);

  return {
    id: formData.id || `startup-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    startupName: formData.startupName || 'Untitled Startup',
    industry: formData.industry || 'Technology / SaaS',
    yearsInOperation,
    numberOfEmployees,
    founderExperience: formData.founderExperience || 'Intermediate (2-5 yrs)',
    marketCompetition: formData.marketCompetition || 'Moderate',

    // Financials
    monthlyRevenue,
    monthlyExpenses,
    availableCash,
    monthlyBurnRate,
    totalDebt,
    totalFundingReceived,

    // Business
    customerGrowthRate,
    monthlyActiveUsers,
    customerRetentionRate,

    // Computed Health & Diagnosis
    healthScore: score,
    breakdown,
    status: statusInfo.status,
    riskLevel: statusInfo.riskLevel,
    statusColor: statusInfo.color,
    statusSummary: statusInfo.summary,
    metrics,
    risks,
    recommendations,
    createdAt: formData.createdAt || new Date().toISOString()
  };
};
