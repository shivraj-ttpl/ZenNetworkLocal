import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import AsyncSelectDropdown from '@/components/commonComponents/selectDropdown/AsyncSelectDropdown';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { DEFAULT_LABEL_FIELDS } from './constant';
import {
  componentKey,
  registerReducer,
  setLabelsList,
} from './settingsLabelsSlice';
import { settingsLabelsActions, registerSaga } from './settingsLabelsSaga';

const { fetchLabels, fetchDefaultLabels, updateLabels } = settingsLabelsActions;
const EMPTY_STATE = {};

export default function SettingsLabels() {
  const dispatch = useDispatch();
  const [selectedSubOrg, setSelectedSubOrg] = useState(null);
  const [isSetDefault, setIsSetDefault] = useState(false);
  const [customLabels, setCustomLabels] = useState({});

  const { labelsList = [], defaultLabels = null, refreshFlag = 0 } =
    useSelector((state) => state[componentKey] ?? EMPTY_STATE,
  );
  const isUpdating = useLoadingKey(LOADING_KEYS.SETTINGS_LABELS_PATCH_UPDATE);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (selectedSubOrg?.id) {
      dispatch(fetchLabels({ subOrgId: selectedSubOrg.id }));
    } else {
      dispatch(setLabelsList([]));
      setCustomLabels({});
    }
    setIsSetDefault(false);
  }, [dispatch, selectedSubOrg, refreshFlag]);

  const labelsMap = useMemo(() => {
    const map = {};
    labelsList.forEach((label) => {
      map[label.fieldName] = label;
    });
    return map;
  }, [labelsList]);

  useEffect(() => {
    const map = {};
    labelsList.forEach((label) => {
      map[label.fieldName] = label.customLabel || '';
    });
    setCustomLabels(map);
  }, [labelsList]);

  useEffect(() => {
    if (isSetDefault && Array.isArray(defaultLabels)) {
      const map = {};
      defaultLabels.forEach((item) => {
        map[item.fieldName] = item.defaultLabel || '';
      });
      setCustomLabels(map);
    }
  }, [defaultLabels, isSetDefault]);

  const handleLabelChange = useCallback((fieldName, value) => {
    setCustomLabels((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleSave = () => {
    if (!selectedSubOrg?.id) return;
    const labels = DEFAULT_LABEL_FIELDS.filter(
      (fieldName) => customLabels[fieldName],
    ).map((fieldName) => ({
      fieldName,
      customLabel: customLabels[fieldName],
    }));
    dispatch(updateLabels({ subOrgId: selectedSubOrg.id, labels }));
  };

  return (
    <div className="pb-2">
      <div className="flex border-y-[0.3px] border-border-light p-4 items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-text-primary whitespace-nowrap">
            Select Sub-Organization
            <span className="text-error-500 ml-0.5">*</span>
          </label>
          <div className="w-68">
            <AsyncSelectDropdown
              name="subOrg"
              placeholder="Select Sub-Organization"
              url="dropdown-apis/sub-organizations"
              value={selectedSubOrg}
              onChange={setSelectedSubOrg}
              valueKey="id"
              labelKey="name"
            />
          </div>
        </div>
        <Checkbox
          label="Set Default"
          checked={isSetDefault}
          onChange={() => {
            const next = !isSetDefault;
            setIsSetDefault(next);
            if (next) {
              dispatch(fetchDefaultLabels());
            }
          }}
          variant="blue"
          size="sm"
          disabled={!selectedSubOrg}
        />
      </div>

      <div className="mb-4 px-4 pb-4 border-b-[0.3px] border-border-light">
        <h2 className="text-base font-semibold text-text-primary">
          Manage System Labels
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Customize field labels to match your sub-organization&apos;s
          terminology. Changes made here will reflect across all forms, reports,
          and navigation menus throughout the system.
        </p>
      </div>

      <div className="h-[calc(100vh-420px)] px-4 overflow-y-auto">
        <div className="border border-border rounded-lg">
          <div className="grid grid-cols-3 bg-neutral-50 rounded-t-lg">
            <div className="px-4 py-3 text-sm font-semibold text-text-primary">
              Field Name
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-text-primary">
              Existing Labels
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-text-primary">
              Labels
            </div>
          </div>

          {DEFAULT_LABEL_FIELDS.map((fieldName) => {
            const apiLabel = labelsMap[fieldName];
            return (
              <div
                key={fieldName}
                className="grid grid-cols-3 border-t border-border"
              >
                <div className="px-4 py-3 text-sm font-medium text-text-primary flex items-center">
                  {fieldName}
                </div>
                <div className="px-4 py-3 flex items-center">
                  <Input
                    name={`existing-${fieldName}`}
                    value={
                      selectedSubOrg
                        ? (apiLabel?.defaultLabel || fieldName)
                        : fieldName
                    }
                    disabled
                  />
                </div>
                <div className="px-4 py-3 flex items-center">
                  <Input
                    name={`label-${fieldName}`}
                    placeholder={fieldName}
                    value={customLabels[fieldName] || ''}
                    onChange={(e) =>
                      handleLabelChange(fieldName, e.target.value)
                    }
                    disabled={!selectedSubOrg}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end mt-4 px-4">
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={handleSave}
          disabled={!selectedSubOrg || isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
