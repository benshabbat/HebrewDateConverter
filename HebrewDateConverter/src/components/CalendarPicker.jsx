import React from 'react';
import { formatDate, hebrewMonths, weekDays } from './hebrewDateUtils';

/**
 * Calendar Picker component for selecting dates
 * @param {Object} props
 * @param {Date} props.currentMonth - Current month displayed in calendar
 * @param {Function} props.onSelectDate - Callback when a date is selected
 * @param {Function} props.onPrevMonth - Callback to go to previous month
 * @param {Function} props.onNextMonth - Callback to go to next month
 * @param {string} props.selectedDate - Currently selected date (yyyy-MM-dd)
 */
const CalendarPicker = ({ 
  currentMonth, 
  onSelectDate, 
  onPrevMonth, 
  onNextMonth, 
  selectedDate 
}) => {
  /**
   * Generates an array of dates to display in the calendar
   * @returns {Array} Array of Date objects or nulls for the current month view
   */
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Array for calendar cells
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="absolute z-10 mt-1 w-64 -left-24 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden">
      <div className="p-3">
        {/* Calendar Header */}
        <div className="flex justify-between items-center px-1 py-2 border-b border-indigo-100">
          <button 
            type="button"
            onClick={onPrevMonth}
            className="p-1 rounded-full hover:bg-indigo-100 text-indigo-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="font-medium text-indigo-800">
            {hebrewMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1 rounded-full hover:bg-indigo-100 text-indigo-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-indigo-500 p-1">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, i) => (
            <div key={i} className="p-1 text-center">
              {day ? (
                <button
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    formatDate(day) === selectedDate
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-100 text-gray-700'
                  }`}
                >
                  {day.getDate()}
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;