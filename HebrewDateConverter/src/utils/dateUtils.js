/**
 * פונקציות עזר לעבודה עם תאריכים
 */

/**
 * מחזיר את מספר הימים בחודש נתון
 * @param {number} year - שנה במספר שלם
 * @param {number} month - אינדקס החודש (0-11)
 * @returns {number} - מספר הימים בחודש
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  /**
   * מחזיר מערך של אובייקטים עם שמות החודשים בעברית
   * @returns {Array} - מערך של אובייקטים {value, label}
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
   * בודק אם השנה תקינה
   * @param {string} year - השנה כמחרוזת
   * @returns {string|null} - הודעת שגיאה או null אם תקין
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
   * חישוב אופציות הימים בחודש
   * @param {string} year - השנה כמחרוזת
   * @param {string} month - החודש כמחרוזת (01-12)
   * @returns {Array} - מערך של מספרי הימים בחודש
   */
  export const calculateDayOptions = (year, month) => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const daysCount = getDaysInMonth(parseInt(year), parseInt(month) - 1);
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };
  
  /**
   * פירוק מחרוזת תאריך לרכיביה
   * @param {string} dateString - מחרוזת תאריך בפורמט YYYY-MM-DD
   * @returns {Object} - אובייקט עם השדות year, month, day
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
   * בניית מחרוזת תאריך מרכיבים
   * @param {string} year - שנה
   * @param {string} month - חודש
   * @param {string} day - יום
   * @returns {string} - מחרוזת תאריך בפורמט YYYY-MM-DD או מחרוזת ריקה אם חסרים נתונים
   */
  export const formatDateString = (year, month, day) => {
    return year && month && day ? `${year}-${month}-${day}` : '';
  };
  
  /**
   * המרת תאריך לועזי לפורמט מקובל בעברית
   * 
   * @param {string} gregorianDate - תאריך בפורמט YYYY-MM-DD
   * @returns {string} - תאריך בפורמט DD/MM/YYYY
   */
  export const formatGregorianDate = (gregorianDate) => {
    if (!gregorianDate) return '';
    
    const { year, month, day } = parseDateString(gregorianDate);
    return `${day}/${month}/${year}`;
  };
  
  /**
   * הרכבת מחרוזת תאריך מלאה עם מועד מיוחד (אם קיים)
   * 
   * @param {string} dayOfWeek - יום בשבוע
   * @param {string} hebrewDate - התאריך העברי
   * @param {string} dateNote - מועד מיוחד (אופציונלי)
   * @returns {string} - מחרוזת תאריך מלאה
   */
  export const getFullDateString = (dayOfWeek, hebrewDate, dateNote) => {
    return dateNote 
      ? `${dayOfWeek}, ${hebrewDate} (${dateNote})`
      : `${dayOfWeek}, ${hebrewDate}`;
  };