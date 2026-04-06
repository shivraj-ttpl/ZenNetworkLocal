import { useEffect, useRef, useState } from 'react';

import Button from '@/components/commonComponents/button/Button';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Icon from '@/components/icons/Icon';

import { FILE_TYPE_OPTIONS, SPECIALTY_OPTIONS } from '../constant';

export default function FilterDropdown({ onApply }) {
  const [open, setOpen] = useState(false);
  const [specialty, setSpecialty] = useState(null);
  const [fileType, setFileType] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleReset = () => {
    setSpecialty(null);
    setFileType(null);
    onApply({ specialty: null, fileType: null });
  };

  const handleApply = () => {
    onApply({
      specialty: specialty?.value || null,
      fileType: fileType?.value || null,
    });
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-lg border border-border hover:bg-neutral-50 transition-colors cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="funnel" size={14} className="text-neutral-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg border border-border shadow-lg w-75">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-text-primary">
              Filter
            </span>
            <div className="flex items-center gap-2">
              <button
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                onClick={handleReset}
              >
                <Icon name="RotateCcw" size={14} />
              </button>
              <button
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <SelectDropdown
              label="Specialty"
              name="filterSpecialty"
              placeholder="Select Specialty"
              options={SPECIALTY_OPTIONS}
              value={specialty}
              onChange={(selected) => setSpecialty(selected)}
            />
            <SelectDropdown
              label="File Type"
              name="filterFileType"
              placeholder="Select File Type"
              options={FILE_TYPE_OPTIONS}
              value={fileType}
              onChange={(selected) => setFileType(selected)}
            />
          </div>

          <div className="flex justify-end px-4 pb-4">
            <Button variant="primaryBlue" size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
