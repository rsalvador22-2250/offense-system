import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import DarkModeToggle from '../common/DarkModeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Login successful! Redirecting...');
      navigate('/dashboard');
    } else {
      showToast(result.error, 'error');
      setPassword('');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  if (authLoading) {
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
          border: '4px solid #e2e8f0',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-gradient)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px'
    }}>
      <DarkModeToggle />
      
      <div className="login-card">
        <div className="logo-container">
          <img src="/download-Photoroom.png" alt="SASO Logo" />
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your SASO account</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope field-icon"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock field-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                disabled={loading}
              />
              <button type="button" className="toggle-eye" onClick={togglePassword}>
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>
        
        <div className="footer">
          © 2026 SASO System • Authorized Users Only
        </div>
      </div>
    </div>
  );
};

export default Login;