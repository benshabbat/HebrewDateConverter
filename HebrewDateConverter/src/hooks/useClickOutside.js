import { useEffect } from 'react';

/**
 * Hook to detect clicks outside an element
 * 
 * @param {React.RefObject} ref - Reference to the element to track
 * @param {Function} callback - Function to call when click is detected outside element
 * @param {Array} deps - Dependencies to listen for changes
 */
export const useClickOutside = (ref, callback, deps = []) => {
  useEffect(() => {
    // Function to handle clicks anywhere in document
    const handleClickOutside = (event) => {
      // If click was not on element or its descendants
      if (ref.current && !ref.current.contains(event.target)) {
        callback(); // Call the callback function
      }
    };
    
    // Add listener for click events outside element
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Support touch for mobile
    
    // Cleanup listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback, ...deps]);
};