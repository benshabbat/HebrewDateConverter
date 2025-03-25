import { HOLIDAY_TYPES } from '../constants/hebrewDates';

/**
 * Enhanced function for detecting Jewish holidays and special dates
 * @param {Date} date - Date to check
 * @returns {Object|null} - Object with holiday info or null if none
 */
export const getHolidayInfo = (date) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return null;
    }

    // Get Hebrew date components using Intl API
    const formatter = new Intl.DateTimeFormat('he-IL', {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    
    const hebrewDay = parseInt(parts.find(part => part.type === 'day')?.value || '0', 10);
    const hebrewMonth = parseInt(parts.find(part => part.type === 'month')?.value || '0', 10);
    
    // Shabbat
    if (date.getDay() === 6) {
      return {
        name: 'שבת',
        type: HOLIDAY_TYPES.SHABBAT
      };
    }
    
    // Rosh Chodesh
    if (hebrewDay === 1 && hebrewMonth !== 7) { // Not including Rosh Hashanah
      return {
        name: `ראש חודש ${getHebrewMonthName(hebrewMonth)}`,
        type: HOLIDAY_TYPES.ROSH_CHODESH
      };
    }
    
    // Tishrei holidays (month 7)
    if (hebrewMonth === 7) {
      if (hebrewDay === 1 || hebrewDay === 2) {
        return {
          name: 'ראש השנה',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if (hebrewDay === 10) {
        return {
          name: 'יום כיפור',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if (hebrewDay === 15) {
        return {
          name: 'סוכות',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if (hebrewDay >= 16 && hebrewDay <= 20) {
        return {
          name: 'חול המועד סוכות',
          type: HOLIDAY_TYPES.CHOL_HAMOED
        };
      }
      
      if (hebrewDay === 21) {
        return {
          name: 'הושענא רבה',
          type: HOLIDAY_TYPES.SPECIAL_DAY
        };
      }
      
      if (hebrewDay === 22) {
        return {
          name: 'שמיני עצרת',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
    }
    
    // Chanukah
    if ((hebrewMonth === 9 && hebrewDay >= 25) || (hebrewMonth === 10 && hebrewDay <= 2)) {
      return {
        name: 'חנוכה',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Tu BiShvat
    if (hebrewMonth === 11 && hebrewDay === 15) {
      return {
        name: 'ט״ו בשבט',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Purim
    if (hebrewMonth === 12 && hebrewDay === 14) {
      return {
        name: 'פורים',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Passover and Omer days
    if (hebrewMonth === 1) {
      if (hebrewDay === 15) {
        return {
          name: 'פסח',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if (hebrewDay >= 16 && hebrewDay <= 20) {
        return {
          name: 'חול המועד פסח',
          type: HOLIDAY_TYPES.CHOL_HAMOED
        };
      }
      
      if (hebrewDay === 21) {
        return {
          name: 'שביעי של פסח',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
    }
    
    // Lag BaOmer
    if (hebrewMonth === 2 && hebrewDay === 18) {
      return {
        name: 'ל״ג בעומר',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Shavuot
    if (hebrewMonth === 3 && hebrewDay === 6) {
      return {
        name: 'שבועות',
        type: HOLIDAY_TYPES.MAJOR_HOLIDAY
      };
    }
    
    // Fast of 17th of Tammuz
    if (hebrewMonth === 4 && hebrewDay === 17) {
      return {
        name: 'צום י״ז בתמוז',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    // Tisha B'Av
    if (hebrewMonth === 5 && hebrewDay === 9) {
      return {
        name: 'תשעה באב',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting holiday:', error);
    return null;
  }
};

/**
 * Helper function to get Hebrew month name
 * @param {number} month - Hebrew month number (1-13)
 * @returns {string} - Hebrew month name
 */
const getHebrewMonthName = (month) => {
  const hebrewMonthNames = [
    '',  // Empty for index 1
    'ניסן',
    'אייר',
    'סיוון',
    'תמוז',
    'אב',
    'אלול',
    'תשרי',
    'חשוון',
    'כסלו',
    'טבת',
    'שבט',
    'אדר',
    'אדר ב\''
  ];
  
  return hebrewMonthNames[month] || '';
};