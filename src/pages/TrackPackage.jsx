import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';
import './MyPackages.css';

const TrackPackage = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if tracking number came from URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingNumber(id);
      doTrack(id);
    }
  }, []);

  const doTrack = async (number) => {
    setLoading(true);
    setError('');
    setResult(null);
    setDriverLocation(null);
    try {
      const res = await apiClient.get(`/Shipments/Track_Package?trackingNumber=${number.trim()}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Package not found. Please check your tracking number.' : 'Failed to fetch tracking info.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) doTrack(trackingNumber);
  };

  const handleGetDriverLocation = async () => {
    setLocationLoading(true);
    setDriverLocation(null);
    try {
      const res = await apiClient.get(`/Shipments/Driver_Location?trackingNumber=${trackingNumber.trim()}`);
      setDriverLocation(res.data);
    } catch {
      setDriverLocation({ error: 'Driver location not available yet.' });
    } finally {
      setLocationLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const map = {
      Pending: 'status-pending',
      'Picked Up': 'status-in-transit',
      'In Transit': 'status-in-transit',
      'Out for Delivery': 'status-in-transit',
      Delivered: 'status-delivered',
      Paid: 'status-in-transit',
    };
    return map[status] || '';
  };

  return (
    <div className="my-packages-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
          <h1 className="page-title">Track Your Package</h1>
          <p className="page-subtitle">No account needed — just enter your tracking number</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: '32px', marginBottom: '32px' }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => { setTrackingNumber(e.target.value); setError(''); }}
                className="form-input"
                placeholder="e.g. SHP-A1B2C3D4"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                  : 'Track'
                }
              </button>
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner">
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="package-card glass-card">
            <div className="package-header">
              <div className="package-tracking">
                <span className="tracking-label">Tracking #</span>
                <span className="tracking-number">{result.trackingNumber}</span>
              </div>
              <span className={`status-badge ${getStatusClass(result.currentStatus)}`}>
                {result.currentStatus}
              </span>
            </div>

            {result.senderName && (
              <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', opacity: 0.7 }}>
                Sender: <strong>{result.senderName}</strong>
              </div>
            )}

            {/* Timeline */}
            {result.history && result.history.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>TRACKING HISTORY</div>
                {[...result.history].reverse().map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ minWidth: '130px', fontSize: '12px', opacity: 0.55 }}>
                      {new Date(h.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{h.status}</div>
                      {h.location && <div style={{ fontSize: '13px', opacity: 0.65 }}>📍 {h.location}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Driver Location */}
            <div style={{ marginTop: '24px' }}>
              <button onClick={handleGetDriverLocation} className="btn btn-secondary" disabled={locationLoading}>
                {locationLoading
                  ? <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                  : '📍 See Driver Location'
                }
              </button>

              {driverLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '14px' }}
                >
                  {driverLocation.error ? (
                    <span style={{ opacity: 0.6 }}>{driverLocation.error}</span>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, marginBottom: '8px' }}>🚚 Driver: {driverLocation.driverName}</div>
                      {driverLocation.latitude && driverLocation.longitude ? (
                        <>
                          <div style={{ opacity: 0.75 }}>
                            Lat: {driverLocation.latitude.toFixed(5)}, Lng: {driverLocation.longitude.toFixed(5)}
                          </div>
                          <a
                            href={`https://www.google.com/maps?q=${driverLocation.latitude},${driverLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'inline-block', marginTop: '10px', fontSize: '13px' }}
                          >
                            Open in Google Maps
                          </a>
                          {driverLocation.lastUpdated && (
                            <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '8px' }}>
                              Last updated: {new Date(driverLocation.lastUpdated).toLocaleTimeString()}
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ opacity: 0.6 }}>Driver hasn't shared their location yet.</span>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px', opacity: 0.6, fontSize: '14px' }}>
          Want to send a package?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default TrackPackage;
