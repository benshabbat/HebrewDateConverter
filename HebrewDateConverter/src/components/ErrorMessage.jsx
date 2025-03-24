import React from 'react';

/**
 * קומפוננטת הודעת שגיאה
 * 
 * @param {string} message - הודעת השגיאה להצגה
 * @returns {JSX.Element|null} - רכיב React להודעת שגיאה או null אם אין הודעה
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {message}
    </div>
  );
};

export default ErrorMessage;