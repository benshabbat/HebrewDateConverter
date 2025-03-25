import { useState, useEffect, useCallback, useRef } from 'react';
import { formatDate } from '../utils/dateUtils';
import { 
  convertToHebrewDate, 
  getHebrewDayOfWeek 
} from '../utils/hebrewDateUtils';
import { getHolidayInfo } from '../utils/holidayUtils';

/**
 * Hook for Hebrew date conversion logic
 * 
 * @returns {Object} - Object with Hebrew date state and functions
 */
export const useHebrewDate = () => {
  // State management
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs for timers
  const loadingTimerRef = useRef(null);
  const conversionDelayTimerRef = useRef(null);

  // Initialize with current date
  useEffect(() => {
    const today = new Date();
    setGregorianDate(formatDate(today));
    
    return () => {
      // Clean up timers on unmount
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
    };
  }, []);

  // Convert date when it changes
  useEffect(() => {
    if (gregorianDate) {
      // Delay conversion for smoother user experience
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
      
      conversionDelayTimerRef.current = setTimeout(() => {
        convertDate();
      }, 100);
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
    
    // Add slight delay for loading indicator
    loadingTimerRef.current = setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          return;
        }

        // Convert to Hebrew date
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // Get day of week
        setDayOfWeek(getHebrewDayOfWeek(date));
        
        // Check for holidays using enhanced holiday detection
        const holiday = getHolidayInfo(date);
        setHolidayInfo(holiday);
        
        setError('');
        setLoading(false);
      } catch (error) {
        console.error('Error converting date:', error);
        setError('אירעה שגיאה בהמרת התאריך');
        setLoading(false);
      }
    }, 200);
  }, [gregorianDate]);

  return {
    gregorianDate,
    setGregorianDate,
    hebrewDate,
    dayOfWeek,
    holidayInfo,
    loading,
    error,
    setError,
    convertDate
  };
};