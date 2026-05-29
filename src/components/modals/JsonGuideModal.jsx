import React from 'react';

const JsonGuideModal = ({ isOpen, onClose }) => {
  const sampleJSON = `[
  {
    "name": "Juan Dela Cruz",
    "student_number": "2024-00123",
    "course": "BS Information Technology",
    "offense": "Unauthorized Absence",
    "date": "January - 15 - 2024"
  },
  {
    "name": "Maria Santos",
    "student_number": "2024-00456",
    "course": "BS Computer Science",
    "offense": "Uniform Violation",
    "date": "February - 20 - 2024"
  }
]`;

  const copySample = () => {
    navigator.clipboard.writeText(sampleJSON);
    alert('Sample JSON copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-file-code"></i> JSON File Format Guide</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="guide-section">
            <h3><i className="fas fa-info-circle"></i> File Format Requirements</h3>
            <p>Your JSON file must be an <strong>array of objects</strong> with these fields:</p>
            <table className="field-table">
              <thead>
                <tr><th>Field</th><th>Required</th><th>Example</th></tr>
              </thead>
              <tbody>
                <tr><td>name</td><td>✅</td><td>"Juan Dela Cruz"</td></tr>
                <tr><td>student_number</td><td>✅</td><td>"2024-00123"</td></tr>
                <tr><td>course</td><td>✅</td><td>"BS Information Technology"</td></tr>
                <tr><td>offense</td><td>✅</td><td>"Tardiness"</td></tr>
                <tr><td>date</td><td>❌</td><td>"January - 15 - 2024"</td></tr>
              </tbody>
            </table>
          </div>
          <div className="guide-section">
            <h3><i className="fas fa-file-alt"></i> Sample JSON</h3>
            <div className="code-block">
              <pre>{sampleJSON}</pre>
            </div>
            <button className="copy-btn" onClick={copySample}>
              <i className="fas fa-copy"></i> Copy Sample JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonGuideModal;