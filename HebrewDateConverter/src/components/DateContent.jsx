import React, { useEffect } from 'react';
import ExpandedContent from './ExpandedContent';
import DateActions from './DateActions';

/**
 * קומפוננטת תוכן לוח תאריך עברי
 * 
 * @param {string} hebrewDate - התאריך העברי
 * @param {string} dateNote - מועד מיוחד (אופציונלי)
 * @param {string} formattedGregorianDate - תאריך לועזי מפורמט
 * @param {boolean} expanded - האם התוכן מורחב
 * @param {boolean} copied - האם הועתק ללוח
 * @param {function} handleCopy - פונקציה להעתקה ללוח
 * @param {function} toggleExpanded - פונקציה להרחבה/צמצום
 * @returns {JSX.Element} - קומפוננטת React לתוכן לוח תאריך
 */
const DateContent = ({ 
  hebrewDate, 
  dateNote, 
  formattedGregorianDate, 
  expanded, 
  copied, 
  handleCopy, 
  toggleExpanded 
}) => {
  // לוגינג לצורך דיבוג
  useEffect(() => {
    console.log('DateContent props:', { 
      hebrewDate, 
      dateNote, 
      formattedGregorianDate
    });
  }, [hebrewDate, dateNote, formattedGregorianDate]);
  
  return (
    <div className="p-4 sm:p-6">
      {/* התאריך העברי */}
      <div className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-indigo-900 leading-tight">
        {hebrewDate}
      </div>
      
      {/* תגית מועד מיוחד - עם בדיקה יסודית יותר */}
      {(dateNote && dateNote.trim() !== '') && (
        <div className="flex justify-center mb-3 sm:mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-center break-words max-w-full">
            {dateNote}
          </span>
        </div>
      )}
      
      {/* מידע מורחב */}
      <ExpandedContent 
        expanded={expanded}
        gregorianDate={formattedGregorianDate}
        dateNote={dateNote}
      />
      
      {/* פעולות */}
      <DateActions 
        copied={copied}
        onCopy={handleCopy}
        expanded={expanded}
        onExpand={toggleExpanded}
      />
    </div>
  );
};

export default DateContent;