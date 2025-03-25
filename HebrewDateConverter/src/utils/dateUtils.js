/**
 * Utility functions for working with dates
 */

/**
 * Get the number of days in a month
 * @param {number} year - Year as integer
 * @param {number} month - Month index (0-11)
 * @returns {number} - Number of days in month
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  /**
   * Get array of objects with Hebrew month names
   * @returns {Array} - Array of objects {value, label}
   */
  export const getHebrewMonthNames = () => [
    { value: '01', label: 'ינואר' },
    { value: '02', label: 'פברואר' },
    { value: '03', label: 'מרץ' },
    { value: '04', label: 'אפריל' },
    { value: '05', label: 'מאי' },
    { value: '06', label: 'יוני' },
    { value: '07', label: 'יולי' },
    { value: '08', label: 'אוגוסט' },
    { value: '09', label: 'ספטמבר' },
    { value: '10', label: 'אוקטובר' },
    { value: '11', label: 'נובמבר' },
    { value: '12', label: 'דצמבר' }
  ];
  
  /**
   * Validate year is within range
   * @param {string} year - Year as string
   * @returns {string|null} - Error message or null if valid
   */
  export const validateYear = (year) => {
    if (!year) return null;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1800 || yearNum > 2300) {
      return 'השנה חייבת להיות בין 1800 ל-2300';
    }
    
    return null;
  };
  
  /**
   * Calculate day options for a month
   * @param {string} year - Year as string
   * @param {string} month - Month as string (01-12)
   * @returns {Array} - Array of day numbers in month
   */
  export const calculateDayOptions = (year, month) => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const daysCount = getDaysInMonth(parseInt(year), parseInt(month) - 1);
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };
  
  /**
   * Parse date string into its components
   * @param {string} dateString - Date string in format YYYY-MM-DD
   * @returns {Object} - Object with year, month, day fields
   */
  export const parseDateString = (dateString) => {
    if (!dateString) {
      return { year: '', month: '01', day: '01' };
    }
    
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return {
        year: parts[0],
        month: parts[1],
        day: parts[2]
      };
    }
    
    return { year: '', month: '01', day: '01' };
  };
  
  /**
   * Build date string from components
   * @param {string} year - Year
   * @param {string} month - Month
   * @param {string} day - Day
   * @returns {string} - Date string in format YYYY-MM-DD or empty if missing data
   */
  export const formatDateString = (year, month, day) => {
    return year && month && day ? `${year}-${month}-${day}` : '';
  };
  
  /**
   * Format date as yyyy-MM-dd
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Convert Gregorian date to human-readable format
   * 
   * @param {string} gregorianDate - Date in format YYYY-MM-DD
   * @returns {string} - Date in format DD/MM/YYYY
   */
  export const formatGregorianDate = (gregorianDate) => {
    if (!gregorianDate) return '';
    
    const { year, month, day } = parseDateString(gregorianDate);
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Build full date string with special event (if exists)
   * 
   * @param {string} dayOfWeek - Day of week
   * @param {string} hebrewDate - Hebrew date
   * @param {string} dateNote - Special event (optional)
   * @returns {string} - Full date string
   */
  export const getFullDateString = (dayOfWeek, hebrewDate, dateNote) => {
    return dateNote 
      ? `${dayOfWeek}, ${hebrewDate} (${dateNote})`
      : `${dayOfWeek}, ${hebrewDate}`;
  };
  