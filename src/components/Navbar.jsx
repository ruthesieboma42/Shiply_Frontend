import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isDriver } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/track', label: 'Track Package' },
  ];

  const authLinks = isAuthenticated
    ? isDriver
      ? [{ path: '/driver-dashboard', label: 'Dashboard' }]
      : [
          { path: '/send-package', label: 'Send Package' },
          { path: '/my-packages', label: 'My Packages' },
        ]
    : [];

  const navLinks = [...publicLinks, ...authLinks];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="logo-wrapper"
          >
           
            <span className="logo-text">Shiply</span>
          </motion.div>
        </Link>

        <div className="navbar-menu desktop-menu">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={link.path} className={`nav-link ${isActive(link.path) ? 'active' : ''}`}>
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.email}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}

          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
