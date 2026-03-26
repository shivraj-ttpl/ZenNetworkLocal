import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "@/components/commonComponents/button/Button";
import Icon from "@/components/icons/Icon";
import { setOpenAddDrawer, setOpenImportModal } from "../payersSlice";

export default function AddPayersDropdown() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="Plus" size={14} />
        Add Payers
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg border border-border shadow-lg min-w-[200px]">
          <button
            className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-neutral-50 transition-colors cursor-pointer"
            onClick={() => {
              dispatch(setOpenAddDrawer());
              setOpen(false);
            }}
          >
            Enter Payer Details
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-neutral-50 transition-colors cursor-pointer"
            onClick={() => {
              dispatch(setOpenImportModal());
              setOpen(false);
            }}
          >
            Upload CSV File
          </button>
        </div>
      )}
    </div>
  );
}
