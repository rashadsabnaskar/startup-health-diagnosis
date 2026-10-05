/**
 * Startup Health Diagnosis System - Backend API Server (Node.js & Express)
 * Provides RESTful API endpoints for startup health evaluation,
 * calculation engine, database persistence (SQLite/MongoDB compatible), and analytics.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Database Initialization (Lightweight JSON file store simulating document database)
const readDatabase = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return [];
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to database:', err);
  }
};

/**
 * Pure Calculation Engine (Mirrors frontend utils for full backend parity)
 */
function calculateHealth(data) {
  const rev = Number(data.monthlyRevenue) || 0;
  const exp = Number(data.monthlyExpenses) || 0;
  const cash = Number(data.availableCash) || 0;
  const burn = Number(data.monthlyBurnRate) || Math.max(0, exp - rev);
  const debt = Number(data.totalDebt) || 0;
  const growth = Number(data.customerGrowthRate) || 0;
  const retention = Number(data.customerRetentionRate) || 0;

  // Margin
  const profitMargin = rev > 0 ? ((rev - exp) / rev) * 100 : exp > 0 ? -100 : 0;
  // Runway in months
  const cashRunway = burn > 0 ? Number((cash / burn).toFixed(1)) : 36;
  // Debt ratio
  const debtRatio = Number(((debt / Math.max(1, cash + rev * 12)) * 100).toFixed(1));

  // 0-100 Score
  let profitScore = profitMargin >= 30 ? 100 : profitMargin >= 15 ? 85 : profitMargin >= 0 ? 70 : 40;
  let runwayScore = cashRunway >= 24 ? 100 : cashRunway >= 18 ? 85 : cashRunway >= 12 ? 70 : cashRunway >= 6 ? 50 : 25;
  let growthScore = growth >= 25 ? 100 : growth >= 15 ? 85 : growth >= 8 ? 70 : 45;
  let retentionScore = retention >= 85 ? 100 : retention >= 75 ? 85 : retention >= 60 ? 65 : 40;
  let debtScore = debt === 0 ? 100 : debtRatio <= 20 ? 85 : debtRatio <= 40 ? 65 : 35;

  const score = Math.min(100, Math.max(10, Math.round(
    profitScore * 0.25 + runwayScore * 0.25 + growthScore * 0.20 + retentionScore * 0.15 + debtScore * 0.15
  )));

  let status = 'Healthy Startup';
  let riskLevel = 'Low Risk';
  if (score < 60) {
    status = 'High Risk';
    riskLevel = 'High Risk';
  } else if (score < 80) {
    status = 'Moderate Risk';
    riskLevel = 'Moderate Risk';
  }

  return {
    score,
    status,
    riskLevel,
    metrics: { profitMargin, cashRunway, debtRatio, monthlyBurnRate: burn }
  };
}

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date().toISOString() });
});

// 2. Get All Diagnosed Startups
app.get('/api/startups', (req, res) => {
  const startups = readDatabase();
  res.json({ success: true, count: startups.length, data: startups });
});

// 3. Get Single Startup by ID
app.get('/api/startups/:id', (req, res) => {
  const startups = readDatabase();
  const found = startups.find(s => String(s.id) === String(req.params.id));
  if (!found) {
    return res.status(404).json({ success: false, message: 'Startup record not found' });
  }
  res.json({ success: true, data: found });
});

// 4. Run Diagnosis and Save Record
app.post('/api/diagnose', (req, res) => {
  const body = req.body;
  if (!body.startupName || body.monthlyExpenses === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const diagnosis = calculateHealth(body);
  const newRecord = {
    id: `startup-${Date.now()}`,
    ...body,
    healthScore: diagnosis.score,
    status: diagnosis.status,
    riskLevel: diagnosis.riskLevel,
    metrics: diagnosis.metrics,
    createdAt: new Date().toISOString()
  };

  const startups = readDatabase();
  startups.unshift(newRecord);
  writeDatabase(startups);

  res.status(201).json({ success: true, data: newRecord });
});

// 5. Delete Startup Record
app.delete('/api/startups/:id', (req, res) => {
  let startups = readDatabase();
  const initialLength = startups.length;
  startups = startups.filter(s => String(s.id) !== String(req.params.id));

  if (startups.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  writeDatabase(startups);
  res.json({ success: true, message: 'Record deleted successfully' });
});

// Start listening if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
