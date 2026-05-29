import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const RecordRow = ({ record, onView, onSend, onDelete }) => {
  const r = record.data;
  const formattedDate = formatDate(record.dateInfo.dateObj);
  const monthYearDisplay = record.dateInfo.month !== 'unknown' ? 
    `${parseInt(record.dateInfo.month)}/${record.dateInfo.year}` : '';

  return (
    <tr>
      <td data-label="Student Information">
        <a href="#" className="student-link" onClick={(e) => { e.preventDefault(); onView(record.id); }}>
          <i className="fas fa-user-graduate"></i> {r.name || "No Name"}
        </a>
        <br />
        <span style={{ fontSize: '13px' }}>
          <i className="fas fa-envelope"></i> {r.cca_email || "N.A"}
        </span>
      </td>
      <td data-label="ID & Course">
        <span style={{ fontWeight: 600 }}>
          <i className="fas fa-id-card"></i> {r.student_number || "N/A"}
        </span>
        <br />
        <span style={{ fontSize: '14px' }}>
          <i className="fas fa-graduation-cap"></i> {r.course || "No course"}
        </span>
      </td>
      <td data-label="Offense">
        <i className="fas fa-exclamation-triangle"></i> {r.minor || r.offense || r.major || 'N/A'}
      </td>
      <td data-label="Date Registered">
        <div className="date-cell">
          <i className="fas fa-calendar-day"></i>
          <div>
            <div style={{ fontWeight: 600 }}>{formattedDate}</div>
            <div style={{ fontSize: 12 }}>{monthYearDisplay}</div>
          </div>
        </div>
      </td>
      <td data-label="Actions">
        <div className="action-group">
          <button className="action-btn view-btn" onClick={() => onView(record.id)} title="View">
            <i className="fas fa-eye"></i>
          </button>
          <button className="action-btn send-btn" onClick={() => onSend()} title="Word">
            <i className="fas fa-file-word"></i>
          </button>
          <button className="action-btn delete-btn" onClick={() => onDelete(record.id)} title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RecordRow;