/**
 * Constants and descriptions for Hebrew dates
 */

export const HOLIDAY_TYPES = {
    MAJOR_HOLIDAY: 'major-holiday',     // Major holiday (like Passover, Sukkot, Shavuot, Rosh Hashanah, Yom Kippur)
    MINOR_HOLIDAY: 'minor-holiday',     // Minor holiday (like Chanukah, Purim, Tu BiShvat)
    REMEMBRANCE: 'remembrance',         // Remembrance days (like Holocaust Remembrance Day, Memorial Day)
    INDEPENDENCE: 'independence',       // Independence days (Independence Day)
    CHOL_HAMOED: 'chol-hamoed',         // Intermediate days of festivals
    SHABBAT: 'shabbat',                 // Shabbat
    ROSH_CHODESH: 'rosh-chodesh',       // New Hebrew month
    FAST_DAY: 'fast-day',               // Fast day
    SPECIAL_DAY: 'special-day'          // Other special days
  };
  
  // Information about holidays and special days in the Hebrew calendar
  export const HOLIDAYS_INFO = {
    // Tishrei holidays
    'ראש השנה': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Jewish New Year, first day of Tishrei'
    },
    'צום גדליה': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'Fast for the murder of Gedaliah'
    },
    'יום כיפור': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Day of Atonement, day of fasting and repentance'
    },
    'סוכות': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Feast of Tabernacles'
    },
    'חול המועד סוכות': {
      type: HOLIDAY_TYPES.CHOL_HAMOED,
      description: 'Intermediate days of Sukkot'
    },
    'הושענא רבה': {
      type: HOLIDAY_TYPES.SPECIAL_DAY,
      description: 'Seventh day of Sukkot'
    },
    'שמיני עצרת': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Eighth day of Sukkot'
    },
    'שמחת תורה': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Simchat Torah'
    },
    
    // Kislev-Tevet holidays
    'חנוכה': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'Festival of Lights'
    },
    
    // Shevat-Adar holidays
    'ט״ו בשבט': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'New Year for Trees'
    },
    'פורים': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'Purim'
    },
    'שושן פורים': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'Purim celebrated in walled cities from Joshua\'s time'
    },
    
    // Nisan-Iyar holidays
    'פסח': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Passover'
    },
    'חול המועד פסח': {
      type: HOLIDAY_TYPES.CHOL_HAMOED,
      description: 'Intermediate days of Passover'
    },
    'שביעי של פסח': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Seventh and final day of Passover'
    },
    'יום השואה': {
      type: HOLIDAY_TYPES.REMEMBRANCE,
      description: 'Holocaust Remembrance Day'
    },
    'יום הזיכרון': {
      type: HOLIDAY_TYPES.REMEMBRANCE,
      description: 'Memorial Day for Fallen Soldiers and Victims of Terrorism'
    },
    'יום העצמאות': {
      type: HOLIDAY_TYPES.INDEPENDENCE,
      description: 'Israel Independence Day'
    },
    'ל״ג בעומר': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'Lag BaOmer, 33rd day of the Omer count'
    },
    
    // Sivan holidays
    'שבועות': {
      type: HOLIDAY_TYPES.MAJOR_HOLIDAY,
      description: 'Shavuot, Festival of Weeks'
    },
    
    // Tammuz-Av holidays
    'צום י״ז בתמוז': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'Beginning of Three Weeks, commemorating the breach of Jerusalem\'s walls'
    },
    'תשעה באב': {
      type: HOLIDAY_TYPES.FAST_DAY,
      description: 'Fast day commemorating the destruction of the Temples'
    },
    'ט״ו באב': {
      type: HOLIDAY_TYPES.MINOR_HOLIDAY,
      description: 'Hebrew love festival'
    },
    
    // Other recurring days
    'שבת': {
      type: HOLIDAY_TYPES.SHABBAT,
      description: 'Weekly Shabbat'
    },
    'ראש חודש': {
      type: HOLIDAY_TYPES.ROSH_CHODESH,
      description: 'New Hebrew month'
    }
  };
  
  /**
   * Function that returns the holiday type by name
   * @param {string} holidayName - Name of holiday
   * @returns {string} - Holiday type or 'special-day' as default
   */
  export const getHolidayType = (holidayName) => {
    if (!holidayName) return null;
    
    // Direct lookup in holidays table
    const exactMatch = HOLIDAYS_INFO[holidayName];
    if (exactMatch) return exactMatch.type;
    
    // Partial match if no exact match
    for (const [name, info] of Object.entries(HOLIDAYS_INFO)) {
      if (holidayName.includes(name)) {
        return info.type;
      }
    }
    
    // Specific lookup for Chol HaMoed
    if (holidayName.includes('חול המועד')) {
      return HOLIDAY_TYPES.CHOL_HAMOED;
    }
    
    return HOLIDAY_TYPES.SPECIAL_DAY;
  };