/**
 * Startup Health Diagnosis System - Local Storage & Data Persistence Layer
 * Provides data persistence, sample seed initialization, search, filtering, and CRUD operations.
 */

import { runDiagnosis } from './healthCalculator';

const STORAGE_KEY = 'startup_health_diagnosis_records';

// 6 realistic seed startups across different industries and risk profiles
const INITIAL_RAW_STARTUPS = [
  {
    id: 'seed-technova',
    startupName: 'TechNova',
    industry: 'SaaS / B2B Software',
    yearsInOperation: 3,
    numberOfEmployees: 20,
    founderExperience: 'Experienced (5+ yrs)',
    marketCompetition: 'Moderate',
    monthlyRevenue: 500000,
    monthlyExpenses: 300000,
    availableCash: 2000000,
    monthlyBurnRate: 150000,
    totalDebt: 500000,
    totalFundingReceived: 3500000,
    customerGrowthRate: 15,
    monthlyActiveUsers: 14200,
    customerRetentionRate: 85,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'seed-finedge',
    startupName: 'FinEdge Pay',
    industry: 'FinTech / Payments',
    yearsInOperation: 4,
    numberOfEmployees: 35,
    founderExperience: 'Experienced (5+ yrs)',
    marketCompetition: 'High',
    monthlyRevenue: 1250000,
    monthlyExpenses: 900000,
    availableCash: 6500000,
    monthlyBurnRate: 200000,
    totalDebt: 800000,
    totalFundingReceived: 12000000,
    customerGrowthRate: 28,
    monthlyActiveUsers: 85000,
    customerRetentionRate: 89,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'seed-biopulse',
    startupName: 'BioPulse Health',
    industry: 'HealthTech / Diagnostics',
    yearsInOperation: 2,
    numberOfEmployees: 14,
    founderExperience: 'Intermediate (2-5 yrs)',
    marketCompetition: 'Moderate',
    monthlyRevenue: 320000,
    monthlyExpenses: 480000,
    availableCash: 2400000,
    monthlyBurnRate: 220000,
    totalDebt: 600000,
    totalFundingReceived: 3000000,
    customerGrowthRate: 12,
    monthlyActiveUsers: 6400,
    customerRetentionRate: 74,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
  },
  {
    id: 'seed-edustream',
    startupName: 'EduStream Global',
    industry: 'EdTech / E-Learning',
    yearsInOperation: 2,
    numberOfEmployees: 18,
    founderExperience: 'Intermediate (2-5 yrs)',
    marketCompetition: 'High',
    monthlyRevenue: 280000,
    monthlyExpenses: 340000,
    availableCash: 1100000,
    monthlyBurnRate: 160000,
    totalDebt: 950000,
    totalFundingReceived: 1500000,
    customerGrowthRate: 8,
    monthlyActiveUsers: 18500,
    customerRetentionRate: 67,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'seed-quickdeliver',
    startupName: 'QuickDeliver Express',
    industry: 'E-Commerce & Logistics',
    yearsInOperation: 1,
    numberOfEmployees: 28,
    founderExperience: 'Beginner (<2 yrs)',
    marketCompetition: 'Very High',
    monthlyRevenue: 420000,
    monthlyExpenses: 890000,
    availableCash: 1200000,
    monthlyBurnRate: 470000,
    totalDebt: 2200000,
    totalFundingReceived: 2000000,
    customerGrowthRate: 6,
    monthlyActiveUsers: 9200,
    customerRetentionRate: 51,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 'seed-aerodrone',
    startupName: 'AeroDrone AI',
    industry: 'DeepTech & Robotics',
    yearsInOperation: 3,
    numberOfEmployees: 12,
    founderExperience: 'Intermediate (2-5 yrs)',
    marketCompetition: 'Low',
    monthlyRevenue: 180000,
    monthlyExpenses: 520000,
    availableCash: 850000,
    monthlyBurnRate: 340000,
    totalDebt: 1800000,
    totalFundingReceived: 2500000,
    customerGrowthRate: 4,
    monthlyActiveUsers: 450,
    customerRetentionRate: 58,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  }
];

// Initialize and generate full calculated diagnosis objects
export const getInitialSampleData = () => {
  return INITIAL_RAW_STARTUPS.map(raw => runDiagnosis(raw));
};

/**
 * Fetch all stored startups from localStorage.
 * Automatically seeds with INITIAL_RAW_STARTUPS on first load.
 */
export const getStoredStartups = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = getInitialSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = getInitialSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return getInitialSampleData();
  }
};

/**
 * Save a newly diagnosed startup or update an existing record
 */
export const saveStartupDiagnosis = (diagnosisData) => {
  try {
    const list = getStoredStartups();
    const existingIndex = list.findIndex(item => item.id === diagnosisData.id);

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...diagnosisData, updatedAt: new Date().toISOString() };
    } else {
      updatedList = [diagnosisData, ...list];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return [];
  }
};

/**
 * Retrieve a single startup by ID
 */
export const getStartupById = (id) => {
  const list = getStoredStartups();
  return list.find(item => String(item.id) === String(id)) || null;
};

/**
 * Delete a startup record by ID
 */
export const deleteStartupById = (id) => {
  try {
    const list = getStoredStartups();
    const filtered = list.filter(item => String(item.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting startup:', error);
    return [];
  }
};

/**
 * Reset storage back to default sample startups
 */
export const resetToSampleData = () => {
  const sample = getInitialSampleData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
  return sample;
};

/**
 * Clear all records
 */
export const clearAllData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
};
