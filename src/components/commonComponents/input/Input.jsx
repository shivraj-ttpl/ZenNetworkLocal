import { useState } from "react";
import { Icon } from "@/components/icons";

const AUTO_COMPLETE_MAP = {
  email: "email",
  password: "current-password",
  newPassword: "new-password",
  confirmPassword: "new-password",
  username: "username",
  tel: "tel",
};

export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const showError = touched && error;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-normal text-text-primary"
        >
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete || AUTO_COMPLETE_MAP[name] || AUTO_COMPLETE_MAP[type] || "off"}
          disabled={disabled}
          className={`
            w-full h-11 px-4 rounded-lg border bg-surface
            text-sm text-neutral-800 placeholder-text-placeholder
            outline-none transition-colors
            focus:border-secondary focus:ring-1 focus:ring-secondary
            disabled:bg-neutral-50 disabled:cursor-not-allowed
            ${showError ? "border-error-400" : "border-border"}
            ${isPassword ? "pr-11" : ""}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        )}
      </div>
      {showError && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}
