import { useState } from "react";
import { useDispatch } from "react-redux";

import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import Icon from "@/components/icons/Icon";

import {
  ROLE_NAME_OPTIONS,
  SUB_ORGANIZATION_OPTIONS,
  PROVIDER_GROUP_OPTIONS,
} from "../constant";
import { setCloseFilterDrawer, setFilters, clearFilters } from "../settingsUsersSlice";

export default function FilterDrawer({ open, filters }) {
  const dispatch = useDispatch();

  const [localFilters, setLocalFilters] = useState({
    roleName: filters?.roleName ?? null,
    subOrganization: filters?.subOrganization ?? null,
    providerGroup: filters?.providerGroup ?? null,
  });

  const handleClose = () => dispatch(setCloseFilterDrawer());

  const handleReset = () => {
    setLocalFilters({ roleName: null, subOrganization: null, providerGroup: null });
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
            label="Role Name"
            name="roleName"
            placeholder="Select Role Name"
            options={ROLE_NAME_OPTIONS}
            value={localFilters.roleName}
            onChange={(selected) =>
              setLocalFilters((prev) => ({ ...prev, roleName: selected }))
            }
          />
          <SelectDropdown
            label="Sub Organization"
            name="subOrganization"
            placeholder="Select Organization"
            options={SUB_ORGANIZATION_OPTIONS}
            value={localFilters.subOrganization}
            onChange={(selected) =>
              setLocalFilters((prev) => ({ ...prev, subOrganization: selected }))
            }
          />
          <SelectDropdown
            label="Provider Group"
            name="providerGroup"
            placeholder="Select Provider Group"
            options={PROVIDER_GROUP_OPTIONS}
            value={localFilters.providerGroup}
            onChange={(selected) =>
              setLocalFilters((prev) => ({ ...prev, providerGroup: selected }))
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
