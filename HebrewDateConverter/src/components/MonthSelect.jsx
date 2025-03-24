import React from 'react';
import { getHebrewMonthNames } from '../utils/dateUtils';

/**
 * קומפוננטת בחירת חודש
 * 
 * @param {string} value - ערך החודש הנוכחי
 * @param {function} onChange - פונקציה שתקרא כאשר החודש משתנה
 * @returns {JSX.Element} - רכיב React לבחירת חודש
 */
const MonthSelect = ({ value, onChange }) => {
  // שמות החודשים בעברית
  const hebrewMonthNames = getHebrewMonthNames();
  
  return (
    <div className="w-1/3 relative">
      <label className="block text-indigo-600 text-sm font-medium mb-1">
        חודש
      </label>
      <div className="relative">
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md appearance-none"
          value={value}
          onChange={onChange}
          aria-label="חודש"
        >
          {hebrewMonthNames.map(monthOption => (
            <option key={monthOption.value} value={monthOption.value}>
              {monthOption.label}
            </option>
          ))}
        </select>
        
        {/* חץ מטה בשדה בחירה - בצד ימין עבור RTL */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MonthSelect;