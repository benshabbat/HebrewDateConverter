import React from 'react';

/**
 * Application header component
 * @param {Object} props
 * @param {string} props.title - Header title
 */
const Header = ({ title = 'ממיר תאריכים עברי' }) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-200">
      <h1 className="text-3xl font-bold text-indigo-800 flex items-center">
        <CalendarIcon className="h-8 w-8 ml-2 text-indigo-600" />
        <span>{title}</span>
      </h1>
    </div>
  );
};

/**
 * Calendar icon SVG component
 */
const CalendarIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
    />
  </svg>
);

export default Header;