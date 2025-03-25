import { useState, useEffect, useRef } from 'react';

/**
 * הוק לניהול אנימציות עם ניקוי אוטומטי של טיימרים
 * 
 * @param {number} duration - משך האנימציה במילישניות
 * @param {any} dependency - תלות שתפעיל מחדש את האנימציה בעת שינוי
 * @returns {boolean} - האם האנימציה פעילה
 */
const useAnimation = (duration, dependency) => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // רק אם יש ערך לתלות, הפעל את האנימציה
    if (dependency) {
      // הפעל את האנימציה
      setIsActive(true);
      
      // ניקוי טיימר קודם אם קיים
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // הגדר טיימר חדש לסיום האנימציה
      timerRef.current = setTimeout(() => {
        setIsActive(false);
        timerRef.current = null;
      }, duration);
    }
    
    // ניקוי בעת סיום
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dependency, duration]);

  return isActive;
};

export default useAnimation;