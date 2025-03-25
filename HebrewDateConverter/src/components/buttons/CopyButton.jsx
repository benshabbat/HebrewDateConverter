import React from 'react';

/**
 * קומפוננטת כפתור העתקה - מותאמת למולטי-פלטפורם
 * 
 * @param {boolean} copied - האם הועתק ללוח
 * @param {function} onClick - פונקציה שתופעל בלחיצה
 * @returns {JSX.Element} - קומפוננטת React לכפתור העתקה
 */
const CopyButton = ({ copied, onClick }) => {
  const buttonClasses = `flex items-center justify-center sm:justify-start text-xs font-medium px-3 py-1.5 rounded-lg transition-all w-full sm:w-auto ${
    copied 
      ? 'bg-green-100 text-green-700' 
      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClasses}
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
  );
};

export default CopyButton;