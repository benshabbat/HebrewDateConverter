# Hebrew Date Converter

A modern React application built with Vite that converts Gregorian dates to Hebrew dates. The converter displays the date in traditional Hebrew format with proper Gematria notation and handles special cases like Adar I/II in leap years.

![Hebrew Date Converter Screenshot](screenshot.png)

## Features

- Convert any Gregorian date to its Hebrew calendar equivalent
- Display Hebrew dates with proper Gematria notation (א׳, ב׳, etc.)
- Support for Adar I and Adar II in leap years
- Modern, responsive UI with gradient design
- Error handling and validation
- No external date conversion libraries needed (uses browser's built-in Intl.DateTimeFormat)

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- JavaScript (ES6+)
- Intl.DateTimeFormat API

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

## Project Structure

```
src/
├── components/
│   └── HebrewDateConverter/
│       ├── index.jsx           # Main component
│       ├── DateInput.jsx       # Gregorian date input component
│       ├── HebrewDateDisplay.jsx  # Hebrew date display component
│       └── hebrewDateUtils.js  # Utility functions for date conversion
├── App.jsx
└── main.jsx
```

## Using the Converter

1. Select a date using the date picker
2. The Hebrew date will be displayed automatically
3. The converter handles all the complexities of the Hebrew calendar, including:
   - Converting numbers to Gematria (Hebrew numerals)
   - Properly formatting Adar I and Adar II in leap years
   - Formatting years according to traditional notation

## Styling with Tailwind CSS

This project uses Tailwind CSS through a CDN. If you prefer to install Tailwind locally:

1. Install Tailwind CSS
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Configure `tailwind.config.js`
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. Add Tailwind directives to your CSS
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## License

MIT

## Acknowledgements

- The Hebrew calendar conversion uses the browser's built-in `Intl.DateTimeFormat` API with custom enhancements for Gematria and formatting
- Calendar icon and UI elements from Tailwind CSS
- Gradient design inspired by modern web design trends