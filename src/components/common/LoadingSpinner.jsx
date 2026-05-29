import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '40px'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid var(--border-color)',
        borderTopColor: 'var(--primary-500)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;