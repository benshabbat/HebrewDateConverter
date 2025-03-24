import React from 'react';
import { CalendarIcon } from './Icons';

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

export default Header;