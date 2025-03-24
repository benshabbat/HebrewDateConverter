import React, { useState, useEffect } from 'react';

/**
 * Component for displaying the converted Hebrew date
 * @param {Object} props
 * @param {string} props.hebrewDate - The converted Hebrew date
 * @param {string} props.dayOfWeek - The Hebrew day of week
 * @param {string} props.dateNote - Special note for the date (holiday, etc.)
 * @param {boolean} props.loading - Whether the date is loading
 * @param {string} props.gregorianDate - The original Gregorian date
 */
const HebrewDateDisplay = ({ 
  hebrewDate, 
  dayOfWeek, 
  dateNote, 
  loading, 
  gregorianDate 
}) => {
  const [animation, setAnimation] = useState(false);
  const [dateExpanded, setDateExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Trigger animation when date changes
  useEffect(() => {
    if (hebrewDate) {
      setAnimation(true);
      const timer = setTimeout(() => setAnimation(false), 700);
      return () => clearTimeout(timer);
    }
  }, [hebrewDate]);
  
  /**
   * Copy the date to clipboard
   * @param {Event} e - Click event
   */
  const copyToClipboard = (e) => {
    e.stopPropagation();
    
    const textToCopy = dateNote 
      ? `${dayOfWeek}, ${hebrewDate} (${dateNote})`
      : `${dayOfWeek}, ${hebrewDate}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">מחשב תאריך עברי...</p>
      </div>
    );
  }
  
  // Don't render anything if no date
  if (!hebrewDate) {
    return null;
  }

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
        dateExpanded ? 'ring-2 ring-indigo-300' : ''
      } ${animation ? 'scale-105' : ''}`}
      onClick={() => setDateExpanded(!dateExpanded)}
    >
      {/* Date Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">התאריך העברי</h2>
          <span className="text-sm bg-white bg-opacity-30 px-3 py-1 rounded-full">
            {dayOfWeek}
          </span>
        </div>
      </div>
      
      {/* Date Display */}
      <div className="p-6">
        <div className="text-3xl font-bold text-center mb-4 text-indigo-900">
          {hebrewDate}
        </div>
        
        {dateNote && (
          <div className="flex justify-center mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full">
              {dateNote}
            </span>
          </div>
        )}
        
        {/* Expanded Info */}
        {dateExpanded && (
          <div className="mt-4 pt-4 border-t border-indigo-100 text-sm text-indigo-700">
            <p>התאריך הלועזי: {gregorianDate.split('-').reverse().join('/')}</p>
            {dateNote && <p className="mt-1">מועד מיוחד: {dateNote}</p>}
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={copyToClipboard}
            className={`flex items-center text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                הועתק!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                העתק תאריך
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              setDateExpanded(!dateExpanded);
            }}
            className="text-indigo-500 hover:text-indigo-700"
          >
            {dateExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HebrewDateDisplay;