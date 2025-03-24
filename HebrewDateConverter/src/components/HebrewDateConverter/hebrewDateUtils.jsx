/**
 * Converts a number to its Hebrew representation (Gematria)
 * @param {number} num - Number to convert
 * @returns {string} Hebrew representation
 */
export const convertToGematriya = (num) => {
    // Special cases for religious reasons
    if (num === 15) return 'ט״ו';
    if (num === 16) return 'ט״ז';
    
    // Mapping of numeric values to Hebrew letters
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
  
    // Build the gematria representation
    for (const { value, letter } of letterValues) {
      while (remaining >= value) {
        result += letter;
        remaining -= value;
      }
    }
    
    // Add geresh (׳) or gershayim (״) punctuation
    if (result.length > 1) {
      return result.slice(0, -1) + '״' + result.slice(-1);
    } else if (result.length === 1) {
      return result + '׳';
    }
    
    return result;
  };
  
  /**
   * Converts a Gregorian date to Hebrew date
   * @param {Date} date - Gregorian date
   * @returns {string} Formatted Hebrew date
   */
  export const convertToHebrewDate = (date) => {
    // Use Intl.DateTimeFormat to get the Hebrew date
    const formatter = new Intl.DateTimeFormat(['he-IL'], {
      calendar: 'hebrew',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Get the raw Hebrew date
    const hebrewDateString = formatter.format(date);
    console.log("Raw Hebrew date:", hebrewDateString);
    
    // Split the Hebrew date into components
    const parts = hebrewDateString.split(' ');
    
    // Extract day, month and year components
    let dayPart = '';
    let monthPart = '';
    let yearPart = '';
    
    // Find the day (usually the first number)
    for (const part of parts) {
      const numMatch = part.match(/\d+/);
      if (numMatch && !dayPart) {
        dayPart = numMatch[0];
        continue;
      }
      
      // Find the year (usually the large number > 1000)
      if (numMatch && parseInt(numMatch[0], 10) > 1000) {
        yearPart = numMatch[0];
        continue;
      }
      
      // If it's a word that's not a preposition, it's likely the month
      if (!part.match(/^ב$|^ה$/) && !part.match(/^\d+$/)) {
        monthPart = part;
      }
    }
    
    console.log(`Raw parts - Day: ${dayPart}, Month: ${monthPart}, Year: ${yearPart}`);
    
    // Process the day to gematria
    const day = dayPart ? convertToGematriya(parseInt(dayPart, 10)) : '';
    
    // Process the month
    let month = monthPart;
    
    // Handle Adar in leap years
    if (month && month.includes('אדר')) {
      const hebrewMonth = new Intl.DateTimeFormat('he', { 
        calendar: 'hebrew', 
        month: 'numeric' 
      }).formatToParts(date).find(part => part.type === 'month')?.value;
      
      if (hebrewMonth) {
        const hebrewMonthNum = parseInt(hebrewMonth, 10);
        if (hebrewMonthNum === 6) {
          month = 'אדר א׳'; // Adar I
        } else if (hebrewMonthNum === 7) {
          month = 'אדר ב׳'; // Adar II
        }
      }
    } else if (month === 'א׳') {
      // In case Adar was already shortened to just א׳
      month = 'אדר א׳';
    } else if (month === 'ב׳') {
      // In case Adar was already shortened to just ב׳
      month = 'אדר ב׳';
    }
    
    // Process the year
    let year = '';
    if (yearPart) {
      const yearNum = parseInt(yearPart, 10);
      if (yearNum >= 5000 && yearNum < 6000) {
        // Year is in the 5000-6000 range (common for current era)
        const lastTwoDigits = yearNum % 100;
        year = `ה׳תש${convertToGematriya(lastTwoDigits)}`;
      } else {
        // Other years
        year = convertToGematriya(yearNum);
      }
    }
    
    // Assemble the final Hebrew date
    let processedDate = '';
    if (day && month) {
      // Fix Adar I/II if needed
      let displayMonth = month;
      if (displayMonth === 'א׳') {
        displayMonth = 'אדר א׳';
      } else if (displayMonth === 'ב׳') {
        displayMonth = 'אדר ב׳';
      }
      
      processedDate = `${day} ${displayMonth}`;
      if (year) {
        processedDate += ` ${year}`;
      }
    } else {
      // Fallback if we couldn't properly parse the date
      processedDate = hebrewDateString
        .replace(/\s+ב/g, ' ') // Remove the preposition "ב" before month name
        .replace(/\s+ה/g, ' ') // Remove the preposition "ה" if present
        .replace(/(\d+)/g, (match) => {
          const num = parseInt(match, 10);
          if (num > 1000) {
            // If it's a large number (year)
            const lastTwoDigits = num % 100;
            return `ה׳תש${convertToGematriya(lastTwoDigits)}`;
          }
          return convertToGematriya(num);
        });
    }
    
    console.log("Final Hebrew date:", processedDate);
    return processedDate;
  };