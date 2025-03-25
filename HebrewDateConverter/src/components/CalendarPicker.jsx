import React, { useState, useEffect } from 'react';
import { getDaysInMonth, parseDateString, formatDateString } from '../utils/dateUtils';

/**
 * קומפוננטת לוח שנה רספונסיבית - תומכת במולטי-פלטפורם
 * 
 * @param {string} selectedDate - התאריך הנבחר (YYYY-MM-DD)
 * @param {function} onSelectDate - פונקציה שתקרא כאשר נבחר תאריך
 * @param {function} onClose - פונקציה לסגירת הלוח
 * @returns {JSX.Element} - רכיב React ללוח שנה מותאם למובייל
 */
const CalendarPicker = ({ selectedDate, onSelectDate, onClose }) => {
  // חילוץ התאריך הנוכחי, או שימוש בתאריך של היום
  const today = new Date();
  
  const defaultDate = selectedDate 
    ? new Date(selectedDate) 
    : new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // מצבים לשנה וחודש הנוכחיים בלוח
  const [currentMonth, setCurrentMonth] = useState(defaultDate.getMonth());
  const [currentYear, setCurrentYear] = useState(defaultDate.getFullYear());
  const [touchStartX, setTouchStartX] = useState(null);

  // השמות של ימי השבוע בעברית - קצר למובייל, מלא למסכים גדולים
  const days = [
    { short: 'א', full: 'ראשון' },
    { short: 'ב', full: 'שני' },
    { short: 'ג', full: 'שלישי' },
    { short: 'ד', full: 'רביעי' },
    { short: 'ה', full: 'חמישי' },
    { short: 'ו', full: 'שישי' },
    { short: 'ש', full: 'שבת' }
  ];

  // השמות של החודשים בעברית
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  // החלפת חודש
  const changeMonth = (offset) => {
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
  };

  // בניית מערך הימים לחודש הנוכחי
  const buildCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // חישוב היום הראשון - בישראל יום ראשון הוא היום הראשון בשבוע
    // בעוד ש-getDay מחזיר 0 עבור יום ראשון
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // מערך של כל הימים בלוח
    const calendarDays = [];
    
    // ימים מהחודש הקודם
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
    
    // ימים מהחודש הנוכחי
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    // ימים מהחודש הבא
    const remainingDays = 42 - calendarDays.length; // 6 שורות של 7 ימים
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false
      });
    }
    
    return calendarDays;
  };

  // האם תאריך מסוים הוא התאריך שנבחר
  const isSelectedDate = (day, month, year) => {
    if (!selectedDate) return false;
    
    const selected = parseDateString(selectedDate);
    return (
      parseInt(selected.day) === day &&
      parseInt(selected.month) - 1 === month &&
      parseInt(selected.year) === year
    );
  };

  // האם תאריך מסוים הוא היום
  const isToday = (day, month, year) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // טיפול בבחירת תאריך
  const handleDateClick = (day, month, year) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const formattedDate = formatDateString(year.toString(), paddedMonth, paddedDay);
    onSelectDate(formattedDate);
  };

  // תמיכה בתזוזה בין חודשים באמצעות מגע
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // אם המשתמש גרר מספיק (יותר מ-50 פיקסלים)
    if (Math.abs(diff) > 50) {
      // שלילי משמאל לימין (חודש קודם), חיובי מימין לשמאל (חודש הבא)
      changeMonth(diff > 0 ? 1 : -1);
    }
    
    setTouchStartX(null);
  };

  // הוספת מאזיני מקשי מקלדת (נגישות)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        changeMonth(1); // בעברית זה הפוך, חץ שמאל מזיז ימינה (קדימה)
      } else if (e.key === 'ArrowRight') {
        changeMonth(-1); // בעברית זה הפוך, חץ ימין מזיז שמאלה (אחורה)
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMonth, currentYear, onClose]);

  // פורמוט מחרוזת עבור התאריך והחודש
  const formatMonthYear = () => {
    return `${months[currentMonth]} ${currentYear}`;
  };

  // רינדור הלוח
  return (
    <div 
      className="bg-white rounded-lg shadow-lg border border-indigo-200 overflow-hidden w-72 sm:w-80 md:w-96"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* כותרת הלוח - שורת החודש והשנה */}
      <div className="flex justify-between items-center bg-indigo-600 text-white p-3">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          aria-label="החודש הקודם"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="text-lg font-bold">
          {formatMonthYear()}
        </div>
        
        <button 
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          aria-label="החודש הבא"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* שורת ימי השבוע */}
      <div className="grid grid-cols-7 bg-indigo-100 text-indigo-600 text-center">
        {days.map((day, index) => (
          <div key={index} className="py-1">
            <span className="hidden sm:inline">{day.full}</span>
            <span className="sm:hidden">{day.short}</span>
          </div>
        ))}
      </div>
      
      {/* הימים בלוח */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {buildCalendarDays().map((dateObj, index) => {
          const isSelected = isSelectedDate(dateObj.day, dateObj.month, dateObj.year);
          const isTodayDate = isToday(dateObj.day, dateObj.month, dateObj.year);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(dateObj.day, dateObj.month, dateObj.year)}
              className={`
                p-1 sm:p-2 h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-full text-sm
                ${!dateObj.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                ${isSelected ? 'bg-indigo-600 text-white' : ''}
                ${!isSelected && isTodayDate ? 'border border-indigo-600' : ''}
                ${!isSelected && !isTodayDate ? 'hover:bg-indigo-100' : ''}
                transition-colors
              `}
              aria-selected={isSelected}
              aria-label={`${dateObj.day}/${dateObj.month + 1}/${dateObj.year}`}
            >
              {dateObj.day}
            </button>
          );
        })}
      </div>
      
      {/* כפתורי פעולות - היום/סגירה */}
      <div className="flex justify-between border-t border-indigo-200 p-2">
        <button
          onClick={() => {
            setCurrentMonth(today.getMonth());
            setCurrentYear(today.getFullYear());
          }}
          className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
        >
          היום
        </button>
        
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
        >
          סגור
        </button>
      </div>
    </div>
  );
};

export default CalendarPicker;