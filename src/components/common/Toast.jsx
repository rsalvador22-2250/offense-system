import React from 'react';
import { useToast } from '../contexts/ToastContext';

const Toast = () => {
  const { toast } = useToast();
  
  if (!toast.show) return null;
  
  return (
    <div className="toast-notification" style={{
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
  );
};

export default Toast;