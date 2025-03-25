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