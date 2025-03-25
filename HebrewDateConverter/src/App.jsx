import { useState, useEffect, useMemo } from "react";
import HebrewDateConverter from "./components";

/**
 * Main App component with multi-platform enhancements
 * Handles platform detection, orientation changes, and provides
 * platform-specific optimizations
 */
function App() {
  // State for platform detection
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Detect platform on mount
  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    };
    
    // Check if iOS
    const checkIOS = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    
    // Check if app is installed as PWA (standalone mode)
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator.standalone === true);
    };
    
    setIsMobile(checkMobile());
    setIsIOS(checkIOS());
    setIsStandalone(checkStandalone());
    setIsOnline(navigator.onLine);
    
    // Listen for online/offline events
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Listen for standalone mode changes (when app is installed)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleStandaloneChange = (e) => setIsStandalone(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleStandaloneChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleStandaloneChange);
    }
    
    // Prevent iOS overscroll behavior
    if (checkIOS()) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
    
    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleStandaloneChange);
      } else {
        mediaQuery.removeListener(handleStandaloneChange);
      }
    };
  }, []);

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Force redraw on orientation change to fix iOS rendering issues
      if (isIOS) {
        document.body.style.display = 'none';
        setTimeout(() => {
          document.body.style.display = '';
        }, 20);
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isIOS]);

  // Handle offline status display
  const OfflineIndicator = useMemo(() => {
    if (isOnline) return null;
    
    return (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-sm z-50">
        אתה במצב לא מקוון. התאריכים עדיין יעבדו, אבל הנתונים מהרשת לא זמינים.
      </div>
    );
  }, [isOnline]);

  // Handle PWA install suggestion
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  
  useEffect(() => {
    // Handle PWA installation
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e);
      
      // Show install button only on mobile and not already in standalone mode
      if (isMobile && !isStandalone) {
        setShowInstallPrompt(true);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile, isStandalone]);

  // Handle PWA install button
  const handleInstallClick = () => {
    if (!installPromptEvent) return;
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPromptEvent(null);
      setShowInstallPrompt(false);
    });
  };

  return (
    <>
      {OfflineIndicator}
      
      {showInstallPrompt && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-3 flex justify-between items-center z-40">
          <span>התקן את האפליקציה למכשיר שלך</span>
          <button 
            onClick={handleInstallClick}
            className="bg-white text-indigo-600 px-3 py-1 rounded-lg text-sm font-medium"
          >
            התקן
          </button>
        </div>
      )}
      
      <div className={`${!isOnline ? 'mt-6' : ''} ${showInstallPrompt ? 'mb-16' : ''}`}>
        <HebrewDateConverter isMobile={isMobile} isIOS={isIOS} />
      </div>
    </>
  );
}

export default App;