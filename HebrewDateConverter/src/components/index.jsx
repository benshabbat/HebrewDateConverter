import React, { useState, useEffect } from 'react';
import { HebrewDateDisplay, DateInput, Header } from './components';
import { useHebrewDate } from './hooks/useHebrewDate';
import './styles.css';

const HebrewDateConverter = () => {
  // State for device detection
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isIOS: false,
    isOnline: true
  });

  // Use custom hook for Hebrew date conversion
  const {
    gregorianDate,
    setGregorianDate,
    hebrewDate,
    dayOfWeek,
    holidayInfo,
    loading,
    error
  } = useHebrewDate();

  // Detect device on mount
  useEffect(() => {
    const detectDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Device detection
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      
      setDeviceInfo({
        isMobile: isMobileDevice,
        isIOS: isIOSDevice,
        isOnline: navigator.onLine
      });
    };
    
    detectDeviceInfo();
    
    // Listen for online/offline events
    const handleOnlineStatusChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  
  // Handler for date change
  const handleDateChange = (newDate) => {
    setGregorianDate(newDate);
  };

  // Offline indicator component
  const OfflineIndicator = !deviceInfo.isOnline ? (
    <div className="bg-yellow-500 text-white text-center py-2 px-4 rounded-lg mb-4">
      <p className="text-sm font-medium">אתה במצב לא מקוון</p>
      <p className="text-xs">התאריכים עדיין פעילים, אך חלק מהנתונים עשויים לא להיות זמינים</p>
    </div>
  ) : null;

  // Container padding based on device
  const containerPadding = deviceInfo.isMobile ? 'p-4' : 'p-6';
  
  // Current year for footer
  const currentYear = new Date().getFullYear();

  return (
    <div 
      className={`max-w-lg mx-auto ${containerPadding} bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl text-right`} 
      dir="rtl"
    >
      {/* Offline indicator */}
      {OfflineIndicator}
      
      {/* Header */}
      <Header title="ממיר תאריכים עברי" version="2.2" />
      
      {/* Date input */}
      <DateInput 
        value={gregorianDate} 
        onChange={handleDateChange} 
        error={error}
      />
      
      {/* Hebrew date display */}
      <HebrewDateDisplay 
        hebrewDate={hebrewDate}
        dayOfWeek={dayOfWeek}
        note={holidayInfo}
        loading={loading}
        gregorianDate={gregorianDate}
        isMobile={deviceInfo.isMobile}
      />
      
      {/* Footer */}
      <div className="mt-6 text-center text-indigo-400 text-xs">
        <p>פותח ע"י דוד-חן בן שבת • {currentYear}</p>
      </div>
    </div>
  );
};

export default HebrewDateConverter;