import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';

const Sidebar = ({ totalStartups = 0, onResetData }) => {
  return (
    <aside className="dashboard-sidebar">
      <div>
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
            System Navigation
          </span>
        </div>

        <ul className="sidebar-nav">
          <li>
            <NavLink 
              to="/dashboard" 
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/diagnosis" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>Diagnose Startup</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/history" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <History size={18} />
              <span>All Records ({totalStartups})</span>
            </NavLink>
          </li>
        </ul>

        <div style={{ marginTop: '2.5rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
            Quick Actions
          </span>
        </div>

        <ul className="sidebar-nav">
          {onResetData && (
            <li>
              <button 
                onClick={onResetData}
                className="sidebar-link"
                style={{ width: '100%', textAlign: 'left', background: 'transparent' }}
                title="Restore initial 6 benchmark demo startups"
              >
                <RotateCcw size={18} />
                <span>Reset Demo Data</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Sidebar Footer Widget */}
      <div className="sidebar-footer-card">
        <Sparkles size={24} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.9 }} />
        <h5>College Project Demo</h5>
        <p>Interactive algorithm with financial modeling & risk diagnostics.</p>
        <NavLink to="/diagnosis" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          Run Test Now
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
