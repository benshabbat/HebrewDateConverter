import { useEffect } from 'react';

/**
 * הוק לזיהוי לחיצה מחוץ לאלמנט
 * 
 * @param {React.RefObject} ref - הפניה לאלמנט שיש לעקוב אחריו
 * @param {Function} callback - פונקציה שתופעל כאשר תזוהה לחיצה מחוץ לאלמנט
 * @param {Array} deps - מערך של תלויות לשינוי בהן נאזין
 */
const useClickOutside = (ref, callback, deps = []) => {
  useEffect(() => {
    // פונקציה לטיפול בלחיצה בכל מקום במסמך
    const handleClickOutside = (event) => {
      // אם הלחיצה לא הייתה על האלמנט או על אחד מצאצאיו
      if (ref.current && !ref.current.contains(event.target)) {
        callback(); // הפעל את פונקציית הקולבק
      }
    };
    
    // הוספת מאזין לאירוע לחיצה מחוץ לאלמנט
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // תמיכה במגע למובייל
    
    // ניקוי המאזינים כאשר הקומפוננטה מפורקת
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback, ...deps]);
};

export default useClickOutside;