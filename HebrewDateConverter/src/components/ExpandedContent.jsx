import React from 'react';

/**
 * קומפוננטת תוכן מורחב - מותאמת למולטי-פלטפורם
 * 
 * @param {boolean} expanded - האם התוכן מורחב
 * @param {string} gregorianDate - תאריך לועזי מפורמט
 * @param {string} dateNote - מועד מיוחד (אופציונלי)
 * @returns {JSX.Element} - קומפוננטת React לתוכן מורחב
 */
const ExpandedContent = ({ expanded, gregorianDate, dateNote }) => {
  const expandedContentClasses = `mt-3 sm:mt-4 overflow-hidden transition-all duration-300 ${
    expanded ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0'
  }`;

  return (
    <div className={expandedContentClasses}>
      <div className="pt-3 sm:pt-4 border-t border-indigo-100 text-xs sm:text-sm text-indigo-700 space-y-1 sm:space-y-2">
        <p className="flex flex-wrap">
          <span className="font-medium ml-1">תאריך לועזי:</span>
          <span>{gregorianDate}</span>
        </p>
        {dateNote && (
          <p className="flex flex-wrap">
            <span className="font-medium ml-1">מועד מיוחד:</span>
            <span>{dateNote}</span>
          </p>
        )}
        <p className="text-xs text-indigo-500 mt-1 sm:mt-2">
          לחץ על הכרטיס כדי {expanded ? 'לצמצם' : 'להרחיב'} את פרטי התאריך
        </p>
      </div>
    </div>
  );
};

export default ExpandedContent;