import React, { useState, useRef } from 'react';
import { CalendarPicker } from '../CalendarPicker';
import { useClickOutside } from '../../hooks/useClickOutside';

export const CalendarButton = ({ selectedDate, onSelectDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarButtonRef = useRef(null);
  
  // Toggle calendar open/close
  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };
  
  // Close calendar
  const closeCalendar = () => {
    setShowCalendar(false);
  };
  
  // Use custom hook to close on click outside - also supports touch for mobile
  useClickOutside(calendarButtonRef, () => {
    setShowCalendar(false);
  }, [showCalendar]);
  
  // Handle date selection from calendar
  const handleDateSelected = (date) => {
    if (date) {
      onSelectDate(date);
    }
    
    closeCalendar();
  };
  
  return (
    <div className="flex items-end pb-1 relative" ref={calendarButtonRef}>
      <button
        type="button"
        onClick={toggleCalendar}
        className="flex items-center justify-center p-3 w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="בחר תאריך מלוח שנה"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      
      {/* Calendar - positioned below and aligned to button */}
      {showCalendar && (
        <div className="fixed sm:absolute top-1/2 left-1/2 sm:top-full sm:left-0 transform -translate-x-1/2 -translate-y-1/2 sm:translate-y-0 sm:translate-x-0 sm:mt-1 z-50">
          <div className="max-w-full">
            <CalendarPicker 
              selectedDate={selectedDate}
              onSelectDate={handleDateSelected}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};