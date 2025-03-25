// src/utils/holidayUtils.js
import { HOLIDAY_TYPES } from '../constants/hebrewDates';

/**
 * Improved function to detect Jewish holidays and special dates
 * @param {Date} date - The date to check
 * @returns {Object|null} - An object with holiday information or null if none
 */
export const getHolidayInfo = (date) => {
  try {
    // Get Hebrew date components using Intl API
    const formatter = new Intl.DateTimeFormat(['he-IL'], {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    const hebrewMonth = parseInt(parts.find(part => part.type === 'month')?.value || '0', 10);
    const hebrewDay = parseInt(parts.find(part => part.type === 'day')?.value || '0', 10);
    const hebrewYear = parseInt(parts.find(part => part.type === 'year')?.value || '0', 10);
    
    // Log for debugging
    console.log('Hebrew date parts:', { hebrewMonth, hebrewDay, hebrewYear });
    
    // Check for Rosh Chodesh (first day of Hebrew month)
    if (hebrewDay === 1 && hebrewMonth !== 7) { // Exclude Rosh Hashanah
      return {
        name: `ראש חודש ${getHebrewMonthName(hebrewMonth)}`,
        type: HOLIDAY_TYPES.ROSH_CHODESH
      };
    }
    
    // Second day of Rosh Chodesh (last day of previous month)
    if (hebrewDay === 30) {
      return {
        name: `ראש חודש ${getHebrewMonthName(hebrewMonth + 1 > 12 ? 1 : hebrewMonth + 1)}`,
        type: HOLIDAY_TYPES.ROSH_CHODESH
      };
    }
    
    // Check if it's Shabbat
    if (date.getDay() === 6) {
      // Get the name of the Parasha (Torah portion) for this Shabbat
      const parashaName = getParashaName(date);
      return {
        name: parashaName ? `שבת ${parashaName}` : 'שבת',
        type: HOLIDAY_TYPES.SHABBAT
      };
    }
    
    // Major Jewish holidays
    
    // Tishrei Holidays (Month 7)
    if (hebrewMonth === 7) {
      if (hebrewDay === 1 || hebrewDay === 2) {
        return {
          name: 'ראש השנה',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if (hebrewDay === 3 && date.getDay() !== 6) {
        return {
          name: 'צום גדליה',
          type: HOLIDAY_TYPES.FAST_DAY
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
      
      if (hebrewDay === 23 && isInIsrael() === false) {
        return {
          name: 'שמחת תורה',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
    }
    
    // Kislev-Tevet Holidays (Month 9-10)
    if ((hebrewMonth === 9 && hebrewDay >= 25) || (hebrewMonth === 10 && hebrewDay <= 2) || 
        (hebrewMonth === 10 && hebrewDay === 3 && isInIsrael() === false)) {
      // Calculate which day of Chanukah
      let chanukahDay = 0;
      
      if (hebrewMonth === 9) {
        chanukahDay = hebrewDay - 24;
      } else { // hebrewMonth === 10
        const daysInKislev = getDaysInHebrewMonth(hebrewYear, 9);
        chanukahDay = daysInKislev - 24 + hebrewDay;
      }
      
      return {
        name: `חנוכה (נר ${chanukahDay})`,
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // 10th of Tevet fast
    if (hebrewMonth === 10 && hebrewDay === 10) {
      return {
        name: 'צום עשרה בטבת',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    // Tu B'Shvat
    if (hebrewMonth === 11 && hebrewDay === 15) {
      return {
        name: 'ט״ו בשבט',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Purim and related days
    if (hebrewMonth === 12 || (hebrewMonth === 13 && isHebrewLeapYear(hebrewYear))) {
      const purimMonth = isHebrewLeapYear(hebrewYear) ? 13 : 12;
      
      if (hebrewMonth === purimMonth) {
        if (hebrewDay === 13) {
          return {
            name: 'תענית אסתר',
            type: HOLIDAY_TYPES.FAST_DAY
          };
        }
        
        if (hebrewDay === 14) {
          return {
            name: 'פורים',
            type: HOLIDAY_TYPES.MINOR_HOLIDAY
          };
        }
        
        if (hebrewDay === 15) {
          return {
            name: 'שושן פורים',
            type: HOLIDAY_TYPES.MINOR_HOLIDAY
          };
        }
      }
    }
    
    // Pesach and counting the Omer
    if (hebrewMonth === 1) {
      if (hebrewDay === 15 || (hebrewDay === 16 && isInIsrael() === false)) {
        return {
          name: 'פסח',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
      
      if ((hebrewDay >= 16 && hebrewDay <= 20) || (isInIsrael() === false && hebrewDay >= 17 && hebrewDay <= 20)) {
        return {
          name: 'חול המועד פסח',
          type: HOLIDAY_TYPES.CHOL_HAMOED
        };
      }
      
      if (hebrewDay === 21 || (hebrewDay === 22 && isInIsrael() === false)) {
        return {
          name: 'שביעי של פסח',
          type: HOLIDAY_TYPES.MAJOR_HOLIDAY
        };
      }
    }
    
    // Counting the Omer (from 16 Nisan to the day before Shavuot)
    if ((hebrewMonth === 1 && hebrewDay >= 16) || (hebrewMonth === 2) || (hebrewMonth === 3 && hebrewDay < 6)) {
      // Calculate which day of the Omer
      let omerDay = 0;
      
      if (hebrewMonth === 1) {
        omerDay = hebrewDay - 15;
      } else if (hebrewMonth === 2) {
        const daysInNisan = getDaysInHebrewMonth(hebrewYear, 1);
        omerDay = daysInNisan - 15 + hebrewDay;
      } else { // hebrewMonth === 3
        const daysInNisan = getDaysInHebrewMonth(hebrewYear, 1);
        const daysInIyar = getDaysInHebrewMonth(hebrewYear, 2);
        omerDay = daysInNisan - 15 + daysInIyar + hebrewDay;
      }
      
      if (omerDay >= 1 && omerDay <= 49) {
        // Specifically check for Lag BaOmer
        if (omerDay === 33) {
          return {
            name: 'ל״ג בעומר',
            type: HOLIDAY_TYPES.MINOR_HOLIDAY
          };
        }
        
        return {
          name: `ספירת העומר - יום ${omerDay}`,
          type: HOLIDAY_TYPES.SPECIAL_DAY
        };
      }
    }
    
    // Shavuot
    if (hebrewMonth === 3 && (hebrewDay === 6 || (hebrewDay === 7 && isInIsrael() === false))) {
      return {
        name: 'שבועות',
        type: HOLIDAY_TYPES.MAJOR_HOLIDAY
      };
    }
    
    // Tzom Tammuz and Tisha B'Av period
    if (hebrewMonth === 4 && hebrewDay === 17) {
      return {
        name: 'צום י״ז בתמוז',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    if (hebrewMonth === 5 && hebrewDay === 9) {
      return {
        name: 'תשעה באב',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    // Tu B'Av
    if (hebrewMonth === 5 && hebrewDay === 15) {
      return {
        name: 'ט״ו באב',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // Modern Israeli holidays (approximate dates - would need exact calculations)
    
    // Holocaust Remembrance Day (27 Nisan)
    if (hebrewMonth === 1 && hebrewDay === 27) {
      return {
        name: 'יום הזיכרון לשואה ולגבורה',
        type: HOLIDAY_TYPES.REMEMBRANCE
      };
    }
    
    // Memorial Day (4 Iyar)
    if (hebrewMonth === 2 && hebrewDay === 4) {
      return {
        name: 'יום הזיכרון לחללי מערכות ישראל',
        type: HOLIDAY_TYPES.REMEMBRANCE
      };
    }
    
    // Independence Day (5 Iyar)
    if (hebrewMonth === 2 && hebrewDay === 5) {
      return {
        name: 'יום העצמאות',
        type: HOLIDAY_TYPES.INDEPENDENCE
      };
    }
    
    // Jerusalem Day (28 Iyar)
    if (hebrewMonth === 2 && hebrewDay === 28) {
      return {
        name: 'יום ירושלים',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error determining holiday:', error);
    return null;
  }
};

/**
 * Convert the holiday info object to a display string
 * @param {Object} holidayInfo - The holiday information object
 * @returns {string|null} - The holiday name as a string, or null if no holiday
 */
export const getHolidayDisplayString = (holidayInfo) => {
  if (!holidayInfo) return null;
  return holidayInfo.name;
};

/**
 * Helper function to check if we should use Israeli holiday rules
 * This is a simplification - in a real app, you might want to allow users to choose
 * @returns {boolean} - True if Israeli holiday rules should be used
 */
function isInIsrael() {
  // For now, always return true for Israeli holiday rules
  // In a production app, this could be a user setting
  return true;
}

/**
 * Helper function to get Hebrew month name
 * @param {number} month - Hebrew month number (1-13)
 * @returns {string} - Hebrew month name
 */
function getHebrewMonthName(month) {
  const hebrewMonthNames = [
    '',  // Empty for 1-based indexing
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
}

/**
 * Helper function to check if a Hebrew year is a leap year
 * @param {number} year - Hebrew year
 * @returns {boolean} - True if it's a leap year
 */
function isHebrewLeapYear(year) {
  return (((7 * year) + 1) % 19) < 7;
}

/**
 * Helper function to get the number of days in a Hebrew month
 * This is a simplification - a full implementation would account for variations
 * @param {number} year - Hebrew year
 * @param {number} month - Hebrew month (1-13)
 * @returns {number} - Number of days in the month
 */
function getDaysInHebrewMonth(year, month) {
  // Simplified implementation - in reality, this would need to account for
  // variations in month lengths based on the Hebrew calendar rules
  if (month === 2 || month === 4 || month === 6 || month === 10 || month === 13) {
    return 29;
  } else if (month === 8) {
    // Cheshvan can be 29 or 30 days
    // Simplified approach - would need proper calculation based on year
    return 30;
  } else if (month === 9) {
    // Kislev can be 29 or 30 days
    // Simplified approach - would need proper calculation based on year
    return 30;
  } else {
    return 30;
  }
}

/**
 * Helper function to get the Parasha name for a given Shabbat
 * This is a placeholder - implementing this fully requires complex calculations
 * @param {Date} date - The date to check
 * @returns {string|null} - Name of the Parasha or null
 */
function getParashaName(date) {
  // This would need a full implementation with proper Parasha cycle calculations
  // For now, return null to indicate a generic Shabbat
  return null;
}