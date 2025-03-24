import React from 'react';
import YearInput from './YearInput';
import MonthSelect from './MonthSelect';
import DaySelect from './DaySelect';
import CalendarButton from './CalendarButton';
import ErrorMessage from './ErrorMessage';
import useDateFields from '../hooks/useDateFields';

/**
 * קומפוננטת קלט תאריך מלאה - עם איקונים מוטמעים ישירות וכפתור תאריך בולט
 * 
 * @param {string} value - ערך התאריך (YYYY-MM-DD)
 * @param {function} onChange - פונקציה שתקרא כאשר התאריך משתנה
 * @param {string} error - שגיאה חיצונית (אופציונלי)
 * @returns {JSX.Element} - רכיב React לקלט תאריך מלא
 */
const DateInput = ({ value, onChange, error: externalError }) => {
  // שימוש בהוק המותאם לניהול שדות התאריך
  const {
    fields,
    handlers,
    error,
    fullDate
  } = useDateFields(value, onChange, externalError);
  
  return (
    <div className="mb-8">
      <label className="block text-indigo-800 text-lg font-bold mb-3">
        הזן תאריך לועזי:
      </label>
      
      <div className="flex mb-3">
        <div className="flex-1 flex space-x-3 rtl:space-x-reverse">
          {/* קומפוננטת שדה שנה */}
          <YearInput 
            value={fields.year} 
            onChange={handlers.handleYearChange} 
          />
          
          {/* קומפוננטת בחירת חודש */}
          <MonthSelect 
            value={fields.month} 
            onChange={handlers.handleMonthChange} 
          />
          
          {/* קומפוננטת בחירת יום */}
          <DaySelect 
            value={fields.day} 
            month={fields.month}
            year={fields.year}
            onChange={handlers.handleDayChange} 
          />
        </div>
        
        {/* קומפוננטת כפתור לוח שנה */}
        <CalendarButton 
          selectedDate={fullDate} 
          onSelectDate={handlers.handleDateSelected} 
        />
      </div>
      
      {/* קומפוננטת הודעת שגיאה */}
      <ErrorMessage message={error} />
    </div>
  );
};

export default DateInput;