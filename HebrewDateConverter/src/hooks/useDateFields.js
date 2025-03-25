import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  getDaysInMonth, 
  validateYear, 
  parseDateString, 
  formatDateString
} from '../utils/dateUtils';

/**
 * Hook for managing date field components
 * 
 * @param {string} initialValue - Initial date value (YYYY-MM-DD)
 * @param {function} onChange - Function to call when date changes
 * @param {string} externalError - External error (optional)
 * @returns {Object} - Object with values and functions for managing date fields
 */
export const useDateFields = (initialValue, onChange, externalError) => {
  // Break down initial value to components
  const initialFields = parseDateString(initialValue);
  
  // Internal state for fields - allows typing without conflicts
  const [year, setYear] = useState(initialFields.year);
  const [month, setMonth] = useState(initialFields.month);
  const [day, setDay] = useState(initialFields.day);
  const [error, setError] = useState(externalError || '');
  
  // Keep previous date for comparison
  const prevValueRef = useRef(initialValue);
  
  // Calculate full date only when values change
  const fullDate = useMemo(() => {
    return formatDateString(year, month, day);
  }, [year, month, day]);
  
  // Update internal fields when external date changes
  useEffect(() => {
    if (initialValue && initialValue !== prevValueRef.current) {
      const { year: newYear, month: newMonth, day: newDay } = parseDateString(initialValue);
      setYear(newYear);
      setMonth(newMonth);
      setDay(newDay);
      prevValueRef.current = initialValue;
    }
  }, [initialValue]);

  // Update external error
  useEffect(() => {
    setError(externalError || '');
  }, [externalError]);
  
  // Handle year field change
  const handleYearChange = useCallback((e) => {
    const newYear = e.target.value;
    
    // Update local state immediately
    setYear(newYear);
    
    // Validate year is in correct range
    const yearError = validateYear(newYear);
    if (yearError) {
      setError(yearError);
      return;
    }
    
    // Clear errors
    setError('');
    
    // Update full date
    if (newYear && month && day) {
      onChange({ target: { value: formatDateString(newYear, month, day) } });
    }
  }, [month, day, onChange]);
  
  // Handle month field change
  const handleMonthChange = useCallback((e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    
    // Adjust day to new month if needed
    if (newMonth && day) {
      const maxDays = getDaysInMonth(parseInt(year), parseInt(newMonth) - 1);
      const currentDay = parseInt(day);
      
      if (currentDay > maxDays) {
        // If current day is greater than days in new month, adjust it
        const newDay = maxDays.toString().padStart(2, '0');
        setDay(newDay);
        
        // Update full date
        if (year) {
          onChange({ target: { value: formatDateString(year, newMonth, newDay) } });
        }
        return;
      }
    }
    
    // Update full date
    if (year && newMonth && day) {
      onChange({ target: { value: formatDateString(year, newMonth, day) } });
    }
  }, [year, day, onChange]);
  
  // Handle day field change
  const handleDayChange = useCallback((e) => {
    const newDay = e.target.value;
    setDay(newDay);
    
    // Update full date
    if (year && month && newDay) {
      onChange({ target: { value: formatDateString(year, month, newDay) } });
    }
  }, [year, month, onChange]);
  
  // Handle date selection from calendar
  const handleDateSelected = useCallback((date) => {
    if (date) {
      const { year: newYear, month: newMonth, day: newDay } = parseDateString(date);
      
      // Update all fields
      setYear(newYear);
      setMonth(newMonth);
      setDay(newDay);
      setError('');
      
      // Update full date
      onChange({ target: { value: date } });
    }
  }, [onChange]);
  
  return {
    fields: { year, month, day },
    setters: { setYear, setMonth, setDay },
    handlers: { handleYearChange, handleMonthChange, handleDayChange, handleDateSelected },
    error,
    setError,
    fullDate
  };
};