import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Shiply</h3>
              <p className="footer-text">
                Smart logistics platform connecting customers with reliable drivers.
              </p>
            </div>
           <div>
            
           </div>
            <div className="footer-section">
              <h4 className="footer-subtitle">Contact</h4>
              <ul className="footer-links">
                <li>support@shiply.com</li>
                <li>+234 814 074 9494</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Shiply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
