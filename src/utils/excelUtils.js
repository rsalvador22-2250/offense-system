import * as XLSX from 'xlsx';

export const exportToExcel = (records, filename) => {
  const data = [['Name', 'Student ID', 'Course', 'Email', 'Offense', 'Date']];
  
  records.forEach(record => {
    const r = record.data;
    const formattedDate = record.dateInfo?.dateObj?.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) || new Date().toLocaleDateString();
    
    data.push([
      r.name || '',
      r.student_number || '',
      r.course || '',
      r.cca_email || 'N.A',
      r.minor || r.offense || r.major || '',
      formattedDate
    ]);
  });
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Records');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};