import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * קומפוננטה משופרת להצגת התאריך העברי - עם איקונים מוטמעים
 */
const HebrewDateDisplay = ({ hebrewDate, dayOfWeek, note: dateNote, loading, gregorianDate }) => {
  const [dateExpanded, setDateExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animation, setAnimation] = useState(false);
  
  // שמירת מזהה האנימציה לניקוי בעת צורך
  const animationTimerRef = React.useRef(null);
  const copyTimerRef = React.useRef(null);
  
  // אנימציה בכל פעם שהתאריך מתעדכן - ניקוי טיימרים בעת הצורך
  useEffect(() => {
    if (hebrewDate) {
      setAnimation(true);
      
      // ניקוי טיימר קודם אם קיים
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      animationTimerRef.current = setTimeout(() => {
        setAnimation(false);
        animationTimerRef.current = null;
      }, 700);
    }
    
    // ניקוי בעת סיום
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [hebrewDate]);
  
  // העתקת התאריך ללוח - פונקציה מוגדרת פעם אחת
  const copyToClipboard = useCallback((e) => {
    e.stopPropagation();
    
    const textToCopy = dateNote 
      ? `${dayOfWeek}, ${hebrewDate} (${dateNote})`
      : `${dayOfWeek}, ${hebrewDate}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        
        // ניקוי טיימר קודם אם קיים
        if (copyTimerRef.current) {
          clearTimeout(copyTimerRef.current);
        }
        
        copyTimerRef.current = setTimeout(() => {
          setCopied(false);
          copyTimerRef.current = null;
        }, 2000);
      })
      .catch(err => {
        console.error('שגיאה בהעתקה: ', err);
      });
  }, [dayOfWeek, hebrewDate, dateNote]);
  
  // ניקוי טיימרים בעת הסרת הקומפוננטה
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
        copyTimerRef.current = null;
      }
    };
  }, []);
  
  // החלפת מצב הרחבה/צמצום - פונקציה מוגדרת פעם אחת
  const toggleExpanded = useCallback((e) => {
    e.stopPropagation();
    setDateExpanded(prev => !prev);
  }, []);
  
  // המרת התאריך הלועזי לפורמט מקובל בעברית - ממוכרז לשיפור ביצועים
  const formattedGregorianDate = useMemo(() => {
    if (!gregorianDate) return '';
    
    const [year, month, day] = gregorianDate.split('-');
    return `${day}/${month}/${year}`;
  }, [gregorianDate]);
  
  // אם בטעינה, מציג אינדיקטור
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-white bg-opacity-75 rounded-xl shadow-md">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">מחשב תאריך עברי...</p>
      </div>
    );
  }
  
  // אם אין תאריך, לא מציג כלום
  if (!hebrewDate) {
    return null;
  }
  
  // חישוב קלאסים לאנימציה - ללא חישוב מחדש בכל רינדור
  const cardClasses = `bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl cursor-pointer
    ${dateExpanded ? 'ring-2 ring-indigo-300' : ''} 
    ${animation ? 'scale-105' : ''}`;
  
  const expandedContentClasses = `mt-4 overflow-hidden transition-all duration-300 ${
    dateExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
  }`;
  
  const copyButtonClasses = `flex items-center text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
    copied 
      ? 'bg-green-100 text-green-700' 
      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
  }`;
  
  return (
    <div 
      className={cardClasses}
      onClick={() => setDateExpanded(!dateExpanded)}
    >
      {/* כותרת הכרטיס */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center space-x-2 rtl:space-x-reverse">
            {/* איקון לוח שנה - מוטמע ישירות */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>התאריך העברי</span>
          </h2>
          <span className="text-sm bg-white bg-opacity-30 px-3 py-1 rounded-full">
            {dayOfWeek}
          </span>
        </div>
      </div>
      
      {/* תוכן הכרטיס */}
      <div className="p-6">
        {/* התאריך העברי */}
        <div className="text-3xl font-bold text-center mb-4 text-indigo-900 leading-tight">
          {hebrewDate}
        </div>
        
        {/* תגית מועד מיוחד - רק אם יש מועד מיוחד */}
        {dateNote && (
          <div className="flex justify-center mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full">
              {dateNote}
            </span>
          </div>
        )}
        
        {/* מידע מורחב - האנימציה מתבצעת באמצעות קלאסים */}
        <div className={expandedContentClasses}>
          <div className="pt-4 border-t border-indigo-100 text-sm text-indigo-700 space-y-2">
            <p>
              <span className="font-medium ml-1">תאריך לועזי:</span>
              {formattedGregorianDate}
            </p>
            {dateNote && (
              <p>
                <span className="font-medium ml-1">מועד מיוחד:</span>
                {dateNote}
              </p>
            )}
            <p className="text-xs text-indigo-500 mt-2">
              לחץ על הכרטיס כדי {dateExpanded ? 'לצמצם' : 'להרחיב'} את פרטי התאריך
            </p>
          </div>
        </div>
        
        {/* פעולות */}
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={copyToClipboard}
            className={copyButtonClasses}
          >
            {copied ? (
              <>
                {/* איקון V - מוטמע ישירות */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                הועתק!
              </>
            ) : (
              <>
                {/* איקון העתקה - מוטמע ישירות */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                העתק תאריך
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleExpanded}
            className="text-indigo-500 hover:text-indigo-700 transition-colors"
            aria-label={dateExpanded ? "צמצם פרטי תאריך" : "הרחב פרטי תאריך"}
          >
            {dateExpanded ? (
              // איקון חץ למעלה - מוטמע ישירות
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              // איקון חץ למטה - מוטמע ישירות
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HebrewDateDisplay;