import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for copying text to clipboard and managing copy state
 * 
 * @param {number} resetDelay - Time to reset copy state in milliseconds
 * @returns {Array} - [Copied successfully, copy function]
 */
export const useCopyToClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  
  // Copy function
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Clear previous timer if exists
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer to reset copy state
      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, resetDelay);
      
      return true;
    } catch (err) {
      console.error('Error copying: ', err);
      return false;
    }
  }, [resetDelay]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  
  return [copied, copyToClipboard];
};