import React from 'react';

/**
 * קומפוננטת רקע עמום למודאל - נראה רק במובייל
 * 
 * @param {boolean} isVisible - האם המודאל מוצג
 * @param {function} onClose - פונקציה לסגירת המודאל
 * @returns {JSX.Element|null} - רכיב React לרקע מודאל או null אם לא מוצג
 */
const ModalBackdrop = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
};

export default ModalBackdrop;