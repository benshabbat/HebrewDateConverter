import React, { useState, useCallback, useMemo, useEffect } from 'react';
import DateHeader from './DateHeader';
import LoadingIndicator from './LoadingIndicator';
import useAnimation from '../hooks/useAnimation';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { formatGregorianDate } from '../utils/dateUtils';
import { HOLIDAY_TYPES } from '../constants/hebrewDates';

/**
 * קומפוננטה משופרת להצגת תאריך עברי עם תמיכה משופרת בחגים ומולטיפלטפורמה
 * 
 * @param {object} props - פרופס של הקומפוננטה
 * @param {string} props.hebrewDate - מחרוזת התאריך העברי
 * @param {string} props.dayOfWeek - יום בשבוע בעברית
 * @param {string|Object} props.note - מידע על חג (מחרוזת או אובייקט)
 * @param {boolean} props.loading - האם התאריך נטען
 * @param {string} props.gregorianDate - מחרוזת התאריך הלועזי (YYYY-MM-DD)
 * @param {boolean} props.isMobile - האם המכשיר הוא נייד
 * @returns {JSX.Element|null} - קומפוננטת React להצגת תאריך עברי
 */
const HebrewDateDisplay = (props) => {
  // חילוץ פרופס
  const { hebrewDate, dayOfWeek, note, loading, gregorianDate, isMobile } = props;
  
  // סטייט עבור הרחבה/צמצום
  const [dateExpanded, setDateExpanded] = useState(false);
  
  // הוקים מותאמים
  const isAnimating = useAnimation(700, hebrewDate);
  const [copied, copyToClipboard] = useCopyToClipboard(2000);
  
  // רישום לוגים לצורך דיבאג
  useEffect(() => {
    console.log('HebrewDateDisplay props:', { 
      hebrewDate, 
      dayOfWeek, 
      note,
      loading, 
      gregorianDate 
    });
  }, [hebrewDate, dayOfWeek, note, loading, gregorianDate]);
  
  // עיבוד מידע על חג - טיפול בפורמטים של מחרוזת ואובייקט
  const holidayInfo = useMemo(() => {
    if (!note) return null;
    
    console.log('Processing holiday note:', note);
    
    // אם המידע כבר במבנה אובייקט עם שדה סוג, השתמש בו ישירות
    if (typeof note === 'object' && note.name && note.type) {
      return note;
    }
    
    // אם זו מחרוזת, צור אובייקט פשוט עם סוג ברירת מחדל
    if (typeof note === 'string' && note.trim() !== '') {
      return {
        name: note,
        type: HOLIDAY_TYPES.SPECIAL_DAY // סוג ברירת מחדל
      };
    }
    
    return null;
  }, [note]);
  
  // פורמט תאריך לועזי להצגה
  const formattedGregorianDate = useMemo(() => {
    return formatGregorianDate(gregorianDate);
  }, [gregorianDate]);
  
  // החלפת מצב הרחבה/צמצום
  const toggleExpanded = useCallback((e) => {
    e.stopPropagation();
    setDateExpanded(prev => !prev);
  }, []);
  
  // טיפול בהעתקה ללוח
  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    
    // יצירת הטקסט להעתקה בהתבסס על המידע הזמין
    let textToCopy = `${dayOfWeek}, ${hebrewDate}`;
    
    // הוספת מידע על חג אם זמין
    if (holidayInfo && holidayInfo.name) {
      textToCopy += ` (${holidayInfo.name})`;
    }
    
    copyToClipboard(textToCopy);
  }, [dayOfWeek, hebrewDate, holidayInfo, copyToClipboard]);
  
  // הצגת מחוון טעינה כאשר טוען
  if (loading) {
    return <LoadingIndicator />;
  }
  
  // אל תרנדר כלום אם אין תאריך
  if (!hebrewDate) {
    return null;
  }
  
  // חישוב מחלקות CSS עבור אנימציה
  const cardClasses = `bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer
    ${dateExpanded ? 'ring-2 ring-indigo-300' : ''} 
    ${isAnimating ? 'scale-102 sm:scale-105' : ''}`;
  
  // קבלת מחלקות CSS עבור תגית החג בהתאם לסוג
  const getHolidayTagClasses = () => {
    if (!holidayInfo) return '';
    
    switch (holidayInfo.type) {
      case HOLIDAY_TYPES.MAJOR_HOLIDAY:
        return 'bg-red-100 text-red-800';
      case HOLIDAY_TYPES.MINOR_HOLIDAY:
        return 'bg-blue-100 text-blue-800';
      case HOLIDAY_TYPES.CHOL_HAMOED:
        return 'bg-purple-100 text-purple-800';
      case HOLIDAY_TYPES.REMEMBRANCE:
        return 'bg-gray-100 text-gray-800';
      case HOLIDAY_TYPES.INDEPENDENCE:
        return 'bg-blue-100 text-blue-800 border border-blue-500';
      case HOLIDAY_TYPES.FAST_DAY:
        return 'bg-gray-100 text-gray-800 border border-gray-400';
      case HOLIDAY_TYPES.ROSH_CHODESH:
        return 'bg-yellow-100 text-yellow-800';
      case HOLIDAY_TYPES.SHABBAT:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };
  
  return (
    <div 
      className={cardClasses}
      onClick={() => setDateExpanded(!dateExpanded)}
    >
      {/* כותרת כרטיס */}
      <DateHeader dayOfWeek={dayOfWeek} />
      
      {/* תוכן כרטיס */}
      <div className="p-4 sm:p-6">
        {/* תאריך עברי */}
        <div className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-indigo-900 leading-tight">
          {hebrewDate}
        </div>
        
        {/* תגית חג - עם בדיקה מקיפה */}
        {holidayInfo && holidayInfo.name && (
          <div className="flex justify-center mb-3 sm:mb-4">
            <span className={`${getHolidayTagClasses()} text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-center break-words max-w-full`}>
              {holidayInfo.name}
            </span>
          </div>
        )}
        
        {/* תוכן מורחב */}
        <div className={`mt-3 sm:mt-4 overflow-hidden transition-all duration-300 ${
          dateExpanded ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-3 sm:pt-4 border-t border-indigo-100 text-xs sm:text-sm text-indigo-700 space-y-1 sm:space-y-2">
            <p className="flex flex-wrap">
              <span className="font-medium ml-1">תאריך לועזי:</span>
              <span>{formattedGregorianDate}</span>
            </p>
            {holidayInfo && holidayInfo.name && (
              <p className="flex flex-wrap">
                <span className="font-medium ml-1">מועד מיוחד:</span>
                <span>{holidayInfo.name}</span>
              </p>
            )}
            <p className="text-xs text-indigo-500 mt-1 sm:mt-2">
              לחץ על הכרטיס כדי {dateExpanded ? 'לצמצם' : 'להרחיב'} את פרטי התאריך
            </p>
          </div>
        </div>
        
        {/* כפתורי פעולה */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center sm:justify-start text-xs font-medium px-3 py-1.5 rounded-lg transition-all w-full sm:w-auto ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  הועתק!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  העתק תאריך
                </>
              )}
            </button>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={toggleExpanded}
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
              aria-label={dateExpanded ? "צמצם פרטי תאריך" : "הרחב פרטי תאריך"}
            >
              {dateExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HebrewDateDisplay;