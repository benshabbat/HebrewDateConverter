// src/components/HebrewDateConverter/index.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DateInput from './DateInput';
import HebrewDateDisplay from './HebrewDateDisplay';
import { 
  formatDate, 
  convertToHebrewDate, 
  getHebrewDayOfWeek, 
  getDateNote 
} from './hebrewDateUtils';

/**
 * קומפוננטת ממיר תאריכים עברי משופרת ביצועים - עם איקונים מוטמעים ישירות
 */
const HebrewDateConverter = () => {
  // ניהול מצב
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [dateNote, setDateNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateHeader, setAnimateHeader] = useState(false);
  
  // שמירת מזהה הטיימר לאפקט טעינה
  const loadingTimerRef = React.useRef(null);
  const headerAnimationTimerRef = React.useRef(null);

  // אתחול בתאריך הנוכחי
  useEffect(() => {
    const today = new Date();
    setGregorianDate(formatDate(today));
    
    // אנימציה קצרה לכותרת
    setAnimateHeader(true);
    
    headerAnimationTimerRef.current = setTimeout(() => {
      setAnimateHeader(false);
      headerAnimationTimerRef.current = null;
    }, 1000);
    
    // ניקוי בעת סיום
    return () => {
      if (headerAnimationTimerRef.current) {
        clearTimeout(headerAnimationTimerRef.current);
        headerAnimationTimerRef.current = null;
      }
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, []);

  // המרת התאריך בכל פעם שהוא משתנה
  useEffect(() => {
    if (gregorianDate) {
      convertDate();
    }
  }, [gregorianDate]);

  /**
   * המרת התאריך הלועזי לעברי
   */
  const convertDate = useCallback(() => {
    if (!gregorianDate) return;
    
    setLoading(true);
    
    // ניקוי טיימר קודם אם קיים
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    
    // השהייה קצרה לאפקט טעינה
    loadingTimerRef.current = setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          loadingTimerRef.current = null;
          return;
        }

        // המרת התאריך
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // קבלת היום בשבוע
        setDayOfWeek(getHebrewDayOfWeek(date));
        
        // בדיקה אם זהו מועד מיוחד
        const note = getDateNote(date);
        setDateNote(note);
        
        setError('');
        setLoading(false);
        loadingTimerRef.current = null;
      } catch (error) {
        console.error('שגיאה בהמרת התאריך:', error);
        setError('אירעה שגיאה בהמרת התאריך');
        setLoading(false);
        loadingTimerRef.current = null;
      }
    }, 300);
  }, [gregorianDate]);

  /**
   * טיפול בשינוי תאריך
   */
  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    
    if (newDate) {
      // בדיקת תקינות התאריך
      const [yearStr] = newDate.split('-');
      const year = parseInt(yearStr);
      
      if (isNaN(year) || year < 1800 || year > 2300) {
        setError('השנה חייבת להיות בטווח 1800-2300');
        return;
      }
    }
    
    setError('');
    setGregorianDate(newDate);
  }, []);
  
  // הגדרת קלאסים לכותרת
  const headerClasses = useMemo(() => `flex justify-between items-center mb-6 pb-4 border-b border-indigo-200 transition-all ${
    animateHeader ? 'transform -translate-y-1' : ''
  }`, [animateHeader]);

  // גרסת השנה הנוכחית
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl text-right" dir="rtl">
      {/* כותרת */}
      <div className={headerClasses}>
        <h1 className="text-3xl font-bold text-indigo-800 flex items-center">
          {/* איקון לוח שנה מוטמע ישירות */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>ממיר תאריכים עברי</span>
        </h1>
        
        <div className="text-xs text-indigo-400 bg-white bg-opacity-50 rounded-full px-3 py-1">
          גרסה 2.0
        </div>
      </div>
      
      {/* קלט תאריך */}
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {/* תצוגת התאריך העברי */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        note={dateNote}
        loading={loading}
        gregorianDate={gregorianDate}
      />
      
      {/* כותרת תחתונה */}
      <div className="mt-6 text-center text-indigo-400 text-xs">
        <p>פותח ע"י דוד-חן בן שבת• {currentYear}</p>
      </div>
    </div>
  );
};

export default HebrewDateConverter;