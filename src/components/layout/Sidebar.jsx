import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Logout?')) {
      await logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <h2><i className="fas fa-graduation-cap"></i> SASO Dashboard</h2>
      <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
        <i className="fas fa-th-large"></i> <span>Dashboard</span>
      </Link>
      <Link to="/add-record" className="nav-link">
        <i className="fas fa-user-plus"></i> <span>Add Record</span>
      </Link>
      <button onClick={handleLogout} className="nav-link logout" style={{ width: '100%', textAlign: 'left' }}>
        <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;