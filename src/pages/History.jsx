import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  RotateCcw, 
  PlusCircle, 
  Building2, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { getStoredStartups, deleteStartupById, resetToSampleData } from '../utils/storage';
import { formatCurrency } from '../utils/healthCalculator';

const History = () => {
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Healthy' | 'Moderate' | 'High'
  const [notification, setNotification] = useState('');

  const loadData = () => {
    const data = getStoredStartups();
    setStartups(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the diagnosis for "${name}"?`)) {
      const updated = deleteStartupById(id);
      setStartups(updated);
      showToast(`Record "${name}" deleted successfully.`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset data back to the default benchmark startups?')) {
      const resetList = resetToSampleData();
      setStartups(resetList);
      showToast('Restored default demo startups.');
    }
  };

  const handleExportCSV = () => {
    if (startups.length === 0) return;
    const headers = ['Startup Name', 'Industry', 'Health Score', 'Status', 'Risk Level', 'Monthly Revenue', 'Monthly Expenses', 'Cash Runway', 'Date'];
    const rows = startups.map(s => [
      `"${s.startupName}"`,
      `"${s.industry}"`,
      s.healthScore,
      `"${s.status}"`,
      `"${s.riskLevel}"`,
      s.monthlyRevenue,
      s.monthlyExpenses,
      s.metrics?.cashRunway || 0,
      `"${new Date(s.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `startup_health_diagnosis_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV record sheet.');
  };

  // Filter and search
  const filteredList = startups.filter(item => {
    // Search match
    const query = searchTerm.toLowerCase();
    const matchesQuery = item.startupName.toLowerCase().includes(query) ||
                         item.industry.toLowerCase().includes(query);

    // Filter tab match
    if (!matchesQuery) return false;
    if (activeFilter === 'Healthy') return item.healthScore >= 80;
    if (activeFilter === 'Moderate') return item.healthScore >= 60 && item.healthScore < 80;
    if (activeFilter === 'High') return item.healthScore < 60;
    return true; // 'All'
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Toast alert notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem'
        }} className="animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            <HistoryIcon size={16} />
            <span>Diagnosis Audit Trail</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Diagnosis History</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            View, search, filter, and manage historical startup assessment records stored locally.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" title="Export current list to CSV">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Restore seed data">
            <RotateCcw size={15} />
            <span>Reset Demo Records</span>
          </button>
          <Link to="/diagnosis" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>New Diagnosis</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters toolbar */}
      <div className="history-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by startup name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All ({startups.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'Healthy' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Healthy')}
          >
            Healthy ({startups.filter(s => s.healthScore >= 80).length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'Moderate' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Moderate')}
          >
            Moderate ({startups.filter(s => s.healthScore >= 60 && s.healthScore < 80).length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'High' ? 'active' : ''}`}
            onClick={() => setActiveFilter('High')}
          >
            High Risk ({startups.filter(s => s.healthScore < 60).length})
          </button>
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <h3>No Startups Found</h3>
          <p>
            {searchTerm || activeFilter !== 'All' 
              ? 'No diagnosis records match your current search and filter criteria.'
              : 'You have not performed any startup health diagnoses yet.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {(searchTerm || activeFilter !== 'All') && (
              <button 
                onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} 
                className="btn btn-secondary"
              >
                Clear Search & Filters
              </button>
            )}
            <Link to="/diagnosis" className="btn btn-primary">
              <PlusCircle size={16} />
              Diagnose a Startup
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Startup Name</th>
                <th>Industry</th>
                <th>Health Score</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => {
                const isHealthy = item.healthScore >= 80;
                const isModerate = item.healthScore >= 60 && item.healthScore < 80;

                return (
                  <tr key={item.id}>
                    {/* Startup Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: isHealthy ? '#ecfdf5' : isModerate ? '#fffbeb' : '#fef2f2',
                          color: isHealthy ? '#10b981' : isModerate ? '#f59e0b' : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Building2 size={18} />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{item.startupName}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Rev: {formatCurrency(item.monthlyRevenue)} &bull; Runway: {item.metrics?.cashRunway >= 36 ? '36+ mos' : `${item.metrics?.cashRunway || 0} mos`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td>
                      <span style={{ color: '#475569', fontSize: '0.88rem' }}>{item.industry}</span>
                    </td>

                    {/* Health Score */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '800',
                          fontSize: '1.2rem',
                          color: isHealthy ? '#10b981' : isModerate ? '#f59e0b' : '#ef4444'
                        }}>
                          {item.healthScore}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/100</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${isHealthy ? 'badge-healthy' : isModerate ? 'badge-moderate' : 'badge-high'}`}>
                        {isHealthy ? <CheckCircle2 size={13} /> : isModerate ? <AlertTriangle size={13} /> : <AlertOctagon size={13} />}
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: isHealthy ? '#059669' : isModerate ? '#d97706' : '#dc2626'
                      }}>
                        {item.riskLevel}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Actions: View and Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                        <Link 
                          to={`/result/${item.id}`} 
                          className="btn btn-secondary btn-sm"
                          title="View Full Diagnosis Report"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.startupName)}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
