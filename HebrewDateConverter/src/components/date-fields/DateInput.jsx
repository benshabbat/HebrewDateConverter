import React from 'react';
import YearInput from './YearInput';
import MonthSelect from './MonthSelect';
import DaySelect from './DaySelect';
import CalendarButton from '../CalendarButton';
import ErrorMessage from '../ErrorMessage';
import useDateFields from '../../hooks/useDateFields';

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
      
      <div className="flex flex-col md:flex-row mb-3">
        <div className="flex-1 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse mb-4 md:mb-0">
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
        <div className="flex justify-center md:justify-start md:mr-2">
          <CalendarButton 
            selectedDate={fullDate} 
            onSelectDate={handlers.handleDateSelected} 
          />
        </div>
      </div>
      
      {/* קומפוננטת הודעת שגיאה */}
      <ErrorMessage message={error} />
    </div>
  );
};

export default DateInput;