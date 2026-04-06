const SIZE_MAP = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-lg',
  '4xl': 'h-24 w-24 text-lg',
  '6xl': 'h-30 w-30 text-lg',
};

/**
 * Avatar component — shows user image or initials fallback.
 *
 * @param {string}  [src]        - Image URL
 * @param {string}  [name]       - Full name (used for initials fallback)
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [size] - Avatar size
 * @param {boolean} [online]     - Show green online indicator
 * @param {string}  [className]  - Extra classes
 */
export default function Avatar({
  src,
  name = '',
  size = 'md',
  variant = 'circle',
  online,
  className = '',
  ...props
}) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`${sizeClass} rounded-${variant === 'square' ? 'lg' : 'full'} object-cover border border-border-light`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-${variant === 'square' ? 'lg' : 'full'} flex items-center justify-center font-semibold bg-primary-100 text-primary-700 border border-primary-200`}
        >
          {initials || '?'}
        </div>
      )}

      {online !== null && online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-surface ${
            online ? 'bg-success-500' : 'bg-neutral-300'
          }`}
        />
      )}
    </div>
  );
}
