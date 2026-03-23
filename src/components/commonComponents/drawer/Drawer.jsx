import React, { useEffect, useState } from "react";
import Icon from "../../icons/Icon";

function Drawer({
  title,
  showIcon = true,
  icon = <Icon name="close" size={18} />,
  children,
  customClasses = "",
  close,
  open,
  customBodyClasses = "",
  subtitle,
  footerButton,
  cutomFooterBtnClass = "",
  showEditIcon = false,
  editIcon,
  edit,
  hideOverflow = false,
  showDeleteIcon = false,
  deleteIcon,
  deleteClick,
  hideHeaderBorder = false,
  backdropColor = "bg-[#3535357e]",
  position = "right",
  width = "w-[400px]",
}) {
  const isRight = position === "right";
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isRight ? "justify-end" : "justify-start"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${backdropColor} transition-opacity duration-200 ${
          animating ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />

      {/* Drawer panel */}
      <div
        className={`${width} h-full bg-white shadow-md flex flex-col relative transition-transform duration-300 ease-in-out ${
          animating
            ? "translate-x-0"
            : isRight
            ? "translate-x-full"
            : "-translate-x-full"
        } ${customClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center ${
            !hideHeaderBorder && "p-3 border-b border-[#E9E9E9]"
          }`}
        >
          <div className="flex flex-col">
            <div className="fs-20 font-semibold">{title}</div>
            {subtitle && (
              <div className="text-gray-500 fs-14">{subtitle}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {showEditIcon && editIcon && (
              <div
                className="cursor-pointer print-hidden flex items-center"
                onClick={edit}
              >
                {editIcon}
                <span className="text-met-primary ml-2">Edit</span>
              </div>
            )}
            {showDeleteIcon && deleteIcon && (
              <div
                className="cursor-pointer print-hidden flex items-center"
                onClick={deleteClick}
              >
                {deleteIcon}
                <span className="text-met-primary ml-2">Delete</span>
              </div>
            )}
            {showIcon && (
              <div
                className="cursor-pointer print-hidden"
                onClick={close}
              >
                {icon}
              </div>
            )}
          </div>
        </div>

        <div
          className={`${!hideHeaderBorder && "p-[16px]"} flex-1 overflow-${
            hideOverflow ? "visible" : "auto"
          } zenera-scrollbar ${customBodyClasses}`}
        >
          {children}
        </div>

        {footerButton && (
          <div
            className={`flex justify-end gap-2 p-1 border-t-1 border-[#E9E9E9] ${cutomFooterBtnClass}`}
          >
            {footerButton}
          </div>
        )}
      </div>
    </div>
  );
}

export default Drawer;
