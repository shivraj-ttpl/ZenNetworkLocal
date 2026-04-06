const ToggleSwitch = ({
  name,
  checked,
  onChangeCb = () => {},
  title,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  showLabel = true,
  disabled = false,
}) => {
  function handleCheckboxChange(event) {
    onChangeCb(event.target.checked);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="relative inline-block">
        <input
          name={name}
          className={`
            peer
            h-5 w-9 appearance-none rounded-full
            bg-neutral-300 transition-colors duration-300
            checked:bg-primary
            relative
            before:absolute before:top-0.5 before:left-0.5
            before:h-4 before:w-4 before:rounded-full before:bg-white
            before:transition-transform before:duration-300
            before:shadow-[0_0_3px_rgba(0,0,0,0.2)]
            checked:before:translate-x-4
            checked:before:shadow-[0_0_3px_theme(--color-primary)]
            disabled:opacity-50
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          checked={checked}
          type="checkbox"
          role="switch"
          id={name}
          onChange={handleCheckboxChange} // eslint-disable-line react/jsx-no-bind
          title={title}
          disabled={disabled}
          aria-checked={checked}
          aria-label={title || name}
        />
      </span>
      {showLabel && (
        <p className="text-neutral-500 text-sm w-12.5 mb-1">
          {checked ? activeLabel : inactiveLabel}
        </p>
      )}
    </div>
  );
};

export default ToggleSwitch;
