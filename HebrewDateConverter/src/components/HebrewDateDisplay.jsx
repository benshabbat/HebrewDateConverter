import React, { useState, useCallback, useMemo, useEffect } from 'react';
import DateHeader from './DateHeader';
import DateContent from './DateContent';
import LoadingIndicator from './LoadingIndicator';
import useAnimation from '../hooks/useAnimation';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { formatGregorianDate, getFullDateString } from '../utils/dateUtils';

/**
 * קומפוננטה משופרת להצגת התאריך העברי
 * 
 * @param {object} props - כל הפרופים של הקומפוננטה 
 * @returns {JSX.Element|null} - קומפוננטת React לתצוגת תאריך עברי
 */
const HebrewDateDisplay = (props) => {
  // שימוש בפרופים בלי דסטרקטורינג מורכב
  const hebrewDate = props.hebrewDate;
  const dayOfWeek = props.dayOfWeek;
  const note = props.note;        // שם החג/המועד המיוחד
  const loading = props.loading;
  const gregorianDate = props.gregorianDate;
  
  // מצב הרחבה/צמצום
  const [dateExpanded, setDateExpanded] = useState(false);
  
  // שימוש בהוקים מותאמים
  const isAnimating = useAnimation(700, hebrewDate);
  const [copied, copyToClipboard] = useCopyToClipboard(2000);
  
  // לוגינג לצורך דיבוג - לראות מה ערך ה-note שמגיע
  useEffect(() => {
    console.log('HebrewDateDisplay props:', { 
      hebrewDate, 
      dayOfWeek, 
      note,
      loading, 
      gregorianDate 
    });
  }, [hebrewDate, dayOfWeek, note, loading, gregorianDate]);
  
  // המרת התאריך הלועזי לפורמט מקובל בעברית
  const formattedGregorianDate = useMemo(() => {
    return formatGregorianDate(gregorianDate);
  }, [gregorianDate]);
  
  // החלפת מצב הרחבה/צמצום
  const toggleExpanded = useCallback((e) => {
    e.stopPropagation();
    setDateExpanded(prev => !prev);
  }, []);
  
  // העתקת התאריך ללוח
  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    
    const textToCopy = getFullDateString(dayOfWeek, hebrewDate, note);
    copyToClipboard(textToCopy);
  }, [dayOfWeek, hebrewDate, note, copyToClipboard]);
  
  // אם בטעינה, מציג אינדיקטור
  if (loading) {
    return <LoadingIndicator />;
  }
  
  // אם אין תאריך, לא מציג כלום
  if (!hebrewDate) {
    return null;
  }
  
  // חישוב קלאסים לאנימציה
  const cardClasses = `bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl cursor-pointer
    ${dateExpanded ? 'ring-2 ring-indigo-300' : ''} 
    ${isAnimating ? 'scale-102 sm:scale-105' : ''}`;
  
  return (
    <div 
      className={cardClasses}
      onClick={() => setDateExpanded(!dateExpanded)}
    >
      {/* כותרת הכרטיס */}
      <DateHeader dayOfWeek={dayOfWeek} />
      
      {/* תוכן הכרטיס - העברת ערך ה-note בצורה מפורשת */}
      <DateContent 
        hebrewDate={hebrewDate}
        dateNote={note}
        formattedGregorianDate={formattedGregorianDate}
        expanded={dateExpanded}
        copied={copied}
        handleCopy={handleCopy}
        toggleExpanded={toggleExpanded}
      />
    </div>
  );
};

export default HebrewDateDisplay;