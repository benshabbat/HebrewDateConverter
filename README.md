# Hebrew Date Converter

A modern React application built with Vite that converts Gregorian dates to Hebrew dates with proper Gematria notation and holiday information.

**Live Demo:** [https://hebrew-date-converter-topaz.vercel.app/](https://hebrew-date-converter-topaz.vercel.app/)

**Created by:** David-Chen Benshabbat

## Features

- Convert any Gregorian date to its Hebrew calendar equivalent
- Display Hebrew dates with proper Gematria notation (א׳, ב׳, etc.)
- Support for Adar I and Adar II in leap years
- Display day of the week (יום ראשון, יום שני, etc.)
- Highlight special dates and Jewish holidays
- Smart date input with validation and constraints:
  - Year range limited to 1300-2500
  - Proper handling of month lengths (February 28/29 days)
  - Hebrew month names in dropdown
- Elegant UI with responsive design

## Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/benshabbat/HebrewDateConverter.git
   cd hebrew-date-converter
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Intl.DateTimeFormat API for Hebrew calendar conversions

## Project Structure

```
src/
├── components/
│   └── HebrewDateConverter/
│       ├── index.jsx           # Main component
│       ├── DateInput.jsx       # Custom date input component
│       ├── HebrewDateDisplay.jsx  # Hebrew date display component
│       └── hebrewDateUtils.js  # Utility functions for date conversion
├── App.jsx
└── main.jsx
```

## How It Works

The converter uses the browser's built-in `Intl.DateTimeFormat` API with Hebrew locale and calendar settings to perform the complex calendar conversions. This is enhanced with custom code for:

1. Converting numbers to Hebrew Gematria notation
2. Proper handling of Adar I/II in leap years
3. Identifying and displaying Jewish holidays
4. Smart date validation for different months

## About the Hebrew Calendar

The Hebrew calendar is a lunisolar calendar used for Jewish religious observances. It has several notable features:

- Months begin with the new moon
- Years are designed to keep holidays in their appropriate seasons
- Leap years add an extra month (Adar I) 7 times in a 19-year cycle
- Days begin at sunset rather than midnight

## License

MIT

## Development

This project was bootstrapped with Vite. To extend the functionality:

- Add more holidays and special dates
- Implement reverse conversion (Hebrew to Gregorian)
- Add support for Hebrew date calculations and comparisons

## Expanding ESLint Configuration

If you are developing a production application, consider using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript.