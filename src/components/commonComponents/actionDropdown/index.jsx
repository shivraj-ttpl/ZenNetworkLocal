import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Icon from "../../icons/Icon";

const ActionDropdown = ({
  options,
  triggerIcon = "ellipsis-vertical",
  triggerElement,
  styleprops,
  id,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState({});
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
        setOpenNestedDropdowns({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const calculatePosition = () => {
      if (open && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        const optionsCount = options?.length || 0;
        const estimatedDropdownHeight = optionsCount * 40 + 20;
        const minRequiredSpace = 200;

        const shouldOpenUpward =
          spaceBelow < minRequiredSpace && spaceAbove > spaceBelow;

        let top, left;
        if (shouldOpenUpward) {
          top = triggerRect.top - estimatedDropdownHeight - 5;
        } else {
          top = triggerRect.bottom + 5;
        }
        left = triggerRect.left - 120;

        setDropdownPosition({ top, left });
      }
    };

    calculatePosition();

    window.addEventListener("scroll", calculatePosition);
    window.addEventListener("resize", calculatePosition);

    return () => {
      window.removeEventListener("scroll", calculatePosition);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [open, options?.length]);

  const toggleNestedDropdown = (index) => {
    setOpenNestedDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderOptions = (opts, level = 0) => (
    <ul
      className="bg-white shadow-md rounded text-sm font-normal text-neutral-800 z-[10001] min-w-[180px]"
      id={`dropdown-list-level-${level}${id ? `-${id}` : ""}`}
      style={{ zIndex: 10001 }}
    >
      {opts.map((opt, index) => {
        const key = `${level}-${index}`;

        const endIconElement = opt.isDropdown ? (
          <div
            className={`transform transition-transform duration-200 flex items-center ${
              openNestedDropdowns[key] ? "rotate-180" : ""
            }`}
            id={`dropdown-arrow-${key}`}
          >
            <Icon name="chevron-down" size={16} className="text-neutral-500" />
          </div>
        ) : opt.endIcon ? (
          <span
            className="flex items-center"
            title={opt.popoverContent || undefined}
            onClick={opt.popoverOnEndIcon ? (e) => e.stopPropagation() : undefined}
          >
            {opt.endIcon}
          </span>
        ) : null;

        return (
          <li key={key} className="relative" id={`dropdown-item-${key}`}>
            <button
              id={`dropdown-option-${key}`}
              disabled={opt?.disabled}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-100 flex items-center justify-between ${
                opt?.disabled
                  ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                  : "cursor-pointer"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (opt.isDropdown) {
                  toggleNestedDropdown(key);
                } else if (opt.onClickCb) {
                  opt.onClickCb();
                  setOpen(false);
                  setOpenNestedDropdowns({});
                }
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                {opt.startIcon && (
                  <span className="flex items-center">{opt.startIcon}</span>
                )}
                <span className="text-left">{opt.label}</span>
              </div>
              {endIconElement}
            </button>

            {opt.isDropdown && opt.options && openNestedDropdowns[key] && (
              <div
                className="absolute top-0 right-full mr-1 z-[10002]"
                id={`nested-dropdown-${key}`}
                style={{ zIndex: 10002 }}
              >
                {renderOptions(opt.options, level + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="relative inline-block" id="dropdown-container">
      <button
        id="dropdown-trigger"
        className={`p-2 ${styleprops || ""} rounded ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
        ref={triggerRef}
        disabled={disabled}
      >
        {triggerElement || (
          <Icon name={triggerIcon} size={18} className="text-neutral-600" />
        )}
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[10001]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 10001,
            }}
            id="dropdown-portal"
          >
            {renderOptions(options)}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActionDropdown;
