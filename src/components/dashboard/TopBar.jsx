import React from 'react';

const TopBar = ({
  searchTerm, setSearchTerm,
  onAddNew,
  onUpload,
  onGuide,
  onExportByYear,
  onDeleteByYear,
  onExportAll,
  onDeleteAll
}) => {
  return (
    <div className="top-bar">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
        placeholder="🔍 Type to search..."
      />
      <div className="action-buttons">
        <button className="add-btn" onClick={onAddNew}>
          <i className="fas fa-user-plus"></i> Add New
        </button>
        <button className="add-btn" onClick={onUpload} style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
          <i className="fas fa-cloud-upload-alt"></i> JSON Upload
        </button>
        <button className="guide-btn" onClick={onGuide}>
          <i className="fas fa-question-circle"></i> JSON Guide
        </button>
        <button className="export-year-btn" onClick={onExportByYear}>
          <i className="fas fa-file-excel"></i> Export by Year
        </button>
        <button className="delete-year-btn" onClick={onDeleteByYear}>
          <i className="fas fa-calendar-minus"></i> Delete by Year
        </button>
        <button className="excel-btn" onClick={onExportAll}>
          <i className="fas fa-file-excel"></i> Export All
        </button>
        <button className="delete-all-btn" onClick={onDeleteAll}>
          <i className="fas fa-trash-alt"></i> Delete All
        </button>
      </div>
    </div>
  );
};

export default TopBar;