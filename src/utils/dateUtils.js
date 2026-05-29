export const parseDateFromRecord = (record) => {
  let dateValue = record.data?.date || record.data?.dateRegistered || record.data?.createdAt;
  if (!dateValue) return { month: 'unknown', year: 'unknown', dateObj: new Date() };
  try {
    let dateObj = new Date(dateValue);
    if (isNaN(dateObj.getTime())) return { month: 'unknown', year: 'unknown', dateObj: new Date() };
    return {
      month: String(dateObj.getMonth() + 1).padStart(2, '0'),
      year: dateObj.getFullYear().toString(),
      dateObj: dateObj
    };
  } catch (e) {
    return { month: 'unknown', year: 'unknown', dateObj: new Date() };
  }
};

export const getMonthName = (monthNumber) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[parseInt(monthNumber) - 1] || 'Unknown';
};

export const formatDate = (dateObj) => {
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const formatDateToMonthDayYear = (dateString) => {
  try {
    const [year, month, day] = dateString.split('-');
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} - ${parseInt(day)} - ${year}`;
  } catch (e) {
    return dateString;
  }
};