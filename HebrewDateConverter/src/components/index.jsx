// src/components/index.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DateInput from './date-fields/DateInput';
import HebrewDateDisplay from './HebrewDateDisplay';
import { 
  formatDate, 
  convertToHebrewDate, 
  getHebrewDayOfWeek 
} from './hebrewDateUtils';
import { getHolidayInfo } from '../utils/holidayUtils';

/**
 * קומפוננטה ראשית של ממיר תאריכים עברי עם תמיכה משופרת במולטיפלטפורמה וחגים
 * 
 * @param {Object} props - פרופס של הקומפוננטה
 * @param {boolean} props.isMobile - האם האפליקציה רצה על מכשיר נייד
 * @param {boolean} props.isIOS - האם האפליקציה רצה על מכשיר iOS
 * @returns {JSX.Element} - הקומפוננטה הראשית
 */
const HebrewDateConverter = ({ isMobile, isIOS }) => {
  // ניהול סטייט
  const [gregorianDate, setGregorianDate] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateHeader, setAnimateHeader] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: isMobile || false,
    isIOS: isIOS || false,
    isOnline: true,
    userAgent: ''
  });
  
  // רפים לטיימרים
  const loadingTimerRef = useRef(null);
  const headerAnimationTimerRef = useRef(null);
  const conversionDelayTimerRef = useRef(null);

  // אתחול עם התאריך הנוכחי וזיהוי מכשיר
  useEffect(() => {
    // קבלת התאריך הנוכחי
    const today = new Date();
    setGregorianDate(formatDate(today));
    
    // זיהוי סוגי מכשירים נוספים
    const detectDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // זיהוי מכשיר נייד
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // זיהוי סוג מערכת הפעלה
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isAndroidDevice = /android/.test(userAgent);
      const isWindowsDevice = /windows/.test(userAgent);
      
      // זיהוי דפדפן
      const isChrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      const isFirefox = /firefox/.test(userAgent);
      const isEdge = /edg/.test(userAgent);
      
      // זיהוי מצב מקוון
      const isOnline = navigator.onLine;
      
      setDeviceInfo({
        isMobile: isMobileDevice,
        isIOS: isIOSDevice,
        isAndroid: isAndroidDevice,
        isWindows: isWindowsDevice,
        isChrome,
        isSafari,
        isFirefox,
        isEdge,
        isOnline,
        userAgent
      });
    };
    
    detectDeviceInfo();
    
    // האזנה לשינויים במצב מקוון
    const handleOnlineStatusChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // אנימציה קצרה לכותרת
    setAnimateHeader(true);
    
    headerAnimationTimerRef.current = setTimeout(() => {
      setAnimateHeader(false);
    }, 1000);
    
    // ניקוי טיימרים בסיום
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      
      if (headerAnimationTimerRef.current) {
        clearTimeout(headerAnimationTimerRef.current);
      }
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
    };
  }, []);

  // המרת תאריך כאשר הוא משתנה
  useEffect(() => {
    if (gregorianDate) {
      // השהיית המרה לחוויית משתמש חלקה יותר
      if (conversionDelayTimerRef.current) {
        clearTimeout(conversionDelayTimerRef.current);
      }
      
      conversionDelayTimerRef.current = setTimeout(() => {
        convertDate();
      }, deviceInfo.isMobile ? 200 : 100); // השהייה ארוכה יותר במובייל
    }
  }, [gregorianDate, deviceInfo.isMobile]);

  /**
   * המרת תאריך לועזי לתאריך עברי
   */
  const convertDate = useCallback(() => {
    if (!gregorianDate) return;
    
    setLoading(true);
    console.log('Converting date:', gregorianDate);
    
    // ניקוי טיימר קודם אם קיים
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    
    // הוספת השהייה קלה עבור מחוון טעינה
    loadingTimerRef.current = setTimeout(() => {
      try {
        const date = new Date(gregorianDate);
        
        if (isNaN(date.getTime())) {
          setError('התאריך שהוזן אינו תקין');
          setLoading(false);
          return;
        }

        // המרה לתאריך עברי
        const hebrewDateResult = convertToHebrewDate(date);
        setHebrewDate(hebrewDateResult);
        
        // קבלת יום בשבוע
        setDayOfWeek(getHebrewDayOfWeek(date));
        
        // בדיקת חגים באמצעות זיהוי חגים משופר
        const holiday = getHolidayInfo(date);
        console.log('Holiday info result:', holiday);
        setHolidayInfo(holiday);
        
        setError('');
        setLoading(false);
      } catch (error) {
        console.error('שגיאה בהמרת התאריך:', error);
        setError('אירעה שגיאה בהמרת התאריך');
        setLoading(false);
      }
    }, deviceInfo.isMobile ? 300 : 200);
  }, [gregorianDate, deviceInfo.isMobile]);

  /**
   * טיפול בשינוי תאריך
   */
  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    
    if (newDate) {
      // וידוא תקינות התאריך
      const [yearStr] = newDate.split('-');
      const year = parseInt(yearStr);
      
      if (isNaN(year) || year < 1800 || year > 2300) {
        setError('השנה חייבת להיות בטווח 1800-2300');
        return;
      }
    }
    
    setError('');
    setGregorianDate(newDate);
  }, []);
  
  // מחלקות כותרת עבור אנימציה
  const headerClasses = useMemo(() => `flex justify-between items-center mb-6 pb-4 border-b border-indigo-200 transition-all duration-300 ${
    animateHeader ? 'transform -translate-y-1' : ''
  }`, [animateHeader]);

  // שנה נוכחית לפוטר
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // ריפוד רספונסיבי
  const containerPadding = deviceInfo.isMobile ? 'p-4' : 'p-6';
  
  // מחוון מצב לא מקוון
  const OfflineIndicator = useMemo(() => {
    if (deviceInfo.isOnline) return null;
    
    return (
      <div className="bg-yellow-500 text-white text-center py-2 px-4 rounded-lg mb-4">
        <p className="text-sm font-medium">אתה במצב לא מקוון</p>
        <p className="text-xs">התאריכים עדיין פעילים, אך חלק מהנתונים עשויים לא להיות זמינים</p>
      </div>
    );
  }, [deviceInfo.isOnline]);

  return (
    <div 
      className={`max-w-lg mx-auto ${containerPadding} bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl text-right`} 
      dir="rtl"
    >
      {/* מחוון מצב לא מקוון */}
      {OfflineIndicator}
      
      {/* כותרת */}
      <div className={headerClasses}>
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
          {/* אייקון לוח שנה */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>ממיר תאריכים עברי</span>
        </h1>
        
        <div className="text-xs text-indigo-400 bg-white bg-opacity-50 rounded-full px-3 py-1">
          גרסה 2.2
        </div>
      </div>
      
      {/* קלט תאריך */}
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {/* תצוגת תאריך עברי - העברת אובייקט מידע על חג מלא */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        note={holidayInfo}  // העברת אובייקט מידע על חג מלא
        loading={loading}
        gregorianDate={gregorianDate}
        isMobile={deviceInfo.isMobile}
      />
      
      {/* מידע על המכשיר - רק לצורך דיבאג */}
      {deviceInfo.isOnline && process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-2 bg-gray-100 rounded-lg text-xs text-gray-500">
          <p><strong>מידע מכשיר:</strong> {deviceInfo.isMobile ? 'נייד' : 'מחשב'}, 
            {deviceInfo.isIOS ? ' iOS' : deviceInfo.isAndroid ? ' Android' : deviceInfo.isWindows ? ' Windows' : ''}, 
            {deviceInfo.isChrome ? ' Chrome' : deviceInfo.isSafari ? ' Safari' : deviceInfo.isFirefox ? ' Firefox' : deviceInfo.isEdge ? ' Edge' : ''}
          </p>
        </div>
      )}
      
      {/* פוטר */}
      <div className="mt-6 text-center text-indigo-400 text-xs">
        <p>פותח ע"י דוד-חן בן שבת • {currentYear}</p>
      </div>
    </div>
  );
};

export default HebrewDateConverter;