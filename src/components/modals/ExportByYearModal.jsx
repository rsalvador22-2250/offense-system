import React, { useState, useEffect } from 'react';
import { parseDateFromRecord } from '../../utils/dateUtils';
import { exportToExcel } from '../../utils/excelUtils';

const ExportByYearModal = ({ isOpen, onClose, records }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [yearStats, setYearStats] = useState({});

  useEffect(() => {
    if (isOpen && records) {
      const stats = {};
      records.forEach(record => {
        const year = parseDateFromRecord(record).year;
        if (year !== 'unknown') {
          stats[year] = (stats[year] || 0) + 1;
        }
      });
      setYearStats(stats);
    }
  }, [isOpen, records]);

  const handleExport = () => {
    if (selectedYear) {
      const recordsToExport = records.filter(r => parseDateFromRecord(r).year === selectedYear);
      exportToExcel(recordsToExport, `SASO_Records_${selectedYear}`);
      onClose();
      setSelectedYear('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-file-excel"></i> Export Records by Year</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="guide-section">
            <h3><i className="fas fa-chart-pie"></i> Available Years</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '15px 0' }}>
              {Object.entries(yearStats).sort((a, b) => b[0] - a[0]).map(([year, count]) => (
                <span
                  key={year}
                  className="year-badge"
                  onClick={() => setSelectedYear(year)}
                  style={{ cursor: 'pointer' }}
                >
                  📅 {year}: {count} record(s)
                </span>
              ))}
            </div>
          </div>
          <div className="guide-section">
            <h3><i className="fas fa-calendar"></i> Select Year to Export</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
              style={{ width: '100%', margin: '15px 0' }}
            >
              <option value="">Select a year...</option>
              {Object.keys(yearStats).sort((a, b) => b - a).map(year => (
                <option key={year} value={year}>{year} ({yearStats[year]} records)</option>
              ))}
            </select>
          </div>
          <div className="success-box">
            <p><i className="fas fa-info-circle"></i> <strong>Export Options:</strong> Exports all records from the selected year to Excel.</p>
          </div>
          <button onClick={handleExport} className="excel-btn" style={{ width: '100%', marginBottom: '10px' }}>
            <i className="fas fa-download"></i> Export Selected Year
          </button>
          <button onClick={onClose} className="add-btn" style={{ width: '100%' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ExportByYearModal;