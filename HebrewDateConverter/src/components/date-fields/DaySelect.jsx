import React, { useMemo } from 'react';
import { calculateDayOptions } from '../utils/dateUtils';

export const DaySelect = ({ value, month, year, onChange }) => {
  // Calculate day options - depends on month and year
  const dayOptions = useMemo(() => {
    return calculateDayOptions(year, month);
  }, [year, month]);
  
  return (
    <div className="w-full sm:w-1/3 relative">
      <label className="block text-indigo-600 text-sm font-medium mb-1">
        יום
      </label>
      <div className="relative">
        <select
          className="w-full px-4 py-3 pr-4 pl-10 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md appearance-none"
          value={value}
          onChange={onChange}
          aria-label="יום"
        >
          {dayOptions.map(dayNum => {
            const dayValue = dayNum.toString().padStart(2, '0');
            return (
              <option key={dayValue} value={dayValue}>
                {dayNum}
              </option>
            );
          })}
        </select>
        
        {/* Down arrow for select - on left side for RTL */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-indigo-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};