function RadioButton({
  label,
  checked = false,
  disabled = false,
  onChangeCb = () => {},
  value,
  customLabelClass = '',
  name = 'flexRadioDefault',
  id,
}) {
  const inputId = id || value;

  return (
    <label
      htmlFor={inputId}
      className={`flex items-center gap-2 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
    >
      <input
        className="peer sr-only"
        type="radio"
        name={name}
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={onChangeCb}
        value={value}
      />
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          checked ? 'border-primary bg-primary-100' : 'border-neutral-400'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-150 ${
            checked ? 'bg-primary' : 'bg-transparent'
          }`}
        />
      </div>
      <span
        className={`text-sm text-neutral-600 font-medium ${customLabelClass}`}
      >
        {label}
      </span>
    </label>
  );
}

export default RadioButton;
