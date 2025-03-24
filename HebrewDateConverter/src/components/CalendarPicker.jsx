import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * קומפוננטת לוח שנה - עם איקונים מוטמעים
 */
const CalendarPicker = ({ selectedDate, onSelectDate, onClose }) => {
  // המרת התאריך הנבחר לאובייקט Date - רק פעם אחת בטעינה
  const initialDate = useMemo(() => selectedDate ? new Date(selectedDate) : new Date(), [selectedDate]);
  
  // ניהול החודש המוצג בלוח
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  // מערך שמות החודשים בעברית - קבוע, לא משתנה ברינדורים
  const hebrewMonths = useMemo(() => [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ], []);

  // ימי השבוע בעברית - קבוע, לא משתנה ברינדורים
  const weekDays = useMemo(() => ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'], []);
  
  // עדכון החודש המוצג כאשר התאריך הנבחר משתנה
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      // רק אם התאריך באמת השתנה, מעדכן את המצב
      setCurrentMonth(prevMonth => {
        const newMonth = date.getMonth();
        return prevMonth !== newMonth ? newMonth : prevMonth;
      });
      
      setCurrentYear(prevYear => {
        const newYear = date.getFullYear();
        return prevYear !== newYear ? newYear : prevYear;
      });
    }
  }, [selectedDate]);
  
  // מעבר לחודש הקודם - פונקציה מוגדרת פעם אחת
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  }, []);
  
  // מעבר לחודש הבא - פונקציה מוגדרת פעם אחת
  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  }, []);
  
  // מעבר ישיר לשנה - פונקציה מוגדרת פעם אחת
  const jumpToYear = useCallback((year) => {
    if (year >= 1800 && year <= 2300) {
      setCurrentYear(year);
    }
  }, []);
  
  // יצירת מערך הימים להצגה בלוח השנה - ממוכרז לשיפור ביצועים
  const daysArray = useMemo(() => {
    // היום הראשון בחודש
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // היום האחרון בחודש
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    // מספר הימים בחודש
    const daysInMonth = lastDayOfMonth.getDate();
    // היום בשבוע של תחילת החודש (0 = ראשון, 6 = שבת)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // הוספת תאים ריקים לפני תחילת החודש
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // הוספת כל ימי החודש
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  }, [currentYear, currentMonth]);
  
  // בדיקה אם תאריך נבחר הוא היום - לא מחושב מחדש בכל רינדור
  const today = useMemo(() => new Date(), []);
  
  const isToday = useCallback((date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }, [today]);
  
  // בדיקה אם תאריך הוא התאריך הנבחר - ממוכרז לשיפור ביצועים
  const selectedDateObj = useMemo(() => selectedDate ? new Date(selectedDate) : null, [selectedDate]);
  
  const isSelected = useCallback((date) => {
    if (!selectedDateObj) return false;
    
    return date.getDate() === selectedDateObj.getDate() &&
           date.getMonth() === selectedDateObj.getMonth() &&
           date.getFullYear() === selectedDateObj.getFullYear();
  }, [selectedDateObj]);
  
  // פורמט תאריך ל-YYYY-MM-DD - פונקציה מוגדרת פעם אחת
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  // בחירת התאריך הנוכחי - פונקציה מוגדרת פעם אחת
  const selectToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onSelectDate(formatDate(today));
    onClose && onClose();
  }, [formatDate, onSelectDate, onClose]);
  
  // בחירת תאריך מהלוח - פונקציה מוגדרת פעם אחת
  const handleDateClick = useCallback((date) => {
    onSelectDate(formatDate(date));
    onClose && onClose();
  }, [formatDate, onSelectDate, onClose]);
  
  // טיפול בשינוי שנה - פונקציה מוגדרת פעם אחת
  const handleYearChange = useCallback((e) => {
    jumpToYear(parseInt(e.target.value));
  }, [jumpToYear]);
  
  return (
    <div className="absolute z-20 right-0 mt-1 p-3 bg-white rounded-lg shadow-xl border border-indigo-100 w-72 select-none">
      {/* כותרת וניווט */}
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button" 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full hover:bg-indigo-100 text-indigo-700 transition-colors"
          aria-label="חודש קודם"
        >
          {/* איקון חץ ימינה - מוטמע ישירות */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="font-bold text-indigo-800">
            {hebrewMonths[currentMonth]} {currentYear}
          </div>
          
          {/* בחירת שנה ישירות */}
          <div className="flex items-center justify-center mt-1">
            <input
              type="number"
              min="1800"
              max="2300"
              value={currentYear}
              onChange={handleYearChange}
              className="w-16 text-center text-sm border border-indigo-200 rounded px-1 py-0.5"
              aria-label="שנה"
            />
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-indigo-100 text-indigo-700 transition-colors"
          aria-label="חודש הבא"
        >
          {/* איקון חץ שמאלה - מוטמע ישירות */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* כותרות ימי השבוע */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-xs font-semibold text-indigo-600 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* לוח הימים */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((day, index) => (
          <div key={index} className="text-center">
            {day ? (
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
                  ${isSelected(day) 
                    ? 'bg-indigo-600 text-white font-bold' 
                    : isToday(day)
                      ? 'bg-indigo-100 text-indigo-800 font-semibold' 
                      : 'hover:bg-indigo-50 text-gray-700'}`}
                aria-label={`${day.getDate()} ב${hebrewMonths[day.getMonth()]} ${day.getFullYear()}`}
              >
                {day.getDate()}
              </button>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* כפתורי קיצור */}
      <div className="mt-3 pt-2 border-t border-indigo-100 flex justify-between">
        <button
          type="button"
          onClick={selectToday}
          className="text-xs px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
        >
          היום
        </button>
        
        <button
          type="button"
          onClick={onClose}
          className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
        >
          סגור
        </button>
      </div>
    </div>
  );
};

export default CalendarPicker;