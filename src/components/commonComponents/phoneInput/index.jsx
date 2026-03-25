import { useState, useEffect } from "react";
import PhoneInputLib from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneInput({
  name = "phone",
  label,
  placeholder = "Enter phone number",
  value,
  onChange,
  onBlur,
  defaultCountry = "AE",
  disabled = false,
  error,
  touched,
  required = false,
  className = "",
}) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const showError = touched && error;

  useEffect(() => {
    if (value && typeof value === "string" && value.startsWith("+")) {
      const countryCodeMap = {
        "+971": "AE", "+966": "SA", "+1": "US", "+44": "GB", "+91": "IN",
        "+86": "CN", "+33": "FR", "+49": "DE", "+81": "JP", "+82": "KR",
        "+61": "AU", "+55": "BR", "+52": "MX", "+39": "IT", "+34": "ES",
        "+31": "NL", "+46": "SE", "+47": "NO", "+45": "DK", "+41": "CH",
        "+90": "TR", "+20": "EG", "+27": "ZA", "+234": "NG", "+254": "KE",
        "+880": "BD", "+92": "PK", "+62": "ID", "+60": "MY", "+63": "PH",
        "+65": "SG", "+66": "TH", "+84": "VN", "+98": "IR", "+972": "IL",
        "+962": "JO", "+961": "LB", "+965": "KW", "+973": "BH", "+974": "QA",
        "+968": "OM",
      };

      let matched = null;
      let longest = "";
      for (const code in countryCodeMap) {
        if (value.startsWith(code) && code.length > longest.length) {
          longest = code;
          matched = countryCodeMap[code];
        }
      }
      if (matched) setSelectedCountry(matched);
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-normal text-text-primary">
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <div
        className={`
          phone-input-wrapper
          w-full h-12 rounded-lg border bg-surface overflow-hidden
          transition-colors
          focus-within:border-primary focus-within:ring-[0.5] focus-within:ring-primary
          ${disabled ? "bg-neutral-50 cursor-not-allowed opacity-60" : ""}
          ${showError ? "border-error-400" : "border-border"}
        `}
      >
        <PhoneInputLib
          international
          defaultCountry={selectedCountry}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          className="h-full"
        />
      </div>

      {showError && <p className="text-xs text-error-500">{error}</p>}

      <style>{`
        .phone-input-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 12px;
          gap: 0;
        }

        .phone-input-wrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-right: 12px;
          margin-right: 12px;
          border-right: 1px solid var(--color-border);
          align-self: stretch;
        }

        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 28px;
          height: 28px;
          min-width: 28px;
          box-shadow: none !important;
          background: transparent !important;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .phone-input-wrapper .PhoneInputCountryIcon--border {
          box-shadow: none !important;
          background: transparent !important;
        }

        .phone-input-wrapper .PhoneInputCountryIcon img,
        .phone-input-wrapper .PhoneInputCountryIcon svg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .phone-input-wrapper .PhoneInputCountrySelect {
          border: none !important;
          background: transparent !important;
          padding: 0;
          font-size: 14px;
          color: var(--color-text-primary);
          cursor: pointer;
          outline: none;
        }

        .phone-input-wrapper .PhoneInputCountrySelect:disabled {
          cursor: not-allowed;
        }

        .phone-input-wrapper .PhoneInputCountrySelect option {
          background-color: var(--color-surface);
          color: var(--color-text-primary);
        }

        .phone-input-wrapper .PhoneInputCountrySelectArrow {
          width: 8px;
          height: 8px;
          border-bottom-width: 2px;
          border-right-width: 2px;
          border-color: var(--color-neutral-500);
          margin-left: 6px;
          opacity: 1;
        }

        .phone-input-wrapper .PhoneInputInput {
          flex: 1;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          padding: 0 4px;
          font-size: 14px;
          color: var(--color-text-primary);
          height: 100%;
        }

        .phone-input-wrapper .PhoneInputInput::placeholder {
          color: var(--color-text-placeholder);
        }

        .phone-input-wrapper .PhoneInputInput:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
