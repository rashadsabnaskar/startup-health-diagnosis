import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  FileText, 
  History as HistoryIcon, 
  Info, 
  Menu, 
  X, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-title">
            <span>StartupHealth</span>
            <span>Diagnosis System</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-menu">
          <li>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/diagnosis" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <FileText size={17} />
              Diagnosis
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/history" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <HistoryIcon size={17} />
              History
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Info size={17} />
              About
            </NavLink>
          </li>
        </ul>

        {/* Call to Action Button */}
        <div className="nav-cta">
          <Link to="/diagnosis" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>New Diagnosis</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-toggle-btn" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fade-in">
          <NavLink 
            to="/" 
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/diagnosis" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <FileText size={18} />
            Startup Diagnosis
          </NavLink>
          <NavLink 
            to="/dashboard" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            Analytics Dashboard
          </NavLink>
          <NavLink 
            to="/history" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <HistoryIcon size={18} />
            Diagnosis History
          </NavLink>
          <NavLink 
            to="/about" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Info size={18} />
            About Project
          </NavLink>
          <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
            <Link 
              to="/diagnosis" 
              onClick={closeMobileMenu}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <PlusCircle size={16} />
              Start Diagnosis Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
