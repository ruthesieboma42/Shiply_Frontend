import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SendPackage from './pages/SendPackage';
import DriverDashboard from './pages/DriverDashboard';
import MyPackages from './pages/MyPackages';
import TrackPackage from './pages/TrackPackage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* No Auth*/}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackPackage />} />

            {/* Auth Required */}
            <Route
              path="/send-package"
              element={
                <ProtectedRoute requireCustomer>
                  <SendPackage />
                </ProtectedRoute>
              }
            />

            {/* "My Packages Customer only" */}
            <Route
              path="/my-packages"
              element={
                <ProtectedRoute>
                  <MyPackages />
                </ProtectedRoute>
              }
            />

            {/* Driver-only */}
            <Route
              path="/driver-dashboard"
              element={
                <ProtectedRoute requireDriver>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
