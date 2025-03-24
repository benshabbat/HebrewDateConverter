import { useState, useEffect, useCallback } from 'react';
import HebrewDateDisplay from './HebrewDateDisplay';
import DateInput from './DateInput';
import { convertToHebrewDate } from './hebrewDateUtils';

const HebrewDateConverter = () => {
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatGregorianDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0]; // Format: yyyy-MM-dd
  };

  const convertDate = useCallback(() => {
    setError('');
    setLoading(true);
    
    if (!gregorianDate) {
      setError('נא להזין תאריך');
      setLoading(false);
      return;
    }

    try {
      const date = new Date(gregorianDate);
      
      if (isNaN(date.getTime())) {
        setError('התאריך שהוזן אינו תקין');
        setLoading(false);
        return;
      }

      const result = convertToHebrewDate(date);
      setHebrewDate(result);
      setLoading(false);
    } catch (error) {
      console.error("Error converting date:", error);
      setError('אירעה שגיאה בהמרת התאריך');
      setLoading(false);
    }
  }, [gregorianDate]);

  // Initialize with today's date
  useEffect(() => {
    if (!gregorianDate) {
      const today = new Date();
      setGregorianDate(formatGregorianDate(today));
    }
  }, []);

  // Convert date whenever input changes
  useEffect(() => {
    if (gregorianDate) {
      convertDate();
    }
  }, [gregorianDate, convertDate]);

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    
    // Ensure the year is limited to 4 digits
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (inputDate && !datePattern.test(inputDate)) {
      setError('השנה חייבת להיות בת 4 ספרות');
      return;
    }
    
    setGregorianDate(inputDate);
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg text-right" dir="rtl">
      <div className="flex justify-between items-center border-b pb-3 border-indigo-200 mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">ממיר תאריכים לועזי-עברי</h1>
      </div>
      
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {loading ? (
        <div className="text-center py-6 my-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
          <p className="mt-3 text-indigo-700">מחשב תאריך עברי...</p>
        </div>
      ) : (
        hebrewDate && <HebrewDateDisplay hebrewDate={hebrewDate} />
      )}
    </div>
  );
};

export default HebrewDateConverter;