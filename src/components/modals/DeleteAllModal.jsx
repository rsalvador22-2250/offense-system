import React from 'react';

const DeleteAllModal = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-trash-alt"></i> Delete All Records?</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '25px', color: 'var(--text-muted)' }}>
            This will delete <strong>{count}</strong> records. This action cannot be undone!
          </p>
          <button onClick={onConfirm} className="delete-all-btn" style={{ width: '100%', marginBottom: '10px' }}>
            Yes, Delete All
          </button>
          <button onClick={onClose} className="add-btn" style={{ width: '100%' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllModal;