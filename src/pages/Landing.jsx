import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated, isDriver } = useAuth();
  const navigate = useNavigate();
  const [trackInput, setTrackInput] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackInput.trim())}`);
    }
  };

  const features = [
    { icon: '🚀', title: 'Fast Delivery', description: 'Get your packages delivered quickly with our network of verified drivers.' },
    { icon: '🔒', title: 'Secure & Safe', description: 'Track your shipments in real-time with end-to-end security.' },
    { icon: '💰', title: 'Best Rates', description: 'Competitive pricing with transparent costs and no hidden fees.' },
    { icon: '📱', title: 'Easy Tracking', description: 'Monitor your packages with live updates — no login needed.' },
  ];

  const stats = [
    { value: '10K+', label: 'Deliveries' },
    { value: '500+', label: 'Active Drivers' },
    { value: '98%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="landing">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-text"
            >
              <h1 className="hero-title">
                Ship Smarter,<br />
                <span className="text-gradient">Deliver Faster</span>
              </h1>
              <p className="hero-subtitle">
                Connect with trusted drivers for seamless logistics.
                Track, manage, and optimize your shipments all in one place.
              </p>

              <form onSubmit={handleTrack} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="form-input"
                  placeholder="Enter tracking number (e.g. SHP-A1B2C3D4)"
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <button type="submit" className="btn btn-primary">
                  Track Package
                </button>
              </form>

             
            </motion.div>

           <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="hero-visual"
>
  <img
    src="../../hero-image.jpg"
    alt="Shiply delivery image"
    style={{
      width: '100%',
      maxWidth: '500px',
      height: '500px',
      borderRadius: '16px',
      objectFit: 'cover',
    }}
  />
</motion.div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-card"
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Why Choose Shiply?</h2>
            <p className="section-subtitle">Everything you need for seamless package delivery</p>
          </motion.div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card glass-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-text">Join thousands of satisfied customers and drivers on Shiply today.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">Create Your Account</Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
