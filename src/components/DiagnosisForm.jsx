import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';
import { runDiagnosis } from '../utils/healthCalculator';
import { saveStartupDiagnosis } from '../utils/storage';
import { predictStartupWithML } from '../utils/mlService';

const INITIAL_FORM_STATE = {
  // Basic Info
  startupName: '',
  industry: 'SaaS / B2B Software',
  yearsInOperation: 2,
  numberOfEmployees: 12,

  // Financials
  monthlyRevenue: '',
  monthlyExpenses: '',
  availableCash: '',
  monthlyBurnRate: '',
  totalDebt: '0',
  totalFundingReceived: '0',

  // Business Metrics
  customerGrowthRate: '',
  monthlyActiveUsers: '',
  customerRetentionRate: '',
  founderExperience: 'Intermediate (2-5 yrs)',
  marketCompetition: 'Moderate'
};

const DEMO_PRESETS = [
  {
    label: '✨ Healthy SaaS (TechNova)',
    data: {
      startupName: 'TechNova Cloud',
      industry: 'SaaS / B2B Software',
      yearsInOperation: 3,
      numberOfEmployees: 22,
      monthlyRevenue: 600000,
      monthlyExpenses: 340000,
      availableCash: 2500000,
      monthlyBurnRate: 120000,
      totalDebt: 300000,
      totalFundingReceived: 4000000,
      customerGrowthRate: 18,
      monthlyActiveUsers: 16500,
      customerRetentionRate: 88,
      founderExperience: 'Experienced (5+ yrs)',
      marketCompetition: 'Moderate'
    }
  },
  {
    label: '⚠️ Moderate Risk (BioHealth)',
    data: {
      startupName: 'BioHealth Diagnostic',
      industry: 'HealthTech / Diagnostics',
      yearsInOperation: 2,
      numberOfEmployees: 15,
      monthlyRevenue: 300000,
      monthlyExpenses: 450000,
      availableCash: 1800000,
      monthlyBurnRate: 200000,
      totalDebt: 650000,
      totalFundingReceived: 2500000,
      customerGrowthRate: 10,
      monthlyActiveUsers: 5200,
      customerRetentionRate: 72,
      founderExperience: 'Intermediate (2-5 yrs)',
      marketCompetition: 'High'
    }
  },
  {
    label: '🚨 High Risk (FastCart)',
    data: {
      startupName: 'FastCart Hyperlocal',
      industry: 'E-Commerce & Logistics',
      yearsInOperation: 1,
      numberOfEmployees: 30,
      monthlyRevenue: 350000,
      monthlyExpenses: 950000,
      availableCash: 900000,
      monthlyBurnRate: 600000,
      totalDebt: 2400000,
      totalFundingReceived: 1800000,
      customerGrowthRate: 5,
      monthlyActiveUsers: 8400,
      customerRetentionRate: 48,
      founderExperience: 'Beginner (<2 yrs)',
      marketCompetition: 'Very High'
    }
  }
];

const INDUSTRIES = [
  'SaaS / B2B Software',
  'FinTech / Payments',
  'HealthTech / Diagnostics',
  'EdTech / E-Learning',
  'E-Commerce & Logistics',
  'DeepTech & AI/Robotics',
  'CleanTech & Green Energy',
  'Consumer App / D2C',
  'Other / Services'
];

const DiagnosisForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto calculate suggested monthlyBurnRate if user changes revenue/expenses and burn is blank
    if (name === 'monthlyExpenses' || name === 'monthlyRevenue') {
      const rev = name === 'monthlyRevenue' ? Number(value) : Number(formData.monthlyRevenue);
      const exp = name === 'monthlyExpenses' ? Number(value) : Number(formData.monthlyExpenses);
      if (exp > rev && !formData.monthlyBurnRate) {
        // burn estimate
      }
    }

    // Clear specific error on change
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Quick fill preset
  const applyPreset = (presetData) => {
    setFormData(presetData);
    setErrors({});
  };

  // Section Validation
  const validateStep = (stepNumber) => {
    const errs = {};

    if (stepNumber === 1) {
      if (!formData.startupName.trim()) {
        errs.startupName = 'Startup Name is required.';
      }
      if (!formData.industry) {
        errs.industry = 'Industry selection is required.';
      }
      if (Number(formData.yearsInOperation) < 0 || isNaN(formData.yearsInOperation)) {
        errs.yearsInOperation = 'Enter a valid number of years.';
      }
      if (Number(formData.numberOfEmployees) < 1 || isNaN(formData.numberOfEmployees)) {
        errs.numberOfEmployees = 'Must have at least 1 employee.';
      }
    }

    if (stepNumber === 2) {
      if (formData.monthlyRevenue === '' || Number(formData.monthlyRevenue) < 0 || isNaN(formData.monthlyRevenue)) {
        errs.monthlyRevenue = 'Please enter a valid monthly revenue (₹0 or higher).';
      }
      if (formData.monthlyExpenses === '' || Number(formData.monthlyExpenses) <= 0 || isNaN(formData.monthlyExpenses)) {
        errs.monthlyExpenses = 'Monthly expenses must be greater than 0.';
      }
      if (formData.availableCash === '' || Number(formData.availableCash) < 0 || isNaN(formData.availableCash)) {
        errs.availableCash = 'Please enter current available liquid cash.';
      }
      if (formData.monthlyBurnRate === '' || Number(formData.monthlyBurnRate) < 0 || isNaN(formData.monthlyBurnRate)) {
        errs.monthlyBurnRate = 'Please enter net monthly burn rate (or 0 if profitable).';
      }
      if (formData.totalDebt !== '' && (Number(formData.totalDebt) < 0 || isNaN(formData.totalDebt))) {
        errs.totalDebt = 'Debt cannot be negative.';
      }
    }

    if (stepNumber === 3) {
      if (formData.customerGrowthRate === '' || isNaN(formData.customerGrowthRate)) {
        errs.customerGrowthRate = 'Enter monthly customer growth rate percentage.';
      }
      if (formData.monthlyActiveUsers === '' || Number(formData.monthlyActiveUsers) < 0 || isNaN(formData.monthlyActiveUsers)) {
        errs.monthlyActiveUsers = 'Enter estimated monthly active users (MAU).';
      }
      const ret = Number(formData.customerRetentionRate);
      if (formData.customerRetentionRate === '' || isNaN(ret) || ret < 0 || ret > 100) {
        errs.customerRetentionRate = 'Retention rate must be a percentage between 0 and 100.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Execute rule-based diagnosis calculations (Health Score 0-100, ratios, risks)
      const diagnosisResult = runDiagnosis(formData);

      // 2. Query Python ML API (Decision Tree Classifier)
      const mlResult = await predictStartupWithML(formData, diagnosisResult.metrics);

      // 3. Attach ML prediction payload
      const enrichedResult = {
        ...diagnosisResult,
        mlPrediction: mlResult
      };

      // 4. Save to storage
      saveStartupDiagnosis(enrichedResult);

      setIsSubmitting(false);

      // 5. Navigate to result page
      navigate(`/result/${enrichedResult.id}`);
    } catch (err) {
      console.error('Diagnosis submission error:', err);
      // Fallback: preserve existing functionality even if ML service is unreachable
      const fallbackResult = runDiagnosis(formData);
      saveStartupDiagnosis({
        ...fallbackResult,
        mlPrediction: {
          available: false,
          error: 'AI prediction service is currently unavailable. Please start the ML server.'
        }
      });
      setIsSubmitting(false);
      navigate(`/result/${fallbackResult.id}`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '840px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
      {/* Demo Quick-Fill Bar */}
      <div className="quick-fill-bar">
        <span className="quick-fill-label">
          <Sparkles size={16} /> Quick Demo Presets:
        </span>
        <div className="quick-fill-chips">
          {DEMO_PRESETS.map((preset, idx) => (
            <button 
              key={idx} 
              type="button" 
              className="chip-btn"
              onClick={() => applyPreset(preset.data)}
              title="Click to automatically fill form with realistic test data"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-step Navigation Tabs */}
      <div className="form-tabs">
        <button 
          type="button"
          className={`form-tab-btn ${activeStep === 1 ? 'active' : ''}`}
          onClick={() => setActiveStep(1)}
        >
          <Building size={16} />
          <span>1. Basic Profile</span>
        </button>
        <button 
          type="button"
          className={`form-tab-btn ${activeStep === 2 ? 'active' : ''}`}
          onClick={() => {
            if (validateStep(1)) setActiveStep(2);
          }}
        >
          <DollarSign size={16} />
          <span>2. Financial Health</span>
        </button>
        <button 
          type="button"
          className={`form-tab-btn ${activeStep === 3 ? 'active' : ''}`}
          onClick={() => {
            if (validateStep(1) && validateStep(2)) setActiveStep(3);
          }}
        >
          <TrendingUp size={16} />
          <span>3. Traction & Market</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ==================================================================
            STEP 1: BASIC INFORMATION
            ================================================================== */}
        {activeStep === 1 && (
          <div className="animate-fade-in">
            <h3 className="form-section-title">
              <Building size={20} color="#2563eb" />
              Startup Basic Profile
            </h3>
            <p className="form-section-desc">
              Provide general organizational information about your startup venture.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="startupName">
                Startup Name <span className="req">*</span>
              </label>
              <input
                id="startupName"
                name="startupName"
                type="text"
                className={`form-control ${errors.startupName ? 'error' : ''}`}
                placeholder="e.g., TechNova AI"
                value={formData.startupName}
                onChange={handleChange}
                required
              />
              {errors.startupName && (
                <div className="field-error-msg">
                  <AlertCircle size={14} /> {errors.startupName}
                </div>
              )}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="industry">
                  Industry / Sector <span className="req">*</span>
                </label>
                <select
                  id="industry"
                  name="industry"
                  className="form-control"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  {INDUSTRIES.map((ind, i) => (
                    <option key={i} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="yearsInOperation">
                  Years in Operation <span className="req">*</span>
                </label>
                <input
                  id="yearsInOperation"
                  name="yearsInOperation"
                  type="number"
                  step="0.5"
                  min="0"
                  className={`form-control ${errors.yearsInOperation ? 'error' : ''}`}
                  placeholder="e.g., 2.5"
                  value={formData.yearsInOperation}
                  onChange={handleChange}
                />
                {errors.yearsInOperation && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.yearsInOperation}
                  </div>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="numberOfEmployees">
                  Number of Employees <span className="req">*</span>
                </label>
                <input
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  type="number"
                  min="1"
                  className={`form-control ${errors.numberOfEmployees ? 'error' : ''}`}
                  placeholder="e.g., 15"
                  value={formData.numberOfEmployees}
                  onChange={handleChange}
                />
                {errors.numberOfEmployees && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.numberOfEmployees}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="founderExperience">
                  Founder Experience
                </label>
                <select
                  id="founderExperience"
                  name="founderExperience"
                  className="form-control"
                  value={formData.founderExperience}
                  onChange={handleChange}
                >
                  <option value="Beginner (<2 yrs)">Beginner (&lt; 2 yrs, first-time founder)</option>
                  <option value="Intermediate (2-5 yrs)">Intermediate (2-5 yrs operating experience)</option>
                  <option value="Experienced (5+ yrs)">Experienced (5+ yrs, serial entrepreneur)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleNext}
              >
                <span>Continue to Financials</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 2: FINANCIAL INFORMATION
            ================================================================== */}
        {activeStep === 2 && (
          <div className="animate-fade-in">
            <h3 className="form-section-title">
              <DollarSign size={20} color="#2563eb" />
              Financial Information & Capital Position
            </h3>
            <p className="form-section-desc">
              Enter monthly run-rate metrics. Values are entered in Indian Rupees (₹).
            </p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="monthlyRevenue">
                  Monthly Revenue (MRR) <span className="req">*</span>
                  <span className="helper">Total gross monthly earnings</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="monthlyRevenue"
                    name="monthlyRevenue"
                    type="number"
                    min="0"
                    className={`form-control has-prefix ${errors.monthlyRevenue ? 'error' : ''}`}
                    placeholder="e.g., 500000"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                  />
                </div>
                {errors.monthlyRevenue && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.monthlyRevenue}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="monthlyExpenses">
                  Monthly Operating Expenses <span className="req">*</span>
                  <span className="helper">Salaries, server, rent, marketing</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    type="number"
                    min="1"
                    className={`form-control has-prefix ${errors.monthlyExpenses ? 'error' : ''}`}
                    placeholder="e.g., 350000"
                    value={formData.monthlyExpenses}
                    onChange={handleChange}
                  />
                </div>
                {errors.monthlyExpenses && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.monthlyExpenses}
                  </div>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="availableCash">
                  Available Liquid Cash Reserves <span className="req">*</span>
                  <span className="helper">Bank balance + liquid assets</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="availableCash"
                    name="availableCash"
                    type="number"
                    min="0"
                    className={`form-control has-prefix ${errors.availableCash ? 'error' : ''}`}
                    placeholder="e.g., 2000000"
                    value={formData.availableCash}
                    onChange={handleChange}
                  />
                </div>
                {errors.availableCash && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.availableCash}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="monthlyBurnRate">
                  Monthly Burn Rate <span className="req">*</span>
                  <span className="helper">Net cash depleted each month</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="monthlyBurnRate"
                    name="monthlyBurnRate"
                    type="number"
                    min="0"
                    className={`form-control has-prefix ${errors.monthlyBurnRate ? 'error' : ''}`}
                    placeholder="e.g., 150000 (0 if profitable)"
                    value={formData.monthlyBurnRate}
                    onChange={handleChange}
                  />
                </div>
                {errors.monthlyBurnRate && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.monthlyBurnRate}
                  </div>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="totalDebt">
                  Total Outstanding Debt / Liabilities
                  <span className="helper">Loans, credit lines (enter 0 if none)</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="totalDebt"
                    name="totalDebt"
                    type="number"
                    min="0"
                    className={`form-control has-prefix ${errors.totalDebt ? 'error' : ''}`}
                    placeholder="e.g., 500000"
                    value={formData.totalDebt}
                    onChange={handleChange}
                  />
                </div>
                {errors.totalDebt && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.totalDebt}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="totalFundingReceived">
                  Total Funding Raised to Date
                  <span className="helper">Angel, VC, or Grants</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="totalFundingReceived"
                    name="totalFundingReceived"
                    type="number"
                    min="0"
                    className="form-control has-prefix"
                    placeholder="e.g., 5000000"
                    value={formData.totalFundingReceived}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleNext}
              >
                <span>Continue to Business Metrics</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 3: BUSINESS & TRACTION
            ================================================================== */}
        {activeStep === 3 && (
          <div className="animate-fade-in">
            <h3 className="form-section-title">
              <TrendingUp size={20} color="#2563eb" />
              Traction, Retention & Market Dynamics
            </h3>
            <p className="form-section-desc">
              Provide metrics demonstrating customer stickiness, product-market fit, and user growth.
            </p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="customerGrowthRate">
                  Monthly Customer Growth Rate <span className="req">*</span>
                  <span className="helper">MoM % change in users/customers</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="customerGrowthRate"
                    name="customerGrowthRate"
                    type="number"
                    step="0.1"
                    className={`form-control has-suffix ${errors.customerGrowthRate ? 'error' : ''}`}
                    placeholder="e.g., 15"
                    value={formData.customerGrowthRate}
                    onChange={handleChange}
                  />
                  <span className="input-suffix">%</span>
                </div>
                {errors.customerGrowthRate && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.customerGrowthRate}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="customerRetentionRate">
                  Customer Retention Rate <span className="req">*</span>
                  <span className="helper">% of customers active after 30-90 days</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="customerRetentionRate"
                    name="customerRetentionRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className={`form-control has-suffix ${errors.customerRetentionRate ? 'error' : ''}`}
                    placeholder="e.g., 85"
                    value={formData.customerRetentionRate}
                    onChange={handleChange}
                  />
                  <span className="input-suffix">%</span>
                </div>
                {errors.customerRetentionRate && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.customerRetentionRate}
                  </div>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="monthlyActiveUsers">
                  Monthly Active Users (MAU) <span className="req">*</span>
                  <span className="helper">Unique paying or active accounts</span>
                </label>
                <input
                  id="monthlyActiveUsers"
                  name="monthlyActiveUsers"
                  type="number"
                  min="0"
                  className={`form-control ${errors.monthlyActiveUsers ? 'error' : ''}`}
                  placeholder="e.g., 12000"
                  value={formData.monthlyActiveUsers}
                  onChange={handleChange}
                />
                {errors.monthlyActiveUsers && (
                  <div className="field-error-msg">
                    <AlertCircle size={14} /> {errors.monthlyActiveUsers}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="marketCompetition">
                  Market Competition Level
                </label>
                <select
                  id="marketCompetition"
                  name="marketCompetition"
                  className="form-control"
                  value={formData.marketCompetition}
                  onChange={handleChange}
                >
                  <option value="Low">Low (First-mover / Niche monopoly)</option>
                  <option value="Moderate">Moderate (A few key competitors)</option>
                  <option value="High">High (Crowded market with established incumbents)</option>
                  <option value="Very High">Very High (Price wars / hyper-competitive)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{ minWidth: '220px' }}
              >
                {isSubmitting ? (
                  <span>Computing Health Score...</span>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Run Diagnosis & Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DiagnosisForm;
