import React from 'react';
import { getHolidayType, HOLIDAY_TYPES } from '../constants/hebrewDates';

/**
 * קומפוננטת תצוגת חג או מועד מיוחד
 * צבעים שונים לסוגי חגים שונים
 * 
 * @param {string} holidayName - שם החג או המועד
 * @returns {JSX.Element|null} - רכיב React המציג את החג בצבע המתאים
 */
const HolidayTag = ({ holidayName }) => {
  // אם אין שם חג, לא מציגים כלום
  if (!holidayName || holidayName.trim() === '') {
    return null;
  }
  
  // מקבלים את סוג החג
  const holidayType = getHolidayType(holidayName);
  
  // מגדירים צבעים שונים לפי סוג החג
  const getTagClasses = () => {
    switch (holidayType) {
      case HOLIDAY_TYPES.MAJOR_HOLIDAY:
        return 'bg-red-100 text-red-800'; // חגים ראשיים - אדום
      case HOLIDAY_TYPES.MINOR_HOLIDAY:
        return 'bg-blue-100 text-blue-800'; // חגים משניים - כחול
      case HOLIDAY_TYPES.CHOL_HAMOED:
        return 'bg-purple-100 text-purple-800'; // חול המועד - סגול
      case HOLIDAY_TYPES.REMEMBRANCE:
        return 'bg-gray-100 text-gray-800'; // ימי זיכרון - אפור
      case HOLIDAY_TYPES.INDEPENDENCE:
        return 'bg-blue-100 text-blue-800 border border-blue-500'; // יום העצמאות - כחול עם גבול
      case HOLIDAY_TYPES.FAST_DAY:
        return 'bg-gray-100 text-gray-800 border border-gray-400'; // ימי צום - אפור עם גבול
      case HOLIDAY_TYPES.ROSH_CHODESH:
        return 'bg-yellow-100 text-yellow-800'; // ראש חודש - צהוב
      default:
        return 'bg-indigo-100 text-indigo-800'; // ברירת מחדל - אינדיגו
    }
  };
  
  const tagClasses = `${getTagClasses()} text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-center break-words max-w-full`;
  
  return (
    <div className="flex justify-center mb-3 sm:mb-4">
      <span className={tagClasses}>
        {holidayName}
      </span>
    </div>
  );
};

export default HolidayTag;