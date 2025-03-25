// src/components/index.jsx - Improved version with multi-platform support
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DateInput from './DateInput';
import HebrewDateDisplay from './HebrewDateDisplay';
import { 
  formatDate, 
  convertToHebrewDate, 
  getHebrewDayOfWeek, 
  getDateNote 
} from './hebrewDateUtils';

/**
 * Enhanced Hebrew Date Converter component with improved multi-platform support
 */
const HebrewDateConverter = () => {
  // State management
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [dateNote, setDateNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateHeader, setAnimateHeader] = useState(false);
  
  // Refs for timers to prevent memory leaks
  const loadingTimerRef = useRef(null);
  const headerAnimationTimerRef = useRef(null);
  const conversionDelayTimerRef = useRef(null);

  // Platform detection for adaptive behavior
  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Initialize with current date
  useEffect(() => {
    const today = new Date();
    setGregorianDate(formatDate(today));
    
    // Short animation for header
    setAnimateHeader(true);
    
    headerAnimationTimerRef.current = setTimeout(() => {
      setAnimateHeader(false);
    }, 1000);
    
    // Cleanup timers on unmount
    return () => {
      [headerAnimationTimerRef, loadingTimerRef, conversionDelayTimerRef].forEach(ref => {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      });
    };
  }, []);

  // Convert date whenever gregorianDate changes
  useEffect(() => {
    if (gregorianDate) {
      // Debounce conversion for smoother UX, especially on slower devices
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
      
      conversionDelayTimerRef.current = setTimeout(() => {
        convertDate();
        conversionDelayTimerRef.current = null;
      }, 200); // 200ms debounce
    }
  }, [gregorianDate]);

  /**
   * Convert Gregorian date to Hebrew date
   */
  const convertDate = useCallback(() => {
    if (!gregorianDate) return;
    
    setLoading(true);
    
    // Clear previous timer if exists
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    
    // Add a slight delay for loading indicator to avoid flickering on fast conversions
    loadingTimerRef.current = setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          return;
        }

        // Convert the date
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // Get day of week and special date note
        setDayOfWeek(getHebrewDayOfWeek(date));
        const note = getDateNote(date);
        setDateNote(note);
        
        setError('');
      } catch (error) {
        console.error('Error converting date:', error);
        setError('אירעה שגיאה בהמרת התאריך');
      } finally {
        setLoading(false);
        loadingTimerRef.current = null;
      }
    }, isMobileDevice ? 300 : 200); // Longer delay on mobile for smoother experience
  }, [gregorianDate, isMobileDevice]);

  /**
   * Handle date change
   */
  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    
    if (newDate) {
      // Validate date
      const [yearStr] = newDate.split('-');
      const year = parseInt(yearStr);
      
      if (isNaN(year) || year < 1800 || year > 2300) {
        setError('השנה חייבת להיות בטווח 1800-2300');
        return;
      }
    }
    
    setError('');
    setGregorianDate(newDate);
  }, []);
  
  // Animation classes for header
  const headerClasses = useMemo(() => `flex justify-between items-center mb-6 pb-4 border-b border-indigo-200 transition-all duration-300 ${
    animateHeader ? 'transform -translate-y-1' : ''
  }`, [animateHeader]);

  // Current year for footer
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // Dynamic padding based on platform
  const containerPadding = isMobileDevice ? 'p-4' : 'p-6';

  return (
    <div className={`max-w-lg mx-auto ${containerPadding} bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl text-right`} dir="rtl">
      {/* Header */}
      <div className={headerClasses}>
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
          {/* Calendar icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>ממיר תאריכים עברי</span>
        </h1>
        
        <div className="text-xs text-indigo-400 bg-white bg-opacity-50 rounded-full px-3 py-1">
          גרסה 2.1
        </div>
      </div>
      
      {/* Date input */}
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {/* Hebrew date display */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        note={dateNote}
        loading={loading}
        gregorianDate={gregorianDate}
      />
      
      {/* Footer */}
      <div className="mt-6 text-center text-indigo-400 text-xs">
        <p>פותח ע"י דוד-חן בן שבת • {currentYear}</p>
      </div>
    </div>
  );
};

export default HebrewDateConverter;