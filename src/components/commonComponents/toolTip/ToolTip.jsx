import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  usePortal = false,
}) {
  const [visible, setVisible] = useState(false);
  const [portalStyle, setPortalStyle] = useState({});
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
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, trigger]);

  useEffect(() => {
    if (!usePortal || !visible || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const style = {};

    if (
      position === 'bottom' ||
      position === 'bottom-start' ||
      position === 'bottom-end'
    ) {
      style.top = rect.bottom + 8;
    } else if (
      position === 'top' ||
      position === 'top-start' ||
      position === 'top-end'
    ) {
      style.bottom = window.innerHeight - rect.top + 8;
    } else if (position === 'right') {
      style.top = rect.top + rect.height / 2;
      style.left = rect.right + 8;
      style.transform = 'translateY(-50%)';
    } else if (position === 'left') {
      style.top = rect.top + rect.height / 2;
      style.right = window.innerWidth - rect.left + 8;
      style.transform = 'translateY(-50%)';
    }

    if (
      position.endsWith('-start') ||
      position === 'bottom' ||
      position === 'top'
    ) {
      style.left = position.endsWith('-start')
        ? rect.left
        : rect.left + rect.width / 2;
      if (position === 'bottom' || position === 'top') {
        style.transform = 'translateX(-50%)';
      }
    }
    if (position.endsWith('-end')) {
      style.right = window.innerWidth - rect.right;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalStyle(style);
  }, [usePortal, visible, position]);

  const posConfig = POSITIONS[position] || POSITIONS.bottom;

  const hoverProps =
    trigger === 'hover' ? { onMouseEnter: show, onMouseLeave: hide } : {};

  const clickProps =
    trigger === 'click' ? { onClick: () => (visible ? hide() : show()) } : {};

  const tooltipContent = (
    <div
      className={`relative bg-surface border border-border-light rounded-xl shadow-lg ${contentClassName}`}
    >
      {showArrow && (
        <div
          className={`absolute w-4 h-4 bg-surface border-border-light rotate-45 ${posConfig.arrow}`}
        />
      )}
      {content}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${wrapperClassName}`}
      {...hoverProps}
      {...clickProps}
    >
      {children}

      {visible && !usePortal && (
        <div className={`absolute z-50 ${posConfig.container} ${offset || ''}`}>
          {tooltipContent}
        </div>
      )}

      {visible &&
        usePortal &&
        createPortal(
          <div
            className="fixed z-9999"
            style={portalStyle}
            onMouseEnter={trigger === 'hover' ? show : undefined}
            onMouseLeave={trigger === 'hover' ? hide : undefined}
          >
            {tooltipContent}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default ToolTip;
