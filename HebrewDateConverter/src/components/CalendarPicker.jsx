import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getDaysInMonth, parseDateString, formatDateString } from '../utils/dateUtils';

export const CalendarPicker = ({ selectedDate, onSelectDate, onClose }) => {
  // Extract current date, or use today
  const today = new Date();
  
  const defaultDate = useMemo(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      return isNaN(date.getTime()) ? today : date;
    }
    return today;
  }, [selectedDate]);

  // States for current month and year
  const [currentMonth, setCurrentMonth] = useState(defaultDate.getMonth());
  const [currentYear, setCurrentYear] = useState(defaultDate.getFullYear());
  const [touchStartX, setTouchStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);

  // Hebrew day names - shortened for mobile, full for larger screens
  const days = [
    { short: 'א', full: 'ראשון' },
    { short: 'ב', full: 'שני' },
    { short: 'ג', full: 'שלישי' },
    { short: 'ד', full: 'רביעי' },
    { short: 'ה', full: 'חמישי' },
    { short: 'ו', full: 'שישי' },
    { short: 'ש', full: 'שבת' }
  ];

  // Hebrew month names
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  // Change month with animation
  const changeMonth = useCallback((offset) => {
    // Set animation direction
    setAnimationDirection(offset > 0 ? 'right' : 'left');
    setIsAnimating(true);
    
    // After a short delay, actually change the month
    setTimeout(() => {
      let newMonth = currentMonth + offset;
      let newYear = currentYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }

      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      setIsAnimating(false);
    }, 150);
  }, [currentMonth, currentYear]);

  // Build array of days for current month
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Calculate first day - in Israel Sunday is first day of week
    // while getDay returns 0 for Sunday
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Array of all days in calendar
    const calendarDays = [];
    
    // Days from previous month
    const prevMonthDays = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1
    );
    
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthDays - i,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false
      });
    }
    
    // Days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    // Days from next month
    const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false
      });
    }
    
    return calendarDays;
  }, [currentMonth, currentYear]);

  // Check if a date is the selected date
  const isSelectedDate = useCallback((day, month, year) => {
    if (!selectedDate) return false;
    
    const selected = parseDateString(selectedDate);
    return (
      parseInt(selected.day) === day &&
      parseInt(selected.month) - 1 === month &&
      parseInt(selected.year) === year
    );
  }, [selectedDate]);

  // Check if a date is today
  const isToday = useCallback((day, month, year) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  }, [today]);

  // Handle date selection
  const handleDateClick = useCallback((day, month, year) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const formattedDate = formatDateString(year.toString(), paddedMonth, paddedDay);
    
    // Add a small haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(5); // subtle 5ms vibration
    }
    
    onSelectDate(formattedDate);
  }, [onSelectDate]);

  // Touch support for swipe between months
  const handleTouchStart = useCallback((e) => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // If user swiped far enough (more than 40px)
    if (Math.abs(diff) > 40) {
      // Negative is right to left (prev month), positive is left to right (next month)
      changeMonth(diff > 0 ? 1 : -1);
    }
    
    setTouchStartX(null);
  }, [touchStartX, changeMonth]);

  // Add keyboard listeners for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        changeMonth(1); // In Hebrew it's reversed, left arrow moves forward
      } else if (e.key === 'ArrowRight') {
        changeMonth(-1); // In Hebrew it's reversed, right arrow moves backward
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMonth, currentYear, onClose, changeMonth]);

  // Format month and year string
  const formatMonthYear = () => {
    return `${months[currentMonth]} ${currentYear}`;
  };

  // Animation classes based on direction
  const animationClasses = useMemo(() => {
    if (!isAnimating) return '';
    
    return animationDirection === 'right'
      ? 'animate-slide-right'
      : 'animate-slide-left';
  }, [isAnimating, animationDirection]);

  // Render calendar
  return (
    <div 
      className="bg-white rounded-lg shadow-lg border border-indigo-200 overflow-hidden w-72 sm:w-80 md:w-96"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="בחירת תאריך"
    >
      {/* Calendar header - month and year row */}
      <div className="flex justify-between items-center bg-indigo-600 text-white p-3">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-indigo-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="החודש הקודם"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className={`text-lg font-bold transition-opacity ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {formatMonthYear()}
        </div>
        
        <button 
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-indigo-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="החודש הבא"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-indigo-100 text-indigo-600 text-center">
        {days.map((day, index) => (
          <div key={index} className="py-1">
            <span className="hidden sm:inline">{day.full}</span>
            <span className="sm:hidden">{day.short}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className={`grid grid-cols-7 gap-1 p-2 transition-transform duration-150 ${animationClasses}`}>
        {calendarDays.map((dateObj, index) => {
          const isSelected = isSelectedDate(dateObj.day, dateObj.month, dateObj.year);
          const isTodayDate = isToday(dateObj.day, dateObj.month, dateObj.year);
          
          // Determine cell styling based on selection, current date, etc.
          const cellClasses = `
            p-1 sm:p-2 h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-full text-sm
            ${!dateObj.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
            ${isSelected ? 'bg-indigo-600 text-white' : ''}
            ${!isSelected && isTodayDate ? 'border border-indigo-600' : ''}
            ${!isSelected && !isTodayDate ? 'hover:bg-indigo-100 active:bg-indigo-200' : ''}
            transition-colors touch-manipulation
          `;
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(dateObj.day, dateObj.month, dateObj.year)}
              className={cellClasses}
              aria-selected={isSelected}
              aria-label={`${dateObj.day}/${dateObj.month + 1}/${dateObj.year}`}
              tabIndex={dateObj.isCurrentMonth ? 0 : -1}
            >
              {dateObj.day}
            </button>
          );
        })}
      </div>
      
      {/* Action buttons - today/close */}
      <div className="flex justify-between border-t border-indigo-200 p-2">
        <button
          onClick={() => {
            setCurrentMonth(today.getMonth());
            setCurrentYear(today.getFullYear());
          }}
          className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          היום
        </button>
        
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          סגור
        </button>
      </div>
    </div>
  );
};