import React from 'react';
import RecordRow from './RecordRow';
import LoadingSpinner from '../common/LoadingSpinner';

const RecordsTable = ({ records, loading, onView, onSend, onDelete }) => {
  if (loading) {
    return (
      <div className="table-wrapper">
        <LoadingSpinner message="Loading student records..." />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="table-wrapper">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <i className="fas fa-search" style={{ fontSize: '64px', color: 'var(--text-light)' }}></i>
          <h3 style={{ color: 'var(--text-muted)', marginTop: '20px' }}>No records match your filters</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Student Information</th>
            <th>ID & Course</th>
            <th>Offense</th>
            <th>Date Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <RecordRow
              key={record.id}
              record={record}
              onView={onView}
              onSend={onSend}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;