import { useState, useRef, useEffect, useCallback } from 'react';

const POSITIONS = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: '-bottom-2 left-1/2 -translate-x-1/2 border-b border-r',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: '-top-2 left-1/2 -translate-x-1/2 border-l border-t',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: '-right-2 top-1/2 -translate-y-1/2 border-t border-r',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: '-left-2 top-1/2 -translate-y-1/2 border-b border-l',
  },
  'bottom-end': {
    container: 'top-full right-0 mt-2',
    arrow: '-top-2 right-6 border-l border-t',
  },
  'bottom-start': {
    container: 'top-full left-0 mt-2',
    arrow: '-top-2 left-6 border-l border-t',
  },
  'top-end': {
    container: 'bottom-full right-0 mb-2',
    arrow: '-bottom-2 right-6 border-b border-r',
  },
  'top-start': {
    container: 'bottom-full left-0 mb-2',
    arrow: '-bottom-2 left-6 border-b border-r',
  },
};

function ToolTip({
  children,
  content,
  position = 'bottom',
  trigger = 'hover',
  showArrow = true,
  contentClassName = '',
  wrapperClassName = '',
  disabled = false,
  offset,
}) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);

  const show = useCallback(() => {
    if (!disabled) setVisible(true);
  }, [disabled]);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (trigger !== 'click') return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, trigger]);

  const posConfig = POSITIONS[position] || POSITIONS.bottom;

  const hoverProps =
    trigger === 'hover'
      ? { onMouseEnter: show, onMouseLeave: hide }
      : {};

  const clickProps =
    trigger === 'click'
      ? { onClick: () => (visible ? hide() : show()) }
      : {};

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${wrapperClassName}`}
      {...hoverProps}
      {...clickProps}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-50 ${posConfig.container} ${offset || ''}`}
        >
          <div
            className={`relative bg-surface border border-border-light rounded-xl shadow-lg overflow-hidden ${contentClassName}`}
          >
            {showArrow && (
              <div
                className={`absolute w-4 h-4 bg-surface border-border-light rotate-45 ${posConfig.arrow}`}
              />
            )}
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolTip;
