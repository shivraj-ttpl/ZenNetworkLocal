import { useState, useRef, useEffect } from 'react';

import Button from '@/components/commonComponents/button/Button';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Icon from '@/components/icons/Icon';

import { ROLE_NAME_OPTIONS, SUB_ORGANIZATION_OPTIONS, PROVIDER_GROUP_OPTIONS } from '../constant';

export default function FilterDropdown({ onApply }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [subOrg, setSubOrg] = useState(null);
  const [providerGroup, setProviderGroup] = useState(null);
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
    setRole(null);
    setSubOrg(null);
    setProviderGroup(null);
    onApply({ role: null, subOrganization: null, providerGroup: null });
  };

  const handleApply = () => {
    onApply({
      role: role?.value || null,
      subOrganization: subOrg || null,
      providerGroup: providerGroup?.value || null,
    });
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-lg border border-border hover:bg-neutral-50 transition-colors cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="SlidersHorizontal" size={16} className="text-neutral-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg border border-border shadow-lg w-80">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-text-primary">Filter</span>
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
              label="Role"
              name="filterRole"
              placeholder="Select Role"
              options={ROLE_NAME_OPTIONS}
              value={role}
              onChange={(selected) => setRole(selected)}
            />
            <SelectDropdown
              label="Sub-Org"
              name="filterSubOrg"
              placeholder="Select Sub-Org"
              options={SUB_ORGANIZATION_OPTIONS}
              value={subOrg}
              onChange={(selected) => setSubOrg(selected)}
            />
            <SelectDropdown
              label="Provider Group"
              name="filterProviderGroup"
              placeholder="Select Provider Group"
              options={PROVIDER_GROUP_OPTIONS}
              value={providerGroup}
              onChange={(selected) => setProviderGroup(selected)}
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
