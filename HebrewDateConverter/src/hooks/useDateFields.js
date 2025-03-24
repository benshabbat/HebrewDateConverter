import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  getDaysInMonth, 
  validateYear, 
  parseDateString, 
  formatDateString
} from '../utils/dateUtils';

/**
 * הוק לניהול שדות של קומפוננטת תאריך
 * 
 * @param {string} initialValue - ערך התחלתי של התאריך (YYYY-MM-DD)
 * @param {function} onChange - פונקציה שתקרא כאשר התאריך משתנה
 * @param {string} externalError - שגיאה חיצונית (אופציונלי)
 * @returns {Object} - אובייקט עם ערכים ופונקציות לניהול שדות התאריך
 */
const useDateFields = (initialValue, onChange, externalError) => {
  // פירוק הערך ההתחלתי לרכיבים
  const initialFields = parseDateString(initialValue);
  
  // מצב פנימי לשדות - מאפשר הקלדה בלי התנגשויות
  const [year, setYear] = useState(initialFields.year);
  const [month, setMonth] = useState(initialFields.month);
  const [day, setDay] = useState(initialFields.day);
  const [error, setError] = useState(externalError || '');
  
  // שמירת התאריך הקודם לצורך השוואה
  const prevValueRef = useRef(initialValue);
  
  // חישוב התאריך המלא רק כשהערכים משתנים
  const fullDate = useMemo(() => {
    return formatDateString(year, month, day);
  }, [year, month, day]);
  
  // עדכון השדות הפנימיים כאשר התאריך החיצוני משתנה
  useEffect(() => {
    if (initialValue && initialValue !== prevValueRef.current) {
      const { year: newYear, month: newMonth, day: newDay } = parseDateString(initialValue);
      setYear(newYear);
      setMonth(newMonth);
      setDay(newDay);
      prevValueRef.current = initialValue;
    }
  }, [initialValue]);

  // עדכון שגיאה חיצונית
  useEffect(() => {
    setError(externalError || '');
  }, [externalError]);
  
  // טיפול בשינוי בשדה השנה
  const handleYearChange = useCallback((e) => {
    const newYear = e.target.value;
    
    // עדכון המצב המקומי מייד
    setYear(newYear);
    
    // וידוא שהשנה בטווח הנכון
    const yearError = validateYear(newYear);
    if (yearError) {
      setError(yearError);
      return;
    }
    
    // ניקוי שגיאות
    setError('');
    
    // עדכון התאריך המלא
    if (newYear && month && day) {
      onChange({ target: { value: formatDateString(newYear, month, day) } });
    }
  }, [month, day, onChange]);
  
  // טיפול בשינוי בשדה החודש
  const handleMonthChange = useCallback((e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    
    // התאמת היום לחודש החדש אם צריך
    if (newMonth && day) {
      const maxDays = getDaysInMonth(parseInt(year), parseInt(newMonth) - 1);
      const currentDay = parseInt(day);
      
      if (currentDay > maxDays) {
        // אם היום הנוכחי גדול ממספר הימים בחודש החדש, התאם אותו
        const newDay = maxDays.toString().padStart(2, '0');
        setDay(newDay);
        
        // עדכון התאריך המלא
        if (year) {
          onChange({ target: { value: formatDateString(year, newMonth, newDay) } });
        }
        return;
      }
    }
    
    // עדכון התאריך המלא
    if (year && newMonth && day) {
      onChange({ target: { value: formatDateString(year, newMonth, day) } });
    }
  }, [year, day, onChange]);
  
  // טיפול בשינוי בשדה היום
  const handleDayChange = useCallback((e) => {
    const newDay = e.target.value;
    setDay(newDay);
    
    // עדכון התאריך המלא
    if (year && month && newDay) {
      onChange({ target: { value: formatDateString(year, month, newDay) } });
    }
  }, [year, month, onChange]);
  
  // טיפול בבחירת תאריך מלוח השנה
  const handleDateSelected = useCallback((date) => {
    if (date) {
      const { year: newYear, month: newMonth, day: newDay } = parseDateString(date);
      
      // עדכון כל השדות
      setYear(newYear);
      setMonth(newMonth);
      setDay(newDay);
      setError('');
      
      // עדכון התאריך המלא
      onChange({ target: { value: date } });
    }
  }, [onChange]);
  
  return {
    fields: { year, month, day },
    setters: { setYear, setMonth, setDay },
    handlers: { handleYearChange, handleMonthChange, handleDayChange, handleDateSelected },
    error,
    setError,
    fullDate
  };
};

export default useDateFields;