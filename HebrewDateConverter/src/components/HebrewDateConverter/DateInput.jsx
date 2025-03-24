// src/components/HebrewDateConverter/DateInput.jsx
import React from 'react';

const DateInput = ({ value, onChange, error }) => {
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
  
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-md font-bold mb-3" htmlFor="gregorian-date">
        הזן תאריך לועזי:
      </label>
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
      {error && (
        <p id="date-error" className="text-red-500 text-sm mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default DateInput;