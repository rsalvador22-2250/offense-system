import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import AddRecord from './components/records/AddRecord';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/add-record" element={
        <ProtectedRoute>
          <AddRecord />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;