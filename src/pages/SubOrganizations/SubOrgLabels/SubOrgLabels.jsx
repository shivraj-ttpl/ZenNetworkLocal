import { useCallback, useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { LABEL_OPTIONS, labelsFieldsData } from '@/data/settingsData';

export default function SubOrgLabels() {
  const { subOrgId } = useParams();
  const { setToolbar } = useOutletContext();
  const [setDefault, setSetDefault] = useState(false);
  const [labels, setLabels] = useState(() =>
    labelsFieldsData.reduce((acc, field) => {
      acc[field.fieldName] = null;
      return acc;
    }, {}),
  );

  const handleLabelChange = useCallback((fieldName, value) => {
    setLabels((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  useEffect(() => {
    setToolbar(
      <Checkbox
        label="Set Default"
        checked={setDefault}
        onChange={() => setSetDefault((prev) => !prev)}
        variant="blue"
        size="sm"
      />,
    );
    return () => setToolbar(null);
  }, [setToolbar, setDefault]);

  return (
    <div className="px-5 pb-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">
          Manage System Labels
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Customize the labels used across the system for this sub-organization.
          Changes will apply to all users within this sub-organization.
        </p>
      </div>

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

        {labelsFieldsData.map((field) => (
          <div
            key={field.fieldName}
            className="grid grid-cols-3 border-t border-border"
          >
            <div className="px-4 py-3 text-sm font-medium text-text-primary flex items-center">
              {field.fieldName}
            </div>
            <div className="px-4 py-3 flex items-center">
              <div className="border border-border rounded-lg px-3 py-2 text-sm bg-surface w-full text-text-primary">
                {field.existingLabel}
              </div>
            </div>
            <div className="px-4 py-3 flex items-center">
              <SelectDropdown
                name={`label-${field.fieldName}`}
                placeholder="Select Label"
                options={LABEL_OPTIONS}
                value={labels[field.fieldName]}
                onChange={(val) => handleLabelChange(field.fieldName, val)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="primaryBlue" size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}
