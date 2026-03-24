import { Icon } from "@/components/icons";

const VARIANTS = {
  primary:
    "bg-secondary hover:bg-secondary-600 text-text-inverse",
  secondary:
    "bg-surface hover:bg-neutral-50 text-neutral-700 border border-border",
  outline:
    "bg-transparent hover:bg-secondary-50 text-secondary border border-secondary",
  ghost:
    "bg-transparent hover:bg-neutral-100 text-neutral-600",
  link:
    "bg-transparent text-secondary hover:text-secondary-link underline-offset-4 hover:underline p-0 h-auto",
  primaryTeal:
    "bg-primary hover:bg-primary-600 text-text-inverse",
  outlineTeal:
    "bg-transparent hover:bg-primary-50 text-primary border border-primary",
  brandPrimary:
    "bg-[#007DCE] hover:bg-[#006bb3] text-text-inverse",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <Icon name="Loader2" size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
