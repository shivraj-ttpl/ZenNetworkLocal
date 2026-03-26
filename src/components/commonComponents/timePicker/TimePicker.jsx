import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

const TimePicker = ({
  label = '',
  name = '',
  isRequired = false,
  value = null,
  onChangeCb = () => {},
  placeholder = 'Select Time',
  disabled = false,
  className = '',
  error = null,
  touched = false,
}) => {
  const showError = touched && error;
  const parsedValue = value ? dayjs(value) : null;

  const handleChange = (newValue) => {
    onChangeCb(newValue ? newValue.toISOString() : null);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-normal text-text-primary">
          {label}
          {isRequired && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopTimePicker
          value={parsedValue}
          onChange={handleChange}
          disabled={disabled}
          timeSteps={{ minutes: 1 }}
          views={['hours', 'minutes']}
          ampm
          inver
          slotProps={{
            textField: {
              id: name,
              name,
              placeholder,
              size: 'small',
              error: showError,
              helperText: showError ? error : '',
              fullWidth: true,
              sx: {
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-surface, #fff)',
                  '& fieldset': {
                    borderColor: showError
                      ? 'var(--color-error-400, #f87171)'
                      : 'var(--color-border, #e5e7eb)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary, #2563eb)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary, #2563eb)',
                    borderWidth: '1px',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px 14px',
                  fontSize: '14px',
                  '&::placeholder': {
                    color: 'var(--color-text-placeholder, #9ca3af)',
                    opacity: 1,
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: '12px',
                  marginLeft: 0,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TimePicker;
