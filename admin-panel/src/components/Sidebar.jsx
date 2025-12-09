import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/styles.css';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('adminTheme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    try {
      localStorage.setItem('adminTheme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', collapsed);
    } catch (e) {}
  }, [collapsed]);

  function handleLocalLogout() {
    localStorage.removeItem('adminToken');
    toast.success('Logged out');
    navigate('/login');
  }

  const logoutHandler = onLogout || handleLocalLogout;

  return (
    <aside className={`sidebar card ${collapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-top'>
        <div className='logo-wrap'>
          <div className='logo'>
            {/* simple SVG logo */}
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect x='2' y='2' width='20' height='20' rx='4' fill='#2563eb' />
              <path d='M7 13h10v2H7z' fill='white' />
            </svg>
          </div>
          {!collapsed && <div className='logo-text'>Dashboard</div>}
        </div>

        <button
          className='collapse-btn'
          onClick={() => setCollapsed(!collapsed)}
          aria-label='Toggle sidebar'
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className='sidebar-nav'>
        <Link to='/' className='link nav-item'>
          <span className='nav-icon'>🏠</span>
          {!collapsed && <span className='nav-text'>Dashboard</span>}
        </Link>

        <Link to='/drivers' className='link nav-item'>
          <span className='nav-icon'>🚗</span>
          {!collapsed && <span className='nav-text'>Drivers</span>}
        </Link>

        <Link to='/customers' className='link nav-item'>
          <span className='nav-icon'>👥</span>
          {!collapsed && <span className='nav-text'>Customers</span>}
        </Link>

        <Link to='/complaints' className='link nav-item'>
          <span className='nav-icon'>⚠️</span>
          {!collapsed && <span className='nav-text'>Complaints</span>}
        </Link>

        <Link to='/rates' className='link nav-item'>
          <span className='nav-icon'>💲</span>
          {!collapsed && <span className='nav-text'>Rates</span>}
        </Link>

        <Link to='/wallet' className='link nav-item'>
          <span className='nav-icon'>💰</span>
          {!collapsed && <span className='nav-text'>Wallet</span>}
        </Link>

        <Link to='/admin/users' className='link nav-item'>
          <span className='nav-icon'>🔐</span>
          {!collapsed && <span className='nav-text'>Admin Users</span>}
        </Link>

        <Link to='/account' className='link nav-item'>
          <span className='nav-icon'>⚙️</span>
          {!collapsed && <span className='nav-text'>Account</span>}
        </Link>

        <Link to='/documents' className='link nav-item'>
          <span className='nav-icon'>📄</span>
          {!collapsed && <span className='nav-text'>Documents</span>}
        </Link>
      </nav>

      <div className='sidebar-footer'>
        <div className='theme-toggle'>
          {!collapsed && <span className='small'>Theme</span>}
          <button
            className='button secondary'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            className='button'
            onClick={logoutHandler}
            style={{ width: '100%' }}
          >
            {!collapsed ? 'Logout' : '⎋'}
          </button>
        </div>
      </div>
    </aside>
  );
}
