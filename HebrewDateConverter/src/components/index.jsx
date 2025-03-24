import React, { useState, useEffect } from 'react';
import Header from './Header';
import DateInput from './DateInput';
import HebrewDateDisplay from './HebrewDateDisplay';
import { 
  formatDate, 
  convertToHebrewDate, 
  getHebrewDayOfWeek, 
  getDateNote 
} from './hebrewDateUtils';

/**
 * Main Hebrew Date Converter component
 * Manages the state and logic for converting Gregorian dates to Hebrew dates
 */
const HebrewDateConverter = () => {
  // State hooks
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [dateNote, setDateNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    setGregorianDate(formatDate(today));
  }, []);

  // Convert date whenever input changes
  useEffect(() => {
    if (gregorianDate) {
      handleConvertDate();
    }
  }, [gregorianDate]);

  /**
   * Convert the current Gregorian date to Hebrew date
   */
  const handleConvertDate = () => {
    setError('');
    setLoading(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          return;
        }

        // Get Hebrew date
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // Get day of week
        setDayOfWeek(getHebrewDayOfWeek(date));
        
        // Get special date note
        const note = getDateNote(date);
        setDateNote(note);
        
        setLoading(false);
      } catch (error) {
        console.error('Error converting date:', error);
        setError('אירעה שגיאה בהמרת התאריך');
        setLoading(false);
      }
    }, 300);
  };

  /**
   * Handle date change from DateInput component
   * @param {string} newDate - New date in yyyy-MM-dd format
   */
  const handleDateChange = (newDate) => {
    if (newDate) {
      // Extract year from the date input
      const [yearStr] = newDate.split('-');
      
      // Validate year
      if (yearStr.length !== 4 || !/^\d{4}$/.test(yearStr)) {
        setError('השנה חייבת להיות בדיוק 4 ספרות');
        return;
      }
      
      const year = parseInt(yearStr, 10);
      if (year < 1800 || year > 2300) {
        setError('השנה חייבת להיות בטווח 1800-2300');
        return;
      }
    }
    
    setError(''); // Clear any previous errors
    setGregorianDate(newDate);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl text-right" dir="rtl">
      {/* Header */}
      <Header />
      
      {/* Date Input Section */}
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {/* Hebrew Date Display */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        dateNote={dateNote}
        loading={loading}
        gregorianDate={gregorianDate}
      />
      
      {/* Footer */}
      <div className="mt-6 text-center text-indigo-400 text-xs">
        <p>ממיר תאריכים משופר • גרסה 2.0</p>
      </div>
    </div>
  );
};

export default HebrewDateConverter;