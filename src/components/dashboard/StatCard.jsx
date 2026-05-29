import React from 'react';

const StatCard = ({ totalStudents }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-users"></i>
        </div>
        <div>
          <div className="stat-number">{totalStudents}</div>
          <div className="stat-label">Total Students Offense</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;