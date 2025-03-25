import React from 'react';
import CopyButton from './CopyButton';
import ExpandButton from './ExpandButton';

/**
 * קומפוננטת פעולות על התאריך - מותאמת למולטי-פלטפורם
 * 
 * @param {boolean} copied - האם הועתק ללוח
 * @param {function} onCopy - פונקציה להעתקה ללוח
 * @param {boolean} expanded - האם התוכן מורחב
 * @param {function} onExpand - פונקציה להרחבה/צמצום
 * @returns {JSX.Element} - קומפוננטת React לפעולות על התאריך
 */
const DateActions = ({ copied, onCopy, expanded, onExpand }) => {
  return (
    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
      <div className="w-full sm:w-auto">
        <CopyButton 
          copied={copied} 
          onClick={onCopy} 
        />
      </div>
      <div className="flex justify-center sm:justify-end">
        <ExpandButton 
          expanded={expanded} 
          onClick={onExpand}
        />
      </div>
    </div>
  );
};

export default DateActions;