import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { parseDateFromRecord, formatDateToMonthDayYear } from '../utils/dateUtils';

export const useRecords = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "studentRecords"));
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          data: doc.data(),
          dateInfo: parseDateFromRecord({ data: doc.data() })
        });
      });
      
      setAllRecords(records);
      setFilteredRecords(records);
      
      const years = new Set();
      records.forEach(r => {
        if (r.dateInfo.year !== 'unknown') years.add(r.dateInfo.year);
      });
      setAvailableYears(Array.from(years).sort((a, b) => b - a));
      
    } catch (err) {
      console.error("Error loading records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback(async (recordData) => {
    try {
      const formattedDate = formatDateToMonthDayYear(recordData.date);
      const docData = {
        name: recordData.name,
        student_number: recordData.student_number,
        cca_email: recordData.cca_email,
        course: recordData.course,
        major: recordData.major || "",
        minor: recordData.minor || "",
        date: formattedDate,
        offense_count: (recordData.major ? 1 : 0) + (recordData.minor ? 1 : 0),
        created_at: serverTimestamp(),
        last_updated: serverTimestamp()
      };
      await addDoc(collection(db, "studentRecords"), docData);
      await loadRecords();
      return true;
    } catch (err) {
      console.error("Error adding record:", err);
      return false;
    }
  }, [loadRecords]);

  const deleteRecord = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, "studentRecords", id));
      await loadRecords();
      return true;
    } catch (err) {
      console.error("Error deleting record:", err);
      return false;
    }
  }, [loadRecords]);

  const deleteAllRecords = useCallback(async () => {
    try {
      for (const record of allRecords) {
        await deleteDoc(doc(db, "studentRecords", record.id));
      }
      await loadRecords();
      return true;
    } catch (err) {
      console.error("Error deleting all records:", err);
      return false;
    }
  }, [allRecords, loadRecords]);

  const deleteByYear = useCallback(async (year) => {
    try {
      const recordsToDelete = allRecords.filter(r => r.dateInfo.year === year);
      for (const record of recordsToDelete) {
        await deleteDoc(doc(db, "studentRecords", record.id));
      }
      await loadRecords();
      return recordsToDelete.length;
    } catch (err) {
      console.error("Error deleting records by year:", err);
      return 0;
    }
  }, [allRecords, loadRecords]);

  const uploadJSON = useCallback(async (jsonData) => {
    try {
      for (const rec of jsonData) {
        const formattedDate = rec.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }).replace(/,/g, ' -');
        
        await addDoc(collection(db, 'studentRecords'), {
          name: rec.name || '',
          student_number: rec.student_number || '',
          course: rec.course || '',
          minor: rec.offense || '',
          date: formattedDate,
          cca_email: 'N.A',
          created_at: serverTimestamp(),
          last_updated: serverTimestamp()
        });
      }
      await loadRecords();
      return jsonData.length;
    } catch (err) {
      console.error("Error uploading JSON:", err);
      return 0;
    }
  }, [loadRecords]);

  return {
    allRecords,
    filteredRecords,
    setFilteredRecords,
    loading,
    availableYears,
    loadRecords,
    addRecord,
    deleteRecord,
    deleteAllRecords,
    deleteByYear,
    uploadJSON
  };
};