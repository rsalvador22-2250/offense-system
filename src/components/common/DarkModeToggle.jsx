import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';  // Tama na ito

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        border: 'none',
        color: 'white',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: 'var(--btn-shadow)',
        transition: 'all 0.3s ease',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`}></i>
    </button>
  );
};

export default DarkModeToggle;