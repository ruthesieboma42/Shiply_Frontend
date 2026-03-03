import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';
import './DriverDashboard.css';

const STATUS_OPTIONS = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

const DriverDashboard = () => {
  const [availableShipments, setAvailableShipments] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null); 
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [availableRes, myRes] = await Promise.all([
        apiClient.get('/Shipments/Available_Shipments'),
        apiClient.get('/Shipments/Assigned_Shipments'),
      ]);
      setAvailableShipments(availableRes.data);
      setMyShipments(myRes.data);
    } catch (err) {
      setError('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAccept = async (trackingNumber) => {
    setAccepting(trackingNumber);
    setError('');
    try {
      await apiClient.post('/Shipments/Accept_Shipment', { trackingNumber });
      await fetchData();
      setActiveTab('my-deliveries'); 
    } catch (err) {
      setError(err.response?.data || 'Failed to accept shipment.');
    } finally {
      setAccepting(null);
    }
  };

  const handleUpdateStatus = async (trackingNumber) => {
    const newStatus = statusUpdates[trackingNumber];
    if (!newStatus) return;

    try {
      await apiClient.post('/Shipments/Update_Shipment', {
        trackingNumber,
        newStatus,
        location: 'En route',
      });
      await fetchData();
      setStatusUpdates((prev) => ({ ...prev, [trackingNumber]: '' }));
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by your browser.');
      return;
    }
    setUpdatingLocation(true);
    setLocationStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await apiClient.post('/Shipments/Update_Location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus(`✅ Location updated at ${new Date().toLocaleTimeString()}`);
        } catch {
          setLocationStatus('❌ Failed to update location on server.');
        } finally {
          setUpdatingLocation(false);
        }
      },
      () => {
        setLocationStatus('❌ Location access denied.');
        setUpdatingLocation(false);
      }
    );
  };

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-header">
          <h1 className="page-title">Driver Dashboard</h1>
          <p className="page-subtitle">Browse available shipments or manage your deliveries</p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner">
            {error}
          </motion.div>
        )}

        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '4px' }}> Share Your Location</h3>
            <p style={{ fontSize: '13px', opacity: 0.65, margin: 0 }}>
              Customers can see your live location for all active deliveries.
            </p>
          </div>
          <button onClick={handleShareLocation} className="btn btn-primary" disabled={updatingLocation}>
            {updatingLocation
              ? <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
              : 'Update Location'
            }
          </button>
          {locationStatus && (
            <span style={{ width: '100%', fontSize: '13px', opacity: 0.75 }}>{locationStatus}</span>
          )}
        </motion.div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{availableShipments.length}</div>
              <div className="stat-label">Available Jobs</div>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <div className="stat-value">{myShipments.length}</div>
              <div className="stat-label">My Deliveries</div>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">
                {myShipments.filter((s) => s.currentStatus === 'Delivered').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs" style={{ margin: '32px 0 16px' }}>
          <button
            className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Shipments
            {availableShipments.length > 0 && (
              <span style={{ marginLeft: '8px', background: 'var(--primary-color)', borderRadius: '12px', padding: '2px 8px', fontSize: '12px' }}>
                {availableShipments.length}
              </span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === 'my-deliveries' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-deliveries')}
          >
            My Deliveries
          </button>
        </div>

        {/* Available Shipments Tab */}
        {activeTab === 'available' && (
          <div className="shipments-grid">
            {availableShipments.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">📭</div>
                <h3>No Available Shipments</h3>
                <p>Check back soon — new jobs are added as customers send packages.</p>
              </div>
            ) : (
              availableShipments.map((shipment) => (
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
                    <div className="detail-row">
                      <span className="detail-icon">📏</span>
                      <div className="detail-content">
                        <div className="detail-label">Distance</div>
                        <div className="detail-value">{shipment.distanceKm} km</div>
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">💰</span>
                      <div className="detail-content">
                        <div className="detail-label">Payout</div>
                        <div className="detail-value" style={{ color: '#4ade80', fontWeight: 600 }}>
                          ₦{shipment.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(shipment.trackingNumber)}
                    className="btn btn-primary btn-full"
                    disabled={accepting === shipment.trackingNumber}
                  >
                    {accepting === shipment.trackingNumber
                      ? <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                      : 'Accept Delivery'
                    }
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* My Deliveries Tab */}
        {activeTab === 'my-deliveries' && (
          <div className="shipments-grid">
            {myShipments.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">🚚</div>
                <h3>No Active Deliveries</h3>
                <p>Accept a shipment from the Available tab to get started.</p>
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

                  {/* Tracking history */}
                  {shipment.history && shipment.history.length > 0 && (
                    <div style={{ margin: '12px 0', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '8px', letterSpacing: '0.5px' }}>HISTORY</div>
                      {shipment.history.slice(-3).map((h, i) => (
                        <div key={i} style={{ fontSize: '12px', padding: '3px 0', opacity: 0.75 }}>
                          <span style={{ opacity: 0.5, marginRight: '8px' }}>
                            {new Date(h.timestamp).toLocaleTimeString()}
                          </span>
                          {h.status} — {h.location}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status update */}
                  {shipment.currentStatus !== 'Delivered' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <select
                        value={statusUpdates[shipment.trackingNumber] || ''}
                        onChange={(e) =>
                          setStatusUpdates((prev) => ({ ...prev, [shipment.trackingNumber]: e.target.value }))
                        }
                        className="form-input"
                        style={{ flex: 1, padding: '8px 12px' }}
                      >
                        <option value="">Update status...</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleUpdateStatus(shipment.trackingNumber)}
                        className="btn btn-primary"
                        disabled={!statusUpdates[shipment.trackingNumber]}
                      >
                        Update
                      </button>
                    </div>
                  )}

                  {shipment.currentStatus === 'Delivered' && (
                    <div style={{ marginTop: '12px', textAlign: 'center', color: '#4ade80', fontWeight: 600 }}>
                      ✅ Delivery Complete
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

export default DriverDashboard;