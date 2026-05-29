import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecords } from '../../hooks/useRecords';
import { useToast } from '../../contexts/ToastContext';
import DarkModeToggle from '../common/DarkModeToggle';

const AddRecord = () => {
  const navigate = useNavigate();
  const { addRecord } = useRecords();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    student_number: '',
    cca_email: '',
    course: '',
    major: '',
    minor: '',
    minorOther: '',
    month: '',
    day: '',
    year: ''
  });

  const [showMinorOther, setShowMinorOther] = useState(false);

  useEffect(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      month: String(today.getMonth() + 1).padStart(2, '0'),
      day: String(today.getDate()).padStart(2, '0'),
      year: String(today.getFullYear())
    }));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (id === 'minor') {
      setShowMinorOther(value === 'OTHERS');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, student_number, cca_email, course, month, day, year, major, minor, minorOther } = formData;
    
    if (!name || !student_number || !cca_email || !course || !month || !day || !year) {
      showToast('Please fill all required fields!', 'error');
      return;
    }
    
    let finalMinor = minor;
    if (minor === 'OTHERS') {
      if (!minorOther) {
        showToast('Please specify the offense!', 'error');
        return;
      }
      finalMinor = minorOther;
    }
    
    setLoading(true);
    
    const success = await addRecord({
      name,
      student_number,
      cca_email,
      course,
      major,
      minor: finalMinor,
      date: `${year}-${month}-${day}`
    });
    
    setLoading(false);
    
    if (success) {
      showToast('Record saved successfully!');
      setFormData({
        name: '', student_number: '', cca_email: '', course: '', major: '', minor: '', minorOther: '', month: '', day: '', year: ''
      });
      const today = new Date();
      setFormData(prev => ({
        ...prev,
        month: String(today.getMonth() + 1).padStart(2, '0'),
        day: String(today.getDate()).padStart(2, '0'),
        year: String(today.getFullYear())
      }));
      setShowMinorOther(false);
    } else {
      showToast('Error saving record', 'error');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      padding: '100px 20px 40px 20px'
    }}>
      <DarkModeToggle />
      
      <div style={{
        maxWidth: '550px',
        margin: '0 auto',
        background: 'var(--card-bg)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          padding: '30px 25px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '32px'
          }}>
            <i className="fas fa-user-plus" style={{ color: 'white' }}></i>
          </div>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '800',
            marginBottom: '8px'
          }}>New Student Record</h2>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '14px',
            margin: 0
          }}>Enter violation details below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '30px 25px' }}>
          
          {/* Personal Information Section */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '10px'
            }}>
              <i className="fas fa-user" style={{ color: '#22c55e' }}></i>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Personal Information</h3>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-user-graduate" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-id-card" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Student ID Number *
              </label>
              <input
                type="text"
                id="student_number"
                value={formData.student_number}
                onChange={handleChange}
                placeholder="Enter student ID"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-envelope" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Email Address *
              </label>
              <input
                type="email"
                id="cca_email"
                value={formData.cca_email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Course / Section *
              </label>
              <input
                type="text"
                id="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Enter course and section"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Offense Section */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '10px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Offense Details</h3>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-gavel" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Major Offense (Optional)
              </label>
              <input
                type="text"
                id="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Enter major offense if any"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-list" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                Minor Offense (Optional)
              </label>
              <select
                id="minor"
                value={formData.minor}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
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
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  id="minorOther"
                  value={formData.minorOther}
                  onChange={handleChange}
                  placeholder="Please specify the offense"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #22c55e',
                    borderRadius: '10px',
                    fontSize: '15px',
                    background: 'var(--bg-body)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Date Section */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '10px'
            }}>
              <i className="fas fa-calendar-alt" style={{ color: '#22c55e' }}></i>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Incident Date</h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px'
            }}>
              <select
                id="month"
                value={formData.month}
                onChange={handleChange}
                required
                style={{
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="">Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select
                id="day"
                value={formData.day}
                onChange={handleChange}
                required
                style={{
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="">Day</option>
                {days.map(day => (
                  <option key={day} value={String(day).padStart(2, '0')}>{day}</option>
                ))}
              </select>
              <select
                id="year"
                value={formData.year}
                onChange={handleChange}
                required
                style={{
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <i className="fas fa-save"></i>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'var(--bg-body)',
                color: 'var(--text-main)',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#22c55e'}
              onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecord;