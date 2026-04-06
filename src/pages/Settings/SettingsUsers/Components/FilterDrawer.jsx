import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Icon from '@/components/icons/Icon';

import { STATUS_OPTIONS, SUB_ORGANIZATION_OPTIONS } from '../constant';
import {
  clearFilters,
  setCloseFilterDrawer,
  setFilters,
} from '../settingsUsersSlice';

const EMPTY_FILTERS = { subOrganization: null, status: null };

export default function FilterDrawer({ open, filters }) {
  const dispatch = useDispatch();

  const [localFilters, setLocalFilters] = useState({
    subOrganization: filters?.subOrganization ?? null,
    status: filters?.status ?? null,
  });

  const handleClose = () => dispatch(setCloseFilterDrawer());

  const handleReset = () => {
    setLocalFilters(EMPTY_FILTERS);
    dispatch(clearFilters());
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    handleClose();
  };

  return (
    <Drawer
      title="Filter"
      open={open}
      close={handleClose}
      width="w-full sm:w-[400px]"
      icon={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <Icon name="RotateCcw" size={18} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      }
      footerButton={null}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col gap-5">
          <SelectDropdown
            label="Sub Organization"
            name="subOrganization"
            placeholder="Select Organization"
            options={SUB_ORGANIZATION_OPTIONS}
            value={localFilters.subOrganization}
            onChange={(selected) =>
              setLocalFilters((prev) => ({
                ...prev,
                subOrganization: selected,
              }))
            }
          />
          <SelectDropdown
            label="Status"
            name="status"
            placeholder="Select Status"
            options={STATUS_OPTIONS}
            value={localFilters.status}
            onChange={(selected) =>
              setLocalFilters((prev) => ({ ...prev, status: selected }))
            }
          />
        </div>

        <div className="flex justify-end mt-auto pt-4 border-t border-[#E9E9E9]">
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
