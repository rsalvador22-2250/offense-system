
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import FilterBar from '../components/dashboard/FilterBar';
import TopBar from '../components/dashboard/TopBar';
import RecordsTable from '../components/dashboard/RecordsTable';
import UploadModal from '../components/modals/UploadModal';
import DeleteAllModal from '../components/modals/DeleteAllModal';
import DeleteByYearModal from '../components/modals/DeleteByYearModal';
import ExportByYearModal from '../components/modals/ExportByYearModal';
import JsonGuideModal from '../components/modals/JsonGuideModal';
import { useRecords } from '../hooks/useRecords';
import { useToast } from '../contexts/ToastContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { parseDateFromRecord } from '../utils/dateUtils';
import { exportToExcel } from '../utils/excelUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    allRecords, 
    filteredRecords, 
    setFilteredRecords, 
    loading, 
    availableYears,
    deleteRecord,
    deleteAllRecords,
    deleteByYear,
    uploadJSON,
    loadRecords
  } = useRecords();
  const { showToast } = useToast();
  const { darkMode } = useDarkMode();

  // Filter states
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteByYearModal, setShowDeleteByYearModal] = useState(false);
  const [showExportByYearModal, setShowExportByYearModal] = useState(false);
  const [showJsonGuideModal, setShowJsonGuideModal] = useState(false);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...allRecords];
    
    if (monthFilter !== 'all') {
      filtered = filtered.filter(r => parseDateFromRecord(r).month === monthFilter);
    }
    
    if (yearFilter !== 'all') {
      filtered = filtered.filter(r => parseDateFromRecord(r).year === yearFilter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(r => {
        const fields = [
          r.data.name, r.data.student_number, r.data.course,
          r.data.minor, r.data.offense, r.data.major
        ].join(' ').toLowerCase();
        return fields.includes(search);
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortFilter === 'newest') return parseDateFromRecord(b).dateObj - parseDateFromRecord(a).dateObj;
      if (sortFilter === 'oldest') return parseDateFromRecord(a).dateObj - parseDateFromRecord(b).dateObj;
      if (sortFilter === 'name_asc') return (a.data.name || '').localeCompare(b.data.name || '');
      if (sortFilter === 'name_desc') return (b.data.name || '').localeCompare(a.data.name || '');
      return 0;
    });
    
    setFilteredRecords(filtered);
  }, [allRecords, monthFilter, yearFilter, searchTerm, sortFilter, setFilteredRecords]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setMonthFilter('all');
    setYearFilter('all');
    setSortFilter('newest');
    setSearchTerm('');
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Delete this record?')) {
      const success = await deleteRecord(id);
      if (success) showToast('Record deleted');
      else showToast('Error deleting record', 'error');
    }
  };

  const handleSendToWord = () => {
    if (window.confirm('Open Google Document?')) {
      window.open('https://docs.google.com/document/d/12gddD5eO6ITTyVvz9T9504mpxcjTHkD4shU0uVoeVQk/edit?tab=t.0', '_blank');
    }
  };

  const handleExportAll = () => {
    if (filteredRecords.length === 0) {
      showToast('No records to export', 'error');
      return;
    }
    exportToExcel(filteredRecords, `SASO_Records_${new Date().toISOString().split('T')[0]}`);
    showToast(`Exported ${filteredRecords.length} records`);
  };

  const handleDeleteAll = async () => {
    const success = await deleteAllRecords();
    if (success) {
      showToast('All records deleted');
      setShowDeleteAllModal(false);
    } else {
      showToast('Error deleting records', 'error');
    }
  };

  const handleDeleteByYear = async (year) => {
    const count = await deleteByYear(year);
    if (count > 0) {
      showToast(`Deleted ${count} records from ${year}`);
    } else {
      showToast('Error deleting records', 'error');
    }
  };

  const handleUploadJSON = async (jsonData) => {
    return await uploadJSON(jsonData);
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        <div className="dash-header">
          <div>
            <h1>Student Records Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Manage and monitor all student information in one place
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              background: 'var(--card-bg)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        <StatCard totalStudents={allRecords.length} />

        <FilterBar
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          availableYears={availableYears}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
          filteredCount={filteredRecords.length}
          totalCount={allRecords.length}
        />

        <TopBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddNew={() => navigate('/add-record')}
          onUpload={() => setShowUploadModal(true)}
          onGuide={() => setShowJsonGuideModal(true)}
          onExportByYear={() => setShowExportByYearModal(true)}
          onDeleteByYear={() => setShowDeleteByYearModal(true)}
          onExportAll={handleExportAll}
          onDeleteAll={() => setShowDeleteAllModal(true)}
        />

        <RecordsTable
          records={filteredRecords}
          loading={loading}
          onView={(id) => navigate(`/student/${id}`)}
          onSend={handleSendToWord}
          onDelete={handleDeleteRecord}
        />

        {/* Modals */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadJSON}
        />

        <DeleteAllModal
          isOpen={showDeleteAllModal}
          onClose={() => setShowDeleteAllModal(false)}
          onConfirm={handleDeleteAll}
          count={allRecords.length}
        />

        <DeleteByYearModal
          isOpen={showDeleteByYearModal}
          onClose={() => setShowDeleteByYearModal(false)}
          onConfirm={handleDeleteByYear}
          records={allRecords}
        />

        <ExportByYearModal
          isOpen={showExportByYearModal}
          onClose={() => setShowExportByYearModal(false)}
          records={allRecords}
        />

        <JsonGuideModal
          isOpen={showJsonGuideModal}
          onClose={() => setShowJsonGuideModal(false)}
        />
      </main>
    </div>
  );
};

export default Dashboard;