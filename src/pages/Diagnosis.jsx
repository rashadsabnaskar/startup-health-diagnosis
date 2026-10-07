import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  ArrowLeft 
} from 'lucide-react';
import DiagnosisForm from '../components/DiagnosisForm';

const Diagnosis = () => {
  return (
    <div className="diagnosis-container">
      <div className="container">
        {/* Header Breadcrumbs / Title */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            <FileText size={16} />
            <span>Interactive Diagnostic Engine</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.6rem' }}>
            Startup Health Diagnosis
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#64748b', fontSize: '1.05rem' }}>
            Complete the multi-section diagnostic form below. Our algorithm calculates 
            profitability, runway safety, and risk factors in real-time.
          </p>
        </div>

        {/* Form Component */}
        <DiagnosisForm />

        {/* Educational Info Cards / Formula Reference Guide */}
        <div style={{ maxWidth: '840px', margin: '3rem auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
              Formula Reference Guide
            </span>
          </div>

          <div className="grid-3">
            <div className="card" style={{ background: '#ffffff', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2563eb' }}>
                <DollarSign size={18} />
                <h4 style={{ fontSize: '0.95rem' }}>Profit Margin</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontFamily: 'var(--font-mono)' }}>
                ((Revenue - Expenses) / Revenue) &times; 100
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem' }}>
                Measures unit efficiency & cash generation.
              </span>
            </div>

            <div className="card" style={{ background: '#ffffff', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981' }}>
                <ShieldCheck size={18} />
                <h4 style={{ fontSize: '0.95rem' }}>Cash Runway</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontFamily: 'var(--font-mono)' }}>
                Available Cash / Monthly Burn Rate
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem' }}>
                Months until cash reaches zero depletion.
              </span>
            </div>

            <div className="card" style={{ background: '#ffffff', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#6366f1' }}>
                <TrendingUp size={18} />
                <h4 style={{ fontSize: '0.95rem' }}>Debt Ratio</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontFamily: 'var(--font-mono)' }}>
                Debt / (Cash + Annual Revenue)
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem' }}>
                Assesses insolvency and leverage vulnerability.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
