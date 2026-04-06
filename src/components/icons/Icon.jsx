import { lazy, Suspense, useMemo } from 'react';

// ── Local SVG registry ──
// Add your custom SVG icons here. These take priority over lucide.
import CloseIcon from './vectors/CloseIcon';
import SearchIcon from './vectors/SearchIcon';
import SubOrgIcon from './vectors/SubOrgIcon';

const localIcons = {
  close: CloseIcon,
  search: SearchIcon,
  suborg: SubOrgIcon,
  // Add more:
  // bell: BellIcon,
  // filter: FilterIcon,
};

// ── Lucide dynamic fallback ──
// Caches lazy components so each lucide icon is only resolved once.
const lucideCache = {};

function getLucideIcon(name) {
  // Convert name to PascalCase for lucide lookup
  // e.g. "arrow-left" → "ArrowLeft", "chevronDown" → "ChevronDown"
  const pascalName = name
    .replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());

  if (!lucideCache[pascalName]) {
    lucideCache[pascalName] = lazy(() =>
      import('lucide-react').then((mod) => {
        const Icon = mod[pascalName];
        if (!Icon) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Icon] "${name}" not found in local icons or lucide-react`,
          );
          return { default: () => null };
        }
        return { default: Icon };
      }),
    );
  }

  return lucideCache[pascalName];
}

/**
 * Unified Icon component.
 *
 * 1. Looks up `name` in the local SVG registry (src/components/icons/vectors/)
 * 2. If not found, dynamically imports from lucide-react as fallback
 * 3. If neither has it, renders nothing + console warning
 *
 * Usage:
 *   <Icon name="close" />                          — local SVG
 *   <Icon name="close" color="red" size={24} />    — local with props
 *   <Icon name="ArrowLeft" />                       — lucide fallback
 *   <Icon name="chevron-down" size={16} />          — lucide (kebab-case OK)
 */
const Icon = ({
  name,
  color = 'currentColor',
  size = 20,
  width,
  height,
  className = '',
  style,
  onClick,
  ...props
}) => {
  const w = width ?? size;
  const h = height ?? size;

  const iconProps = {
    color,
    width: w,
    height: h,
    className,
    style: { ...style, cursor: onClick ? 'pointer' : undefined },
    onClick,
    ...props,
  };

  // 1. Check local registry (case-insensitive)
  const localKey = name.toLowerCase().replace(/[-_]/g, '');
  const LocalIcon = useMemo(
    () =>
      Object.entries(localIcons).find(
        ([key]) => key.toLowerCase() === localKey,
      )?.[1],
    [localKey],
  );

  if (LocalIcon) {
    return <LocalIcon {...iconProps} />;
  }

  // 2. Fallback to lucide-react (dynamic import, cached)
  const LucideIcon = getLucideIcon(name);

  return (
    <Suspense
      fallback={
        <span style={{ width: w, height: h, display: 'inline-block' }} />
      }
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <LucideIcon {...iconProps} />
    </Suspense>
  );
};

export default Icon;
