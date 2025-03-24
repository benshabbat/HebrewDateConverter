/**
 * Utility functions for Hebrew date conversion
 */

/**
 * Converts a number to its Hebrew representation (Gematria)
 * @param {number} num - Number to convert
 * @returns {string} Hebrew representation
 */
export const convertToGematriya = (num) => {
  // Special cases for religious reasons
  if (num === 15) return 'ט״ו';
  if (num === 16) return 'ט״ז';
  
  // Hebrew letter values
  const letterValues = [
    { value: 400, letter: 'ת' },
    { value: 300, letter: 'ש' },
    { value: 200, letter: 'ר' },
    { value: 100, letter: 'ק' },
    { value: 90, letter: 'צ' },
    { value: 80, letter: 'פ' },
    { value: 70, letter: 'ע' },
    { value: 60, letter: 'ס' },
    { value: 50, letter: 'נ' },
    { value: 40, letter: 'מ' },
    { value: 30, letter: 'ל' },
    { value: 20, letter: 'כ' },
    { value: 10, letter: 'י' },
    { value: 9, letter: 'ט' },
    { value: 8, letter: 'ח' },
    { value: 7, letter: 'ז' },
    { value: 6, letter: 'ו' },
    { value: 5, letter: 'ה' },
    { value: 4, letter: 'ד' },
    { value: 3, letter: 'ג' },
    { value: 2, letter: 'ב' },
    { value: 1, letter: 'א' }
  ];
  
  let result = '';
  let remaining = num;
  
  // Build gematria string
  for (const { value, letter } of letterValues) {
    while (remaining >= value) {
      result += letter;
      remaining -= value;
    }
  }
  
  // Add appropriate punctuation
  if (result.length > 1) {
    return result.slice(0, -1) + '״' + result.slice(-1);
  } else if (result.length === 1) {
    return result + '׳';
  }
  
  return result;
};

/**
 * Formats a date as yyyy-MM-dd
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

/**
 * Gets the number of days in a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} Number of days in the month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Gets the Hebrew day of week
 * @param {Date} date - Date object
 * @returns {string} Hebrew day name
 */
export const getHebrewDayOfWeek = (date) => {
  const dayIndex = date.getDay();
  const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `יום ${hebrewDays[dayIndex]}`;
};

/**
 * Get special notes for the date (holidays, special days, etc.)
 * @param {Date} date - Date object
 * @returns {string|null} Note for the date, or null if none
 */
export const getDateNote = (date) => {
  try {
    const formatter = new Intl.DateTimeFormat(['he-IL'], {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    const hebrewMonth = parseInt(parts.find(part => part.type === 'month')?.value || '0', 10);
    const hebrewDay = parseInt(parts.find(part => part.type === 'day')?.value || '0', 10);
    
    // Major Jewish holidays
    if (hebrewMonth === 7 && hebrewDay === 1) return 'ראש השנה';
    if (hebrewMonth === 7 && hebrewDay === 2) return 'ראש השנה (יום שני)';
    if (hebrewMonth === 7 && hebrewDay === 10) return 'יום כיפור';
    if (hebrewMonth === 7 && hebrewDay === 15) return 'סוכות';
    if (hebrewMonth === 7 && hebrewDay >= 16 && hebrewDay <= 21) return 'חול המועד סוכות';
    if (hebrewMonth === 7 && hebrewDay === 22) return 'שמיני עצרת';
    
    if (hebrewMonth === 9 && hebrewDay >= 25) return 'חנוכה';
    if (hebrewMonth === 10 && hebrewDay <= 2) return 'חנוכה';
    if (hebrewMonth === 10 && hebrewDay === 10) return 'צום עשרה בטבת';
    
    if (hebrewMonth === 11 && hebrewDay === 15) return 'ט״ו בשבט';
    
    if (hebrewMonth === 12 && hebrewDay === 14) return 'פורים';
    if (hebrewMonth === 12 && hebrewDay === 13) return 'תענית אסתר';
    
    if (hebrewMonth === 1 && hebrewDay === 15) return 'פסח';
    if (hebrewMonth === 1 && hebrewDay >= 16 && hebrewDay <= 20) return 'חול המועד פסח';
    if (hebrewMonth === 1 && hebrewDay === 21) return 'שביעי של פסח';
    
    if (hebrewMonth === 2 && hebrewDay === 18) return 'ל״ג בעומר';
    
    if (hebrewMonth === 3 && hebrewDay === 6) return 'שבועות';
    
    if (hebrewMonth === 4 && hebrewDay === 17) return 'צום י״ז בתמוז';
    if (hebrewMonth === 5 && hebrewDay === 9) return 'תשעה באב';
    
    // Shabbat
    if (date.getDay() === 6) return 'שבת';
    
    return null;
  } catch (error) {
    console.error('Error determining special date:', error);
    return null;
  }
};

/**
 * Converts a Gregorian date to Hebrew date
 * @param {Date} date - Gregorian date
 * @returns {string} Hebrew date in letters (gematria)
 */
export const convertToHebrewDate = (date) => {
  try {
    // Use built-in Hebrew calendar formatter
    const formatter = new Intl.DateTimeFormat(['he-IL'], {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Get the raw Hebrew date parts
    const parts = formatter.formatToParts(date);
    const day = parts.find(part => part.type === 'day')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const year = parts.find(part => part.type === 'year')?.value;
    
    // Convert day to gematria
    let hebrewDay = day ? convertToGematriya(parseInt(day, 10)) : '';
    
    // Month is already in Hebrew
    let hebrewMonth = month || '';
    
    // Convert year to Hebrew format
    let hebrewYear = '';
    if (year) {
      const yearNum = parseInt(year, 10);
      // Modern era (5000-6000)
      if (yearNum >= 5000 && yearNum < 6000) {
        const lastTwoDigits = yearNum % 100;
        hebrewYear = `ה'תש${convertToGematriya(lastTwoDigits)}`;
      } else {
        // For other years
        hebrewYear = convertToGematriya(yearNum);
      }
    }
    
    // Combine all parts
    return `${hebrewDay} ב${hebrewMonth} ${hebrewYear}`;
  } catch (error) {
    console.error('Error converting to Hebrew date:', error);
    return 'שגיאה בהמרת התאריך';
  }
};

/**
 * Array of Hebrew month names
 */
export const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

/**
 * Array of Hebrew weekday abbreviations
 */
export const weekDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];