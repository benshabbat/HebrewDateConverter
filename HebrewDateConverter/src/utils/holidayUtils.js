// src/utils/holidayUtils.js
import { HOLIDAY_TYPES, HOLIDAYS_INFO, getHolidayType } from '../constants/hebrewDates';

/**
 * פונקציה משופרת לזיהוי חגים יהודיים ותאריכים מיוחדים
 * @param {Date} date - התאריך לבדיקה
 * @returns {Object|null} - אובייקט עם מידע על החג או null אם אין
 */
export const getHolidayInfo = (date) => {
  try {
    if (!date || isNaN(date.getTime())) {
      console.error('תאריך לא תקין:', date);
      return null;
    }

    // קבלת רכיבי התאריך העברי באמצעות Intl API
    const formatter = new Intl.DateTimeFormat('he-IL', {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    
    // הדפסה לצורכי ניפוי באגים
    console.log('Hebrew date parts:', parts);
    
    const hebrewDay = parseInt(parts.find(part => part.type === 'day')?.value || '0', 10);
    const hebrewMonth = parseInt(parts.find(part => part.type === 'month')?.value || '0', 10);
    const hebrewYear = parseInt(parts.find(part => part.type === 'year')?.value || '0', 10);
    
    // שבת
    if (date.getDay() === 6) {
      return {
        name: 'שבת',
        type: HOLIDAY_TYPES.SHABBAT
      };
    }
    
    // ראש חודש
    if (hebrewDay === 1 && hebrewMonth !== 7) { // לא כולל ראש השנה
      return {
        name: `ראש חודש ${getHebrewMonthName(hebrewMonth)}`,
        type: HOLIDAY_TYPES.ROSH_CHODESH
      };
    }
    
    // חגי תשרי (חודש 7)
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
    
    // חנוכה
    if ((hebrewMonth === 9 && hebrewDay >= 25) || (hebrewMonth === 10 && hebrewDay <= 2)) {
      return {
        name: 'חנוכה',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // ט"ו בשבט
    if (hebrewMonth === 11 && hebrewDay === 15) {
      return {
        name: 'ט״ו בשבט',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // פורים
    if (hebrewMonth === 12 && hebrewDay === 14) {
      return {
        name: 'פורים',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // פסח וימי העומר
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
    
    // ל"ג בעומר
    if (hebrewMonth === 2 && hebrewDay === 18) {
      return {
        name: 'ל״ג בעומר',
        type: HOLIDAY_TYPES.MINOR_HOLIDAY
      };
    }
    
    // שבועות
    if (hebrewMonth === 3 && hebrewDay === 6) {
      return {
        name: 'שבועות',
        type: HOLIDAY_TYPES.MAJOR_HOLIDAY
      };
    }
    
    // צום י"ז בתמוז
    if (hebrewMonth === 4 && hebrewDay === 17) {
      return {
        name: 'צום י״ז בתמוז',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    // תשעה באב
    if (hebrewMonth === 5 && hebrewDay === 9) {
      return {
        name: 'תשעה באב',
        type: HOLIDAY_TYPES.FAST_DAY
      };
    }
    
    return null;
  } catch (error) {
    console.error('שגיאה בזיהוי חג:', error);
    return null;
  }
};

/**
 * המרת אובייקט מידע על חג למחרוזת תצוגה
 * @param {Object} holidayInfo - אובייקט מידע על החג
 * @returns {string|null} - שם החג כמחרוזת, או null אם אין חג
 */
export const getHolidayDisplayString = (holidayInfo) => {
  if (!holidayInfo) return null;
  return holidayInfo.name;
};

/**
 * פונקציית עזר לקבלת שם חודש עברי
 * @param {number} month - מספר חודש עברי (1-13)
 * @returns {string} - שם חודש עברי
 */
function getHebrewMonthName(month) {
  const hebrewMonthNames = [
    '',  // ריק עבור אינדוקס 1
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