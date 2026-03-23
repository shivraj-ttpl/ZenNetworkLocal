import { useState, useCallback, useLayoutEffect } from "react";

/**
 * Auto-detects whether dropdown should open above or below the trigger.
 * Returns { direction, maxHeight } for the dropdown panel.
 */
export default function useDropdownPosition(triggerRef, isOpen, gap = 4) {
  const [position, setPosition] = useState({ direction: "down", maxHeight: 260 });

  const calculate = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const minHeight = 120;

    if (spaceBelow >= minHeight || spaceBelow >= spaceAbove) {
      setPosition({ direction: "down", maxHeight: Math.min(spaceBelow, 300) });
    } else {
      setPosition({ direction: "up", maxHeight: Math.min(spaceAbove, 300) });
    }
  }, [triggerRef, gap]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    calculate();
    window.addEventListener("scroll", calculate, true);
    window.addEventListener("resize", calculate);
    return () => {
      window.removeEventListener("scroll", calculate, true);
      window.removeEventListener("resize", calculate);
    };
  }, [isOpen, calculate]);

  return position;
}
