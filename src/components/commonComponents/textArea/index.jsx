import { ErrorMessage } from 'formik';

function TextArea({
  label,
  placeholder = 'Type here',
  rows = '4',
  customClasses = '',
  shadow = false,
  value = '',
  onChangeCb = () => {},
  disabled = false,
  isRequired = false,
  name = '',
  errorContainerClasses = 'text-xs max-w-[350px]',
  enforceMaxRows = false,
  onBlur = () => {},
}) {
  const calculatedMaxHeight = `${Number(rows) * 24}px`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-xs font-medium text-neutral-600">
          {label}
          {isRequired && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={name}
        rows={rows}
        className={`
          focus:outline-none focus:border-primary
          border border-neutral-300 bg-white
          p-2 w-full rounded-md text-sm
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${shadow ? 'shadow-sm' : ''}
          ${customClasses}
        `}
        style={
          enforceMaxRows
            ? { maxHeight: calculatedMaxHeight, overflowY: 'auto' }
            : undefined
        }
        value={value}
        placeholder={placeholder}
        onChange={onChangeCb}
        disabled={disabled}
        name={name}
        onBlur={onBlur}
      />
      {name && (
        <div className={`mt-1 ${errorContainerClasses}`}>
          <ErrorMessage name={name}>
            {(msg) => (
              <div className="text-error-500 text-xs">
                {typeof msg === 'string' ? msg : msg.label}
              </div>
            )}
          </ErrorMessage>
        </div>
      )}
    </div>
  );
}

export default TextArea;
