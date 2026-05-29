import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '../contexts/ToastContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { darkMode } = useDarkMode();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddOffenseModal, setShowAddOffenseModal] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '', student_number: '', course: '', cca_email: '', date: '', major: '', minor: ''
  });
  
  const [offenseType, setOffenseType] = useState('');
  const [offenseDesc, setOffenseDesc] = useState('');
  const [offenseDescSelect, setOffenseDescSelect] = useState('');
  const [offenseMinorOther, setOffenseMinorOther] = useState('');
  const [offenseDate, setOffenseDate] = useState('');
  const [showMinorOther, setShowMinorOther] = useState(false);

  const formatDateToMonthDayYear = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} - ${date.getDate()} - ${date.getFullYear()}`;
  };

  const parseMonthDayYearToDate = (dateString) => {
    if (!dateString || dateString.trim() === "") return null;
    try {
      const parts = dateString.split(" - ");
      if (parts.length === 3) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        const month = monthNames.indexOf(parts[0]);
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        if (month !== -1 && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
      return new Date(dateString);
    } catch (e) {
      return new Date(dateString);
    }
  };

  const countOffenses = (str) => {
    if (!str || str.trim() === "") return 0;
    return str.split("|").filter(s => s.trim() !== "").length;
  };

  const formatOffenseDate = (dateStr) => {
    try {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const parts = dateStr.split(" - ");
      if (parts.length === 3 && monthNames.includes(parts[0])) {
        return dateStr;
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return formatDateToMonthDayYear(date);
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const displayOffensesAsList = (offenseStr, type) => {
    if (!offenseStr || offenseStr.trim() === "") {
      return <div className="no-offenses">No offenses recorded</div>;
    }
    
    const offenses = offenseStr.split('|').filter(entry => entry.trim() !== "");
    
    return (
      <div className="offense-list">
        {offenses.map((entry, idx) => {
          const match = entry.match(/^(.*?)\s*\((.*?)\)$/);
          let description = entry.trim();
          let date = "";
          
          if (match) {
            description = match[1].trim();
            date = formatOffenseDate(match[2].trim());
          }
          
          const itemClass = type === 'major' ? 'major-item' : 'minor-item';
          
          return (
            <div key={idx} className={`offense-item ${itemClass}`}>
              <div className="offense-icon">
                {type === 'major' ? 
                  <i className="fas fa-gavel"></i> : 
                  <i className="fas fa-exclamation-circle"></i>
                }
              </div>
              <div className="offense-content">
                <div className="offense-description">{description}</div>
                {date && <div className="offense-date">{date}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "studentRecords", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStudent({ id: docSnap.id, ...docSnap.data() });
        } else {
          showToast('Student record not found', 'error');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        showToast('Error loading student details', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    const today = new Date();
    setOffenseDate(today.toISOString().split('T')[0]);
  }, []);

  const handleEditClick = () => {
    if (student) {
      let dateForInput = "";
      if (student.date) {
        try {
          const dateObj = parseMonthDayYearToDate(student.date);
          if (dateObj && !isNaN(dateObj.getTime())) {
            dateForInput = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {}
      }
      
      setEditForm({
        name: student.name || "",
        student_number: student.student_number || "",
        course: student.course || "",
        cca_email: student.cca_email || "",
        date: dateForInput,
        major: student.major || "",
        minor: student.minor || ""
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    let dateToSave = "";
    if (editForm.date) {
      const dateObj = new Date(editForm.date);
      if (!isNaN(dateObj.getTime())) {
        dateToSave = formatDateToMonthDayYear(dateObj);
      } else {
        dateToSave = editForm.date;
      }
    }
    
    const updated = {
      name: editForm.name,
      student_number: editForm.student_number,
      course: editForm.course,
      cca_email: editForm.cca_email,
      date: dateToSave,
      major: editForm.major,
      minor: editForm.minor,
      offense_count: countOffenses(editForm.major) + countOffenses(editForm.minor),
      last_updated: serverTimestamp()
    };
    
    try {
      await updateDoc(doc(db, "studentRecords", id), updated);
      setShowEditModal(false);
      showToast('Record updated successfully!');
      const docRef = doc(db, "studentRecords", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error updating document:", error);
      showToast('Error updating record', 'error');
    }
  };

  const handleAddOffense = async () => {
    if (!offenseType || !offenseDate) {
      showToast('Please fill all fields', 'error');
      return;
    }
    
    let desc = offenseType === 'major' ? offenseDesc : offenseDescSelect;
    if (desc === 'OTHERS') {
      desc = offenseMinorOther;
      if (!desc) {
        showToast('Please specify the offense', 'error');
        return;
      }
    }
    
    if (!desc) {
      showToast('Please enter offense description', 'error');
      return;
    }
    
    const formattedDate = formatOffenseDate(offenseDate);
    const entry = `${desc} (${formattedDate})`;
    
    let newMajor = student.major || "";
    let newMinor = student.minor || "";
    
    if (offenseType === 'major') {
      newMajor = newMajor ? newMajor + "|" + entry : entry;
    } else {
      newMinor = newMinor ? newMinor + "|" + entry : entry;
    }
    
    try {
      await updateDoc(doc(db, "studentRecords", id), {
        major: newMajor,
        minor: newMinor,
        offense_count: countOffenses(newMajor) + countOffenses(newMinor),
        last_updated: serverTimestamp()
      });
      
      setShowAddOffenseModal(false);
      showToast('Offense added successfully!');
      setOffenseType('');
      setOffenseDesc('');
      setOffenseDescSelect('');
      setOffenseMinorOther('');
      setShowMinorOther(false);
      
      const docRef = doc(db, "studentRecords", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error adding offense:", error);
      showToast('Error adding offense', 'error');
    }
  };

  const handleDeleteRecord = async () => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, "studentRecords", id));
        showToast('Record deleted successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error("Error deleting record:", error);
        showToast('Error deleting record', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-body)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadingSpinner message="Loading student details..." />
      </div>
    );
  }

  if (!student) return null;

  const majorCount = countOffenses(student.major);
  const minorCount = countOffenses(student.minor);
  const totalCount = majorCount + minorCount;

  return (
    <div className="professional-student-page">
      <DarkModeToggle />
      
      <div className="professional-container">
        {/* Back Button - Prominent */}
        <div className="back-button-container">
          <button className="back-button-main" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="professional-header">
          <div className="header-main">
            <div className="student-avatar">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="student-info-header">
              <h1 className="student-name">{student.name || 'Unnamed Student'}</h1>
              <div className="student-meta">
                <span className="meta-item">
                  <i className="fas fa-id-card"></i> {student.student_number || 'No ID'}
                </span>
                <span className="meta-item">
                  <i className="fas fa-graduation-cap"></i> {student.course || 'No Course'}
                </span>
                <span className="meta-item">
                  <i className="fas fa-calendar-alt"></i> {student.date || 'No Date'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="professional-stats">
          <div className="stat-card">
            <div className="stat-icon major">
              <i className="fas fa-gavel"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{majorCount}</span>
              <span className="stat-label">Major Offenses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon minor">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{minorCount}</span>
              <span className="stat-label">Minor Offenses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-chart-simple"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Violations</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Improved */}
        <div className="action-buttons-container">
          <button className="action-btn add-btn" onClick={() => setShowAddOffenseModal(true)}>
            <i className="fas fa-plus-circle"></i>
            <span>Add Offense</span>
          </button>
          <button className="action-btn edit-btn" onClick={handleEditClick}>
            <i className="fas fa-edit"></i>
            <span>Edit Information</span>
          </button>
          <button className="action-btn delete-btn" onClick={handleDeleteRecord}>
            <i className="fas fa-trash-alt"></i>
            <span>Delete Record</span>
          </button>
        </div>

        {/* Personal Information Card */}
        <div className="info-card">
          <div className="card-header">
            <i className="fas fa-user-circle"></i>
            <h3>Personal Information</h3>
          </div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{student.name || '—'}</p>
              </div>
              <div className="info-item">
                <label>Student Number</label>
                <p>{student.student_number || '—'}</p>
              </div>
              <div className="info-item">
                <label>Course / Program</label>
                <p>{student.course || '—'}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{student.cca_email || '—'}</p>
              </div>
              <div className="info-item">
                <label>Registration Date</label>
                <p>{student.date || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Major Offenses Card */}
        <div className="info-card">
          <div className="card-header major">
            <i className="fas fa-gavel"></i>
            <h3>Major Offenses</h3>
            <span className="badge major">{majorCount}</span>
          </div>
          <div className="card-body">
            {displayOffensesAsList(student.major, 'major')}
          </div>
        </div>

        {/* Minor Offenses Card */}
        <div className="info-card">
          <div className="card-header minor">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Minor Offenses</h3>
            <span className="badge minor">{minorCount}</span>
          </div>
          <div className="card-body">
            {displayOffensesAsList(student.minor, 'minor')}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student Record</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Student Number</label>
                <input type="text" value={editForm.student_number} onChange={(e) => setEditForm({...editForm, student_number: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Course / Program</label>
                <input type="text" value={editForm.course} onChange={(e) => setEditForm({...editForm, course: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={editForm.cca_email} onChange={(e) => setEditForm({...editForm, cca_email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Registration Date</label>
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Major Offenses</label>
                <textarea rows="3" value={editForm.major} onChange={(e) => setEditForm({...editForm, major: e.target.value})} placeholder="Use | to separate multiple offenses"></textarea>
                <small>Format: Offense Name (Month - Day - Year)</small>
              </div>
              <div className="form-group">
                <label>Minor Offenses</label>
                <textarea rows="3" value={editForm.minor} onChange={(e) => setEditForm({...editForm, minor: e.target.value})} placeholder="Use | to separate multiple offenses"></textarea>
                <small>Format: Offense Name (Month - Day - Year)</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Offense Modal */}
      {showAddOffenseModal && (
        <div className="modal-overlay" onClick={() => setShowAddOffenseModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Offense</h3>
              <button className="modal-close" onClick={() => setShowAddOffenseModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Offense Level</label>
                <select value={offenseType} onChange={(e) => setOffenseType(e.target.value)}>
                  <option value="">Select offense level</option>
                  <option value="major">Major Offense</option>
                  <option value="minor">Minor Offense</option>
                </select>
              </div>
              
              {offenseType === 'major' && (
                <div className="form-group">
                  <label>Violation Description</label>
                  <input type="text" value={offenseDesc} onChange={(e) => setOffenseDesc(e.target.value)} placeholder="e.g., Cheating, Fighting, etc." />
                </div>
              )}
              
              {offenseType === 'minor' && (
                <>
                  <div className="form-group">
                    <label>Offense Type</label>
                    <select value={offenseDescSelect} onChange={(e) => {
                      setOffenseDescSelect(e.target.value);
                      setShowMinorOther(e.target.value === 'OTHERS');
                    }}>
                      <option value="">Select minor offense</option>
                      <option value="NO ID">NO ID</option>
                      <option value="NO UNIFORM">NO UNIFORM</option>
                      <option value="DRESS CODE">DRESS CODE</option>
                      <option value="HAIR COLOR">HAIR COLOR</option>
                      <option value="PIERCINGS">PIERCINGS</option>
                      <option value="MISCONDUCT">MISCONDUCT</option>
                      <option value="LATE">LATE</option>
                      <option value="OTHERS">OTHERS</option>
                    </select>
                  </div>
                  {showMinorOther && (
                    <div className="form-group">
                      <label>Specify Offense</label>
                      <input type="text" value={offenseMinorOther} onChange={(e) => setOffenseMinorOther(e.target.value)} placeholder="Enter specific offense..." />
                    </div>
                  )}
                </>
              )}
              
              <div className="form-group">
                <label>Date of Incident</label>
                <input type="date" value={offenseDate} onChange={(e) => setOffenseDate(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddOffenseModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddOffense}>Add Offense</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .professional-student-page {
          min-height: 100vh;
          background: var(--bg-body);
          padding: 30px 20px;
        }

        .professional-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Back Button - Prominent */
        .back-button-container {
          margin-bottom: 20px;
        }

        .back-button-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button-main:hover {
          background: var(--hover-bg);
          border-color: var(--primary-500);
          transform: translateX(-3px);
        }

        .back-button-main i {
          font-size: 14px;
        }

        /* Header */
        .professional-header {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 24px 32px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .student-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-avatar i {
          font-size: 40px;
          color: var(--primary-600);
        }

        .student-info-header {
          flex: 1;
        }

        .student-name {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 8px 0;
        }

        .student-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .meta-item {
          font-size: 13px;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Stats */
        .professional-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.major {
          background: #fee2e2;
          color: #dc2626;
        }

        .stat-icon.minor {
          background: #fef3c7;
          color: #f59e0b;
        }

        .stat-icon.total {
          background: #d1fae5;
          color: #10b981;
        }

        .stat-icon i {
          font-size: 24px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-main);
          display: block;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Action Buttons - Improved */
        .action-buttons-container {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          transition: all 0.2s ease;
          color: white;
        }

        .action-btn i {
          font-size: 18px;
        }

        .add-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .edit-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .delete-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        /* Info Cards */
        .info-card {
          background: var(--card-bg);
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .card-header {
          padding: 16px 20px;
          background: var(--hover-bg);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-header i {
          font-size: 18px;
          color: var(--primary-500);
        }

        .card-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-main);
          flex: 1;
        }

        .card-header.major i {
          color: #dc2626;
        }

        .card-header.minor i {
          color: #f59e0b;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.major {
          background: #fee2e2;
          color: #dc2626;
        }

        .badge.minor {
          background: #fef3c7;
          color: #f59e0b;
        }

        .card-body {
          padding: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .info-item label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          display: block;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item p {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-main);
          margin: 0;
        }

        /* Offense List */
        .offense-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .offense-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: var(--bg-body);
          border-radius: 8px;
          border-left: 3px solid;
        }

        .offense-item.major-item {
          border-left-color: #dc2626;
        }

        .offense-item.minor-item {
          border-left-color: #f59e0b;
        }

        .offense-icon i {
          font-size: 16px;
        }

        .offense-item.major-item .offense-icon i {
          color: #dc2626;
        }

        .offense-item.minor-item .offense-icon i {
          color: #f59e0b;
        }

        .offense-content {
          flex: 1;
        }

        .offense-description {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-main);
        }

        .offense-date {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .no-offenses {
          text-align: center;
          padding: 32px;
          color: var(--text-muted);
          font-size: 14px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-muted);
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--text-main);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          background: var(--bg-body);
          color: var(--text-main);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        .form-group small {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary {
          padding: 8px 16px;
          background: var(--primary-500);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: var(--primary-600);
        }

        .btn-secondary {
          padding: 8px 16px;
          background: var(--border-color);
          color: var(--text-main);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-secondary:hover {
          background: var(--text-muted);
          color: white;
        }

        @media (max-width: 768px) {
          .professional-student-page {
            padding: 16px;
          }

          .professional-header {
            padding: 20px;
          }

          .header-main {
            flex-direction: column;
            text-align: center;
          }

          .professional-stats {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons-container {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }

          .student-meta {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDetails;