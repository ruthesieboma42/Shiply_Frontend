import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import './MyPackages.css';

const MyPackages = () => {
  const { user } = useAuth();
  const [myShipments, setMyShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyShipments = async () => {
      try {
        const res = await apiClient.get('/Shipments/My_Shipments');
        setMyShipments(res.data);
      } catch (err) {
        setError('Failed to load your shipments.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyShipments();
  }, []);

  const getStatusClass = (status) => {
    const map = {
      Pending: 'status-pending',
      Assigned: 'status-in-transit',
      'Picked Up': 'status-in-transit',
      'In Transit': 'status-in-transit',
      'Out for Delivery': 'status-in-transit',
      Delivered: 'status-delivered',
    };
    return map[status] || '';
  };

  return (
    <div className="my-packages-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header"
        >
          <h1 className="page-title">My Packages</h1>
          <p className="page-subtitle">Track and manage your shipments</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-banner"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="shipments-grid">
            {myShipments.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">📦</div>
                <h3>No Packages Yet</h3>
                <p>Send a shipment out to get started.</p>
              </div>
            ) : (
              myShipments.map((shipment) => (
                <motion.div
                  key={shipment.trackingNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shipment-card glass-card"
                >
                  <div className="shipment-header">
                    <span className={`status-badge ${getStatusClass(shipment.currentStatus)}`}>
                      {shipment.currentStatus}
                    </span>
                    <span className="shipment-id">#{shipment.trackingNumber}</span>
                  </div>

                  <div className="shipment-details">
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <div className="detail-content">
                        <div className="detail-label">Pickup</div>
                        <div className="detail-value">{shipment.pickupAddress}</div>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">🎯</span>
                      <div className="detail-content">
                        <div className="detail-label">Delivery</div>
                        <div className="detail-value">{shipment.receiverAddress}</div>
                      </div>
                    </div>
                  </div>

                  {shipment.history && shipment.history.length > 0 && (
                    <div style={{ margin: '12px 0', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '8px', letterSpacing: '0.5px' }}>HISTORY</div>
                      {[...shipment.history].reverse().slice(0, 3).map((h, i) => (
                        <div key={i} style={{ fontSize: '12px', padding: '3px 0', opacity: 0.75 }}>
                          <span style={{ opacity: 0.5, marginRight: '8px' }}>
                            {new Date(h.timestamp).toLocaleTimeString()}
                          </span>
                          {h.status} — {h.location}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPackages;