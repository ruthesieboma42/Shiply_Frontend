import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import './SendPackage.css';

const SendPackage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pickupAddress: '',
    receiverAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Backend: POST /api/Shipments/Create_Shipment
      // Body: { customerId, pickupAddress, receiverAddress }
      const response = await apiClient.post('/Shipments/Create_Shipment', {
        customerId: user.id,
        pickupAddress: formData.pickupAddress,
        receiverAddress: formData.receiverAddress,
      });

      setTrackingNumber(response.data.trackingNumber);
      setSuccess(true);
      setFormData({ pickupAddress: '', receiverAddress: '' });
    } catch (err) {
      setError(err.response?.data || 'Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-package-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header"
        >
          <h1 className="page-title">Send a Package</h1>
          <p className="page-subtitle">Enter pickup and delivery addresses to create a shipment</p>
        </motion.div>

        <div className="send-package-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="form-section glass-card"
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-message"
              >
                <div className="success-icon">✅</div>
                <h3>Shipment Created Successfully!</h3>
                <p>Your tracking number:</p>
                <div className="tracking-number">{trackingNumber}</div>
                <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                  Anyone can track your package using this number on the home page.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="shipment-form">
              <div className="form-section-title">
                <h3>📍 Addresses</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address</label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="123 Main St, City, State, ZIP"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="456 Oak Ave, City, State, ZIP"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-large"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
                ) : (
                  'Create Shipment'
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="info-section"
          >
            <div className="info-card glass-card">
              <h3 className="info-title">📋 How It Works</h3>
              <div className="info-steps">
                <div className="info-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Enter Addresses</h4>
                    <p>Provide the pickup and delivery locations</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Driver Assigned</h4>
                    <p>After payment, A driver nearby accepts your shipment</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Track Anywhere</h4>
                    <p>Share your tracking number for anyone to follow its progress</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SendPackage;
