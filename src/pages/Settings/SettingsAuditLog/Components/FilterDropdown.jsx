import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Icon from '@/components/icons/Icon';

import { ACTION_OPTIONS } from '../constant';
import { clearFilters, setFilters } from '../settingsAuditLogSlice';

const EMPTY_FILTERS = { action: null, startDate: null, endDate: null };

export default function FilterDropdown({ filters }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(EMPTY_FILTERS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLocalFilters({
      action: filters?.action ?? null,
      startDate: filters?.startDate ?? null,
      endDate: filters?.endDate ?? null,
    });
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const datePickerPortal = document.getElementById('datepicker-portal');
      if (datePickerPortal && datePickerPortal.contains(e.target)) return;
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
    setLocalFilters(EMPTY_FILTERS);
    dispatch(clearFilters());
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-1.5 rounded-lg border border-border hover:bg-neutral-50 transition-colors cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="funnel" size={16} className="text-neutral-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg border border-border shadow-lg w-80">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-text-primary">Filter</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                onClick={handleReset}
              >
                <Icon name="RotateCcw" size={14} />
              </button>
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <SelectDropdown
              label="Action"
              name="filterAction"
              placeholder="Select Action"
              options={ACTION_OPTIONS}
              value={localFilters.action}
              onChange={(selected) =>
                setLocalFilters((prev) => ({ ...prev, action: selected }))
              }
            />

            <div className="flex gap-3">
              <DatePicker
                label="Start Date"
                placeholder="MM/DD/YYYY"
                value={localFilters.startDate}
                maxDate={localFilters.endDate ? new Date(localFilters.endDate) : new Date()}
                onChangeCb={(val) =>
                  setLocalFilters((prev) => ({ ...prev, startDate: val }))
                }
                className="flex-1"
              />
              <DatePicker
                label="End Date"
                placeholder="MM/DD/YYYY"
                value={localFilters.endDate}
                minDate={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
                maxDate={new Date()}
                onChangeCb={(val) =>
                  setLocalFilters((prev) => ({ ...prev, endDate: val }))
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end px-4 pb-4">
            <Button variant="primaryBlue" size="sm" type="button" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
