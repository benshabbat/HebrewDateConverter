// src/components/HebrewDateConverter/DateInput.jsx
import React, { useState } from 'react';

const DateInput = ({ value, onChange, error }) => {
  // State to track which input mode is active
  const [inputMode, setInputMode] = useState('custom'); // 'custom' or 'native'
  
  // Extract date parts
  const dateParts = value ? value.split('-') : ['', '', ''];
  const [yearValue, monthValue, dayValue] = dateParts;
  
  // Helper function to get max days in a month
  const getMaxDaysInMonth = (year, month) => {
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    
    // February special case
    if (monthInt === 2) {
      return ((yearInt % 4 === 0 && yearInt % 100 !== 0) || yearInt % 400 === 0) ? 29 : 28;
    }
    
    // 30 days months: April, June, September, November
    if ([4, 6, 9, 11].includes(monthInt)) {
      return 30;
    }
    
    // All other months have 31 days
    return 31;
  };
  
  // Generate appropriate number of day options based on month
  const getDaysForMonth = (year, month) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const maxDays = getMaxDaysInMonth(year, month);
    return Array.from({ length: maxDays }, (_, i) => i + 1);
  };
  
  // Handle individual field changes
  const handleYearChange = (e) => {
    let year = e.target.value;
    // Enforce min/max directly on input
    if (year !== '' && parseInt(year) < 1300) year = '1300';
    if (year !== '' && parseInt(year) > 2500) year = '2500';
    
    const newDate = `${year}-${monthValue || '01'}-${dayValue || '01'}`;
    onChange({ target: { value: newDate } });
  };
  
  const handleMonthChange = (e) => {
    const month = e.target.value;
    const year = yearValue || '2023';
    let day = dayValue || '01';
    
    // Check if we need to adjust the day for this month
    const maxDaysInMonth = getMaxDaysInMonth(year, month);
    if (parseInt(day) > maxDaysInMonth) {
      day = maxDaysInMonth.toString().padStart(2, '0');
    }
    
    const newDate = `${year}-${month}-${day}`;
    onChange({ target: { value: newDate } });
  };
  
  const handleDayChange = (e) => {
    const day = e.target.value;
    const year = yearValue || '2023';
    const month = monthValue || '01';
    
    // Validate the day against the month immediately
    const maxDaysInMonth = getMaxDaysInMonth(year, month);
    if (parseInt(day) > maxDaysInMonth) {
      // Don't allow selection of invalid days
      const validDay = maxDaysInMonth.toString().padStart(2, '0');
      const newDate = `${year}-${month}-${validDay}`;
      onChange({ target: { value: newDate } });
      return;
    }
    
    const newDate = `${year}-${month}-${day}`;
    onChange({ target: { value: newDate } });
  };
  
  // Handle change in native date picker
  const handleNativeDateChange = (e) => {
    // Direct pass-through to parent
    onChange(e);
  };
  
  // Toggle between input modes
  const toggleInputMode = () => {
    setInputMode(inputMode === 'custom' ? 'native' : 'custom');
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-gray-700 text-md font-bold" htmlFor="gregorian-date">
          הזן תאריך לועזי:
        </label>
        <button 
          type="button"
          onClick={toggleInputMode}
          className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors"
        >
          {inputMode === 'custom' ? 'השתמש בבורר תאריכים' : 'השתמש בשדות נפרדים'}
        </button>
      </div>
      
      {/* Native date input */}
      {inputMode === 'native' && (
        <div className="relative">
          <input
            id="gregorian-date"
            type="date"
            className="shadow-md appearance-none border-2 border-indigo-100 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-indigo-400 focus:shadow-outline transition-all"
            value={value}
            onChange={handleNativeDateChange}
            aria-describedby="date-error"
            min="1300-01-01" 
            max="2500-12-31"
            onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>
      )}
      
      {/* Custom date input */}
      {inputMode === 'custom' && (
        <div className="flex space-x-2 rtl:space-x-reverse">
          <div className="w-1/3 relative">
            <label className="block text-gray-500 text-xs mb-1" htmlFor="year-input">
              שנה
            </label>
            <input
              id="year-input"
              type="number"
              min="1300"
              max="2500"
              className="shadow-md appearance-none border-2 border-indigo-100 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-indigo-400 focus:shadow-outline transition-all"
              value={yearValue}
              onChange={handleYearChange}
              placeholder="שנה"
            />
          </div>
          <div className="w-1/3 relative">
            <label className="block text-gray-500 text-xs mb-1" htmlFor="month-input">
              חודש
            </label>
            <select
              id="month-input"
              className="shadow-md appearance-none border-2 border-indigo-100 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-indigo-400 focus:shadow-outline transition-all"
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
          <div className="w-1/3 relative">
            <label className="block text-gray-500 text-xs mb-1" htmlFor="day-input">
              יום
            </label>
            <select
              id="day-input"
              className="shadow-md appearance-none border-2 border-indigo-100 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-indigo-400 focus:shadow-outline transition-all"
              value={dayValue}
              onChange={handleDayChange}
            >
              {getDaysForMonth(yearValue, monthValue).map(day => (
                <option key={day} value={day.toString().padStart(2, '0')}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {error && (
        <p id="date-error" className="text-red-500 text-sm mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default DateInput;