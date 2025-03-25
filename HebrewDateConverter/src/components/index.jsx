// src/components/index.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DateInput from './date-fields/DateInput';
import HebrewDateDisplay from './HebrewDateDisplay';
import { 
  formatDate, 
  convertToHebrewDate, 
  getHebrewDayOfWeek 
} from './hebrewDateUtils';
import { getHolidayInfo, getHolidayDisplayString } from '../utils/holidayUtils';

/**
 * Main Hebrew Date Converter component with enhanced holiday support
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isMobile - Whether the app is running on a mobile device
 * @param {boolean} props.isIOS - Whether the app is running on iOS
 * @returns {JSX.Element} - The main component
 */
const HebrewDateConverter = ({ isMobile, isIOS }) => {
  // State management
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateHeader, setAnimateHeader] = useState(false);
  
  // Refs for timers
  const loadingTimerRef = useRef(null);
  const headerAnimationTimerRef = useRef(null);
  const conversionDelayTimerRef = useRef(null);

  // Initialize with current date
  useEffect(() => {
    const today = new Date();
    setGregorianDate(formatDate(today));
    
    // Short animation for header
    setAnimateHeader(true);
    
    headerAnimationTimerRef.current = setTimeout(() => {
      setAnimateHeader(false);
      headerAnimationTimerRef.current = null;
    }, 1000);
    
    // Cleanup timers on unmount
    return () => {
      if (headerAnimationTimerRef.current) {
        clearTimeout(headerAnimationTimerRef.current);
        headerAnimationTimerRef.current = null;
      }
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
        conversionDelayTimerRef.current = null;
      }
    };
  }, []);

  // Convert date when it changes
  useEffect(() => {
    if (gregorianDate) {
      // Debounce conversion for smoother UX
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
      
      conversionDelayTimerRef.current = setTimeout(() => {
        convertDate();
        conversionDelayTimerRef.current = null;
      }, isMobile ? 200 : 100); // Longer delay on mobile
    }
  }, [gregorianDate, isMobile]);

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
    
    // Add a slight delay for loading indicator
    loadingTimerRef.current = setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          loadingTimerRef.current = null;
          return;
        }

        // Convert to Hebrew date
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // Get day of week
        setDayOfWeek(getHebrewDayOfWeek(date));
        
        // Check for holidays using the enhanced holiday detection
        const holiday = getHolidayInfo(date);
        setHolidayInfo(holiday);
        
        setError('');
        setLoading(false);
        loadingTimerRef.current = null;
      } catch (error) {
        console.error('Error converting date:', error);
        setError('אירעה שגיאה בהמרת התאריך');
        setLoading(false);
        loadingTimerRef.current = null;
      }
    }, isMobile ? 300 : 200);
  }, [gregorianDate, isMobile]);

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
  
  // Header classes for animation
  const headerClasses = useMemo(() => `flex justify-between items-center mb-6 pb-4 border-b border-indigo-200 transition-all duration-300 ${
    animateHeader ? 'transform -translate-y-1' : ''
  }`, [animateHeader]);

  // Current year for footer
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // Responsive padding
  const containerPadding = isMobile ? 'p-4' : 'p-6';

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
      
      {/* Hebrew date display - passing the full holiday info object */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        note={holidayInfo}  // Pass the complete holiday info object
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