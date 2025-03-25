import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for handling advanced touch interactions
 * Supports swipes, taps, and long presses
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.swipeThreshold - Minimum distance for swipe detection (px)
 * @param {number} options.longPressDelay - Time for long press detection (ms)
 * @param {function} options.onSwipeLeft - Callback for left swipe
 * @param {function} options.onSwipeRight - Callback for right swipe
 * @param {function} options.onSwipeUp - Callback for up swipe
 * @param {function} options.onSwipeDown - Callback for down swipe
 * @param {function} options.onTap - Callback for tap
 * @param {function} options.onDoubleTap - Callback for double tap
 * @param {function} options.onLongPress - Callback for long press
 * @returns {Object} - Handler functions to attach to elements
 */
const useTouchInteractions = ({
  swipeThreshold = 50,
  longPressDelay = 500,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  onLongPress
} = {}) => {
  // Touch interaction states
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isTouching, setIsTouching] = useState(false);

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: now
    });
    
    setIsTouching(true);
    
    // Set up long press timer
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress(e);
      }, longPressDelay);
      
      setLongPressTimer(timer);
    }
  }, [onLongPress, longPressDelay]);

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    // Cancel long press if moving significantly
    if (longPressTimer && isTouching) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStart.x);
      const deltaY = Math.abs(touch.clientY - touchStart.y);
      
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  }, [longPressTimer, isTouching, touchStart]);

  // Handle touch end
  const handleTouchEnd = useCallback((e) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (!isTouching) return;
    setIsTouching(false);
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const elapsedTime = Date.now() - touchStart.time;
    
    // Handle taps
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const now = Date.now();
      const timeSinceLastTap = now - lastTap;
      
      // Handle double tap
      if (timeSinceLastTap < 300 && onDoubleTap) {
        onDoubleTap(e);
        setLastTap(0); // Reset to prevent triple-tap detection
      } 
      // Handle single tap
      else if (onTap) {
        onTap(e);
        setLastTap(now);
      }
      
      return;
    }
    
    // Handle swipes - check for minimum velocity and distance
    const isSwipe = elapsedTime < 300 && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > swipeThreshold;
    
    if (!isSwipe) return;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight(e, deltaX);
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft(e, Math.abs(deltaX));
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown(e, deltaY);
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp(e, Math.abs(deltaY));
      }
    }
  }, [
    touchStart, 
    isTouching, 
    lastTap, 
    longPressTimer, 
    swipeThreshold, 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    onTap, 
    onDoubleTap
  ]);

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  // Handle touch cancel
  const handleTouchCancel = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsTouching(false);
  }, [longPressTimer]);

  // Return event handlers to attach to elements
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel
  };
};

export default useTouchInteractions;