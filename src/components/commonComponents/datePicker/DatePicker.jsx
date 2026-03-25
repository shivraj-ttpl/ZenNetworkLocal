import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage } from "formik";
import { Icon } from "@/components/icons";

const   DatePicker = ({
  label = "",
  name = "",
  isRequired = false,
  value = null,
  onChangeCb = () => {},
  placeholder = "Select",
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 1,
  disabled = false,
  className = "",
  minDate,
  maxDate,
  minTime,
  maxTime,
  showMonthDropdown = true,
  showYearDropdown = true,
  onFocusCb = () => {},
  onMonthChange = () => {},
  error = null,
  touched = false,
  showMonthYearPicker = false,
  ...additionalProps
}) => {
  const showError = touched && error;

  const handleChange = (selectedDate) => {
    if (!selectedDate) {
      return onChangeCb(selectedDate);
    }
    if (showTimeSelectOnly || showTimeSelect) {
      onChangeCb(selectedDate);
    } else {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      onChangeCb(`${year}-${month}-${day}`);
    }
  };

  const getDateFormat = () => {
    if (showTimeSelectOnly) return "h:mm aa";
    if (showTimeSelect) return "MM/dd/yyyy hh:mm:ss aa";
    if (showMonthYearPicker) return "MM/yyyy";
    return "MM/dd/yyyy";
  };

  const parsedValue = value ? new Date(value) : null;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-normal text-text-primary">
          {label}
          {isRequired && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative [&_.react-datepicker-wrapper]:w-full">
        <ReactDatePicker
          {...additionalProps}
          id={name}
          name={name}
          selected={parsedValue}
          onChange={handleChange}
          placeholderText={placeholder}
          dateFormat={getDateFormat()}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          timeFormat="hh:mm aa"
          timeIntervals={timeIntervals}
          timeCaption="Time"
          minDate={minDate}
          maxDate={maxDate}
          minTime={minTime}
          maxTime={maxTime}
          onMonthChange={onMonthChange}
          showMonthYearPicker={showMonthYearPicker}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode="select"
          disabled={disabled}
          autoComplete="off"
          onFocus={onFocusCb}
          onKeyDown={(e) => e.preventDefault()}
          portalId="datepicker-portal"
          className={`
            w-full h-10 px-4 pr-11 rounded-lg border bg-surface
            text-sm text-neutral-800 placeholder-text-placeholder
            outline-none transition-colors
            focus:border-primary focus:ring-[0.5] focus:ring-primary
            disabled:bg-neutral-50 disabled:cursor-not-allowed
            ${showError ? "border-error-400" : "border-border"}
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 z-10">
          <Icon name="Calendar" size={18} />
        </div>
      </div>
      {showError && <p className="text-xs text-error-500">{error}</p>}
      {!showError && name && (
        <ErrorMessage name={name}>
          {(msg) => (
            <p className="text-xs text-error-500">
              {typeof msg === "string" ? msg : msg?.label}
            </p>
          )}
        </ErrorMessage>
      )}
    </div>
  );
};

export default DatePicker;
