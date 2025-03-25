import React from 'react';

export const Header = ({ title, version }) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-200">
      <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{title}</span>
      </h1>
      
      {version && (
        <div className="text-xs text-indigo-400 bg-white bg-opacity-50 rounded-full px-3 py-1">
          גרסה {version}
        </div>
      )}
    </div>
  );
};