// src/components/HebrewDateConverter/DateInput.jsx
import React from 'react';

const DateInput = ({ value, onChange, error }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-md font-bold mb-3" htmlFor="gregorian-date">
        הזן תאריך לועזי:
      </label>
      <div className="relative">
        <input
          id="gregorian-date"
          type="date"
          className="shadow-md appearance-none border-2 border-indigo-100 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-indigo-400 focus:shadow-outline transition-all"
          value={value}
          onChange={onChange}
          aria-describedby="date-error"
          min="1000-01-01" 
          max="9999-12-31"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
      {error && (
        <p id="date-error" className="text-red-500 text-sm mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default DateInput;