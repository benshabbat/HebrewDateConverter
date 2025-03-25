import React from 'react';

/**
 * קומפוננטת כותרת לוח תאריך עברי - רספונסיבית
 * 
 * @param {string} dayOfWeek - יום בשבוע
 * @returns {JSX.Element} - קומפוננטת React לכותרת לוח
 */
const DateHeader = ({ dayOfWeek }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg sm:text-xl font-bold flex items-center space-x-2 rtl:space-x-reverse mb-2 sm:mb-0">
          {/* איקון לוח שנה - מוטמע ישירות */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>התאריך העברי</span>
        </h2>
        <span className="text-sm bg-white bg-opacity-30 px-3 py-1 rounded-full self-start sm:self-auto">
          {dayOfWeek}
        </span>
      </div>
    </div>
  );
};

export default DateHeader;