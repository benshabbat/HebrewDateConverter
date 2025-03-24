import React, { useState } from 'react';
import CalendarPicker from './CalendarPicker';
import { formatDate, getDaysInMonth } from './hebrewDateUtils';

/**
 * Date input component with year, month, and day inputs
 * @param {Object} props
 * @param {string} props.value - Date string in yyyy-MM-dd format
 * @param {Function} props.onChange - Function called when date changes
 * @param {string} props.error - Error message to display
 */
const DateInput = ({ value, onChange, error }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  );
  
  // Extract date parts
  const dateParts = value ? value.split('-') : ['', '', ''];
  const [yearValue, monthValue, dayValue] = dateParts;

  /**
   * Handles year input change
   * @param {Event} e - Input change event
   */
  const handleYearChange = (e) => {
    let year = e.target.value;
    
    // Limit to 4 digits
    if (year.length > 4) year = year.slice(0, 4);
    
    const month = monthValue || '01';
    const day = dayValue || '01';
    
    const newDate = `${year}-${month}-${day}`;
    onChange(newDate);
  };

  /**
   * Handles month selection change
   * @param {Event} e - Select change event
   */
  const handleMonthChange = (e) => {
    const month = e.target.value;
    const year = yearValue || new Date().getFullYear().toString();
    const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month) - 1);
    let day = dayValue || '01';
    
    // Adjust day if it exceeds the days in the month
    if (parseInt(day) > daysInMonth) {
      day = daysInMonth.toString().padStart(2, '0');
    }
    
    const newDate = `${year}-${month}-${day}`;
    onChange(newDate);
  };

  /**
   * Handles day selection change
   * @param {Event} e - Select change event
   */
  const handleDayChange = (e) => {
    const day = e.target.value;
    const year = yearValue || new Date().getFullYear().toString();
    const month = monthValue || '01';
    
    const newDate = `${year}-${month}-${day}`;
    onChange(newDate);
  };

  /**
   * Handles date selection from calendar
   * @param {Date} date - Selected date
   */
  const handleCalendarSelect = (date) => {
    onChange(formatDate(date));
    setShowCalendar(false);
  };

  /**
   * Go to previous month in calendar
   */
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  /**
   * Go to next month in calendar
   */
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <div className="mb-8">
      <label className="block text-indigo-800 text-lg font-bold mb-3">
        בחר תאריך לועזי:
      </label>
      
      <div className="flex space-x-3 rtl:space-x-reverse">
        {/* Year Input */}
        <div className="w-1/3">
          <label className="block text-indigo-600 text-sm font-medium mb-1">שנה</label>
          <input
            type="number"
            min="1900"
            max="2100"
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md"
            value={yearValue}
            onChange={handleYearChange}
            placeholder="שנה"
          />
        </div>
        
        {/* Month Input */}
        <div className="w-1/3">
          <label className="block text-indigo-600 text-sm font-medium mb-1">חודש</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md appearance-none"
            value={monthValue}
            onChange={handleMonthChange}
          >
            <option value="01">ינואר</option>
            <option value="02">פברואר</option>
            <option value="03">מרץ</option>
            <option value="04">אפריל</option>
            <option value="05">מאי</option>
            <option value="06">יוני</option>
            <option value="07">יולי</option>
            <option value="08">אוגוסט</option>
            <option value="09">ספטמבר</option>
            <option value="10">אוקטובר</option>
            <option value="11">נובמבר</option>
            <option value="12">דצמבר</option>
          </select>
        </div>
        
        {/* Day Input */}
        <div className="w-1/3 relative">
          <label className="block text-indigo-600 text-sm font-medium mb-1">יום</label>
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md appearance-none"
              value={dayValue}
              onChange={handleDayChange}
            >
              {Array.from(
                { length: getDaysInMonth(
                  parseInt(yearValue || new Date().getFullYear()), 
                  parseInt(monthValue || '1') - 1
                ) },
                (_, i) => (i + 1).toString().padStart(2, '0')
              ).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            <button
              type="button"
              className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-indigo-600 hover:text-indigo-800 focus:outline-none"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          {/* Calendar Popup */}
          {showCalendar && (
            <CalendarPicker 
              currentMonth={currentMonth}
              onSelectDate={handleCalendarSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              selectedDate={value}
            />
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default DateInput;