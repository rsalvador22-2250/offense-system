import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: '', type: 'success' });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '25px',
          right: '25px',
          background: toast.type === 'error' ? '#dc2626' : 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white',
          padding: '14px 24px',
          borderRadius: '12px',
          zIndex: 2000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontWeight: 600,
          borderLeft: '4px solid white',
          animation: 'slideIn 0.3s ease',
          maxWidth: '350px',
          fontSize: '14px'
        }}>
          {toast.message}
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};