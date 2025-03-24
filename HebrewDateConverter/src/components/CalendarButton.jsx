import React, { useState, useEffect, useRef } from 'react';
import CalendarPicker from './CalendarPicker';

/**
 * קומפוננטת כפתור לוח שנה עם חלון צף
 * 
 * @param {string} selectedDate - התאריך הנבחר (YYYY-MM-DD)
 * @param {function} onSelectDate - פונקציה שתקרא כאשר נבחר תאריך מהלוח
 * @returns {JSX.Element} - רכיב React לכפתור לוח שנה
 */
const CalendarButton = ({ selectedDate, onSelectDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarButtonRef = useRef(null);
  
  // פתיחה/סגירה של לוח השנה
  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };
  
  // סגירת לוח השנה כשלוחצים מחוץ לאזור
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarButtonRef.current && !calendarButtonRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    
    // רק אם הלוח פתוח, מוסיף את האזנת האירוע
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCalendar]);
  
  // טיפול בבחירת תאריך מהלוח
  const handleDateSelected = (date) => {
    if (date) {
      onSelectDate(date);
    }
    
    setShowCalendar(false);
  };
  
  return (
    <div className="mr-2 flex items-end pb-1 relative" ref={calendarButtonRef}>
      <button
        type="button"
        onClick={toggleCalendar}
        className="flex items-center justify-center p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="בחר תאריך מלוח שנה"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      
      {/* לוח שנה - מיקום מתוקן, מתחת וצמוד לכפתור */}
      {showCalendar && (
        <div className="absolute top-full mt-1 right-0 z-50">
          <CalendarPicker 
            selectedDate={selectedDate}
            onSelectDate={handleDateSelected}
            onClose={() => setShowCalendar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarButton;