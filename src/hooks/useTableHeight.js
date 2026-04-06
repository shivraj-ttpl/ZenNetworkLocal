import { useCallback, useEffect, useState } from 'react';

/**
 * Dynamically calculate the max height for a table based on its position
 * in the viewport. Reacts to toolbar wrapping, window resizing, etc.
 *
 * @param {React.RefObject} ref - Ref attached to the element wrapping the Table
 * @param {number} [bottomOffset=70] - Space to reserve below the table (pagination + padding)
 * @returns {string} CSS maxHeight value (e.g. "620px")
 */
export function useTableHeight(ref, bottomOffset = 70) {
  const [maxHeight, setMaxHeight] = useState('500px');

  const calculate = useCallback(() => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top;
    const height = Math.max(200, window.innerHeight - top - bottomOffset);
    setMaxHeight(`${height}px`);
  }, [ref, bottomOffset]);

  useEffect(() => {
    calculate();

    const observer = new ResizeObserver(calculate);
    if (ref.current) {
      observer.observe(ref.current);
    }

    window.addEventListener('resize', calculate);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculate]);

  return maxHeight;
}
