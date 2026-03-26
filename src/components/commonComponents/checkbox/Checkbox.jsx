import { useRef, useEffect } from "react";

const VARIANTS = {
  primary: {
    base: "border-neutral-300",
    hover: "group-hover:border-primary",
    focusRing: "group-focus-within:ring-2 group-focus-within:ring-primary-100",
    checked: "bg-primary border-primary",
    disabled: "bg-primary-200 border-primary-200",
    disabledUnchecked: "bg-neutral-100 border-neutral-200",
  },
  secondary: {
    base: "border-neutral-300",
    hover: "group-hover:border-secondary",
    focusRing: "group-focus-within:ring-2 group-focus-within:ring-secondary-100",
    checked: "bg-secondary border-secondary",
    disabled: "bg-secondary-200 border-secondary-200",
    disabledUnchecked: "bg-neutral-100 border-neutral-200",
  },
  blue: {
    base: "border-neutral-300",
    hover: "group-hover:border-primary-400",
    focusRing: "group-focus-within:ring-2 group-focus-within:ring-primary-100",
    checked: "bg-primary-500 border-primary-500",
    disabled: "bg-primary-200 border-primary-200",
    disabledUnchecked: "bg-neutral-100 border-neutral-200",
  },
};

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export default function Checkbox({
  label,
  name,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  readOnly = false,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const inputRef = useRef(null);
  const colors = VARIANTS[variant] || VARIANTS.primary;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const isActive = checked || indeterminate;

  const boxClasses = [
    `${SIZES[size] || SIZES.md} rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150`,
    disabled
      ? isActive
        ? colors.disabled
        : colors.disabledUnchecked
      : isActive
        ? colors.checked
        : `${colors.base} ${colors.hover}`,
    !disabled && colors.focusRing,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={`group inline-flex items-center gap-2 select-none ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
    >
      {/* Hidden native input for a11y + form support */}
      <input
        ref={inputRef}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={disabled || readOnly ? undefined : onChange}
        readOnly={readOnly}
        disabled={disabled}
        className="sr-only"
        {...props}
      />

      {/* Custom visual checkbox */}
      <span className={boxClasses}>
        {checked && !indeterminate && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && (
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
            <path
              d="M1 1H9"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      {label && (
        <span className={`text-sm ${disabled ? "text-neutral-400" : "text-neutral-700"}`}>
          {label}
        </span>
      )}
    </label>
  );
}
