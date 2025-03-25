/**
 * קבועים ותיאורים של תאריכי החגים העבריים
 */

export const HOLIDAY_TYPES = {
    MAJOR_HOLIDAY: 'major-holiday',     // חג ראשי (כמו פסח, סוכות, שבועות, ראש השנה, יום כיפור)
    MINOR_HOLIDAY: 'minor-holiday',     // חג משני (כמו חנוכה, פורים, ט"ו בשבט)
    REMEMBRANCE: 'remembrance',         // ימי זיכרון (כמו יום השואה, יום הזיכרון)
    INDEPENDENCE: 'independence',       // ימי עצמאות (יום העצמאות)
    CHOL_HAMOED: 'chol-hamoed',         // חול המועד
    SHABBAT: 'shabbat',                 // שבת
    ROSH_CHODESH: 'rosh-chodesh',       // ראש חודש
    FAST_DAY: 'fast-day',               // יום צום
    SPECIAL_DAY: 'special-day'          // ימים מיוחדים אחרים
  };
  
  // מידע על החגים והימים המיוחדים בלוח העברי
  export const HOLIDAYS_INFO = {
    // חגי תשרי
    'ראש השנה': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'ראש השנה היהודי, היום הראשון בחודש תשרי'
    },
    'צום גדליה': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'צום לזכר רצח גדליה בן אחיקם'
    },
    'יום כיפור': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'יום הכיפורים, יום הצום והסליחה'
    },
    'סוכות': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'חג הסוכות'
    },
    'חול המועד סוכות': {
      type: HOLIDAY_TYPES.CHOL_HAMOED,
      description: 'ימי חול המועד של חג הסוכות'
    },
    'הושענא רבה': {
      type: HOLIDAY_TYPES.SPECIAL_DAY,
      description: 'היום השביעי של חג הסוכות'
    },
    'שמיני עצרת': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'היום השמיני של חג הסוכות'
    },
    'שמחת תורה': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'חג שמחת תורה'
    },
    
    // חגי כסלו-טבת
    'חנוכה': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'חג החנוכה, חג האורים'
    },
    
    // חגי שבט-אדר
    'ט״ו בשבט': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'ראש השנה לאילנות'
    },
    'פורים': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'חג הפורים'
    },
    'שושן פורים': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'פורים בערים המוקפות חומה מימות יהושע בן-נון'
    },
    
    // חגי ניסן-אייר
    'פסח': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'חג הפסח'
    },
    'חול המועד פסח': {
      type: HOLIDAY_TYPES.CHOL_HAMOED,
      description: 'ימי חול המועד של חג הפסח'
    },
    'שביעי של פסח': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'היום השביעי והאחרון של חג הפסח'
    },
    'יום השואה': {
      type: HOLIDAY_TYPES.REMEMBRANCE,
      description: 'יום הזיכרון לשואה ולגבורה'
    },
    'יום הזיכרון': {
      type: HOLIDAY_TYPES.REMEMBRANCE,
      description: 'יום הזיכרון לחללי מערכות ישראל ונפגעי פעולות האיבה'
    },
    'יום העצמאות': {
      type: HOLIDAY_TYPES.INDEPENDENCE,
      description: 'יום העצמאות של מדינת ישראל'
    },
    'ל״ג בעומר': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'ל"ג בעומר, היום ה-33 בספירת העומר'
    },
    
    // חגי סיוון
    'שבועות': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'חג השבועות, חג מתן תורה'
    },
    
    // חגי תמוז-אב
    'צום י״ז בתמוז': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'תחילת שלושת השבועות, זכר לפריצת חומות ירושלים'
    },
    'תשעה באב': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'יום צום וזיכרון לחורבן בית המקדש'
    },
    'ט״ו באב': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'חג האהבה העברי'
    },
    
    // ימים קבועים אחרים
    'שבת': {
      type: HOLIDAY_TYPES.SHABBAT,
      description: 'יום השבת השבועי'
    },
    'ראש חודש': {
      type: HOLIDAY_TYPES.ROSH_CHODESH,
      description: 'ראש החודש העברי'
    }
  };
  
  /**
   * פונקציה שמחזירה את סוג החג לפי שמו
   * @param {string} holidayName - שם החג
   * @returns {string} - סוג החג או 'special-day' כברירת מחדל
   */
  export const getHolidayType = (holidayName) => {
    if (!holidayName) return null;
    
    // בדיקה ישירה בטבלת החגים
    const exactMatch = HOLIDAYS_INFO[holidayName];
    if (exactMatch) return exactMatch.type;
    
    // חיפוש חלקי אם אין התאמה מדויקת
    for (const [name, info] of Object.entries(HOLIDAYS_INFO)) {
      if (holidayName.includes(name)) {
        return info.type;
      }
    }
    
    // חיפוש ספציפי עבור חול המועד
    if (holidayName.includes('חול המועד')) {
      return HOLIDAY_TYPES.CHOL_HAMOED;
    }
    
    return HOLIDAY_TYPES.SPECIAL_DAY;
  };