import React, { useState } from 'react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const count = await onUpload(jsonData);
      alert(`Uploaded ${count} records`);
      onClose();
    } catch (err) {
      alert('Invalid JSON file. Please check the format.');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-cloud-upload-alt"></i> Bulk Upload JSON</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '20px', color: 'var(--text-main)' }}
          />
          <button onClick={handleUpload} className="add-btn" style={{ width: '100%' }} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button onClick={onClose} className="delete-all-btn" style={{ width: '100%', marginTop: '10px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;