import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * הוק להעתקת טקסט ללוח וניהול מצב ההעתקה
 * 
 * @param {number} resetDelay - זמן איפוס מצב ההעתקה במילישניות
 * @returns {Array} - [האם הועתק בהצלחה, פונקציית העתקה]
 */
const useCopyToClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  
  // פונקציית העתקה
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // ניקוי טיימר קודם אם קיים
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // הגדר טיימר חדש לאיפוס מצב ההעתקה
      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, resetDelay);
      
      return true;
    } catch (err) {
      console.error('שגיאה בהעתקה: ', err);
      return false;
    }
  }, [resetDelay]);
  
  // ניקוי טיימרים בעת הסרת הקומפוננטה
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

export default useCopyToClipboard;