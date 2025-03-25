import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing animations with automatic cleanup of timers
 * 
 * @param {number} duration - Animation duration in milliseconds
 * @param {any} dependency - Dependency that will trigger the animation when changed
 * @returns {boolean} - Whether the animation is active
 */
export const useAnimation = (duration, dependency) => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Only if there is a value for dependency, run the animation
    if (dependency) {
      // Activate the animation
      setIsActive(true);
      
      // Clear previous timer if exists
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer for animation end
      timerRef.current = setTimeout(() => {
        setIsActive(false);
        timerRef.current = null;
      }, duration);
    }
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dependency, duration]);

  return isActive;
};