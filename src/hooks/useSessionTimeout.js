import { useCallback, useEffect, useRef, useState } from 'react';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 2 * 60 * 1000; // Show warning 2 minutes before timeout
const ACTIVITY_EVENTS = ['mousedown', 'keypress', 'touchstart', 'scroll'];

export default function useSessionTimeout(onTimeout) {
  const [showWarning, setShowWarning] = useState(false);
  const warningActiveRef = useRef(false);
  const timerRef = useRef(null);
  const warningRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    // Don't reset if warning modal is showing — let the buttons handle it
    if (warningActiveRef.current) return;

    clearTimers();
    setShowWarning(false);

    warningRef.current = setTimeout(() => {
      warningActiveRef.current = true;
      setShowWarning(true);
    }, TIMEOUT_MS - WARNING_MS);

    timerRef.current = setTimeout(() => {
      warningActiveRef.current = false;
      setShowWarning(false);
      onTimeout?.();
    }, TIMEOUT_MS);
  }, [clearTimers, onTimeout]);

  const extendSession = useCallback(() => {
    warningActiveRef.current = false;
    clearTimers();
    setShowWarning(false);

    warningRef.current = setTimeout(() => {
      warningActiveRef.current = true;
      setShowWarning(true);
    }, TIMEOUT_MS - WARNING_MS);

    timerRef.current = setTimeout(() => {
      warningActiveRef.current = false;
      setShowWarning(false);
      onTimeout?.();
    }, TIMEOUT_MS);
  }, [clearTimers, onTimeout]);

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, resetTimer, { passive: true }),
    );
    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, resetTimer),
      );
      clearTimers();
    };
  }, [resetTimer, clearTimers]);

  return { showWarning, extendSession };
}
