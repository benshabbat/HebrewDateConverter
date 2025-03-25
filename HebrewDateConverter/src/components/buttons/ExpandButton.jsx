import React from 'react';

/**
 * קומפוננטת כפתור הרחבה/צמצום
 * 
 * @param {boolean} expanded - האם התוכן מורחב
 * @param {function} onClick - פונקציה שתופעל בלחיצה
 * @returns {JSX.Element} - קומפוננטת React לכפתור הרחבה/צמצום
 */
const ExpandButton = ({ expanded, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-indigo-500 hover:text-indigo-700 transition-colors"
      aria-label={expanded ? "צמצם פרטי תאריך" : "הרחב פרטי תאריך"}
    >
      {expanded ? (
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
  );
};

export default ExpandButton;