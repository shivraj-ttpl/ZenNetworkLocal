import 'react-datepicker/dist/react-datepicker.css';

import ReactDatePicker from 'react-datepicker';

import { Icon } from '@/components/icons';

const toDateString = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDate = (str) => (str ? new Date(str) : null);

/**
 * DateRangePicker — select a start + end date range.
 *
 * value: { startDate: 'YYYY-MM-DD' | null, endDate: 'YYYY-MM-DD' | null }
 * onChangeCb: ({ startDate, endDate }) => void
 */
const DateRangePicker = ({
  label = '',
  name = '',
  isRequired = false,
  value = { startDate: null, endDate: null },
  onChangeCb = () => {},
  placeholder = 'Select date range',
  disabled = false,
  className = '',
  minDate,
  maxDate,
  error = null,
  touched = false,
}) => {
  const showError = touched && error;

  const startDate = toDate(value?.startDate);
  const endDate = toDate(value?.endDate);

  const handleChange = ([start, end]) => {
    onChangeCb({
      startDate: toDateString(start),
      endDate: toDateString(end),
    });
  };

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
          id={name}
          name={name}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          placeholderText={placeholder}
          dateFormat="MM/dd/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          autoComplete="off"
          onKeyDown={(e) => e.preventDefault()}
          portalId="datepicker-portal"
          className={`
            w-full h-10 px-4 pr-11 rounded-lg border bg-surface
            text-sm text-neutral-800 placeholder-text-placeholder
            outline-none transition-colors
            focus:border-primary focus:ring-[0.5]
            disabled:bg-neutral-50 disabled:cursor-not-allowed
            ${showError ? 'border-error-400' : 'border-border'}
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 z-10">
          <Icon name="Calendar" size={18} />
        </div>
      </div>
      {showError && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
};

export default DateRangePicker;
