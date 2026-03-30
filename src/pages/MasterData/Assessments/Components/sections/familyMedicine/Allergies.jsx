import { useState } from 'react';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import {
  ALLERGY_NAME_OPTIONS,
  ALLERGY_SEVERITY_OPTIONS,
} from '@/pages/MasterData/Assessments/constant';

const EMPTY_ALLERGY = {
  allergyName: '',
  reaction: '',
  severity: '',
  onsetDate: '',
};

export default function Allergies({ values, setFieldValue }) {
  const a = values?.allergies || {};
  const [allergies, setAllergies] = useState([{ ...EMPTY_ALLERGY }]);

  const updateAllergy = (index, field, value) => {
    setAllergies((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addAllergy = () => setAllergies((prev) => [...prev, { ...EMPTY_ALLERGY }]);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Allergies</h3>

      <div className="flex flex-col gap-3">
        {allergies.map((allergy, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 items-end">
            <SelectDropdown
              label="Allergy Name"
              name={`allergy_${idx}_name`}
              placeholder="Select"
              options={ALLERGY_NAME_OPTIONS}
              value={ALLERGY_NAME_OPTIONS.find((o) => o.value === allergy.allergyName) || null}
              onChange={(opt) => updateAllergy(idx, 'allergyName', opt?.value || '')}
            />
            <Input
              label="Reaction"
              name={`allergy_${idx}_reaction`}
              placeholder="Enter"
              value={allergy.reaction}
              onChange={(e) => updateAllergy(idx, 'reaction', e.target.value)}
            />
            <SelectDropdown
              label="Severity"
              name={`allergy_${idx}_severity`}
              placeholder="Select"
              options={ALLERGY_SEVERITY_OPTIONS}
              value={ALLERGY_SEVERITY_OPTIONS.find((o) => o.value === allergy.severity) || null}
              onChange={(opt) => updateAllergy(idx, 'severity', opt?.value || '')}
            />
            <Input
              label="Onset Date"
              name={`allergy_${idx}_onsetDate`}
              type="date"
              value={allergy.onsetDate}
              onChange={(e) => updateAllergy(idx, 'onsetDate', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addAllergy}
        className="flex items-center gap-1 text-sm text-blue-500 font-medium w-fit hover:underline"
      >
        <span className="text-base leading-none font-bold">+</span> Add More
      </button>

      <Checkbox
        label="Information in above section has been confirmed"
        name="allergies.informationConfirmed"
        checked={!!a.informationConfirmed}
        onChange={(e) => setFieldValue('allergies.informationConfirmed', e.target.checked)}
        variant="blue"
      />
    </div>
  );
}
