import { useState } from 'react';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import TextArea from '@/components/commonComponents/textArea/index';
import {
  MEDICATION_NAME_OPTIONS,
  DOSAGE_UNIT_OPTIONS,
  MEDICATION_WHEN_OPTIONS,
  MEDICATION_FREQUENCY_OPTIONS,
  MEDICATION_ROUTE_OPTIONS,
  MEDICATION_STATUS_OPTIONS,
} from '@/pages/MasterData/Assessments/constant';

const EMPTY_MED = {
  medicationName: '',
  quantity: '',
  dosageUnit: '',
  when: '',
  frequency: '',
  route: '',
  status: '',
  instruction: '',
  note: '',
  forLifetime: false,
};

export default function Medications({ values, setFieldValue }) {
  const [meds, setMeds] = useState([{ ...EMPTY_MED }]);
  const m = values?.medications || {};

  const updateMed = (index, field, value) => {
    setMeds((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMed = () => setMeds((prev) => [...prev, { ...EMPTY_MED }]);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Medications</h3>

      {meds.map((med, idx) => (
        <div key={idx} className="flex flex-col gap-4">
          <SelectDropdown
            label="Medication Name"
            name={`med_${idx}_name`}
            placeholder="Select"
            options={MEDICATION_NAME_OPTIONS}
            value={MEDICATION_NAME_OPTIONS.find((o) => o.value === med.medicationName) || null}
            onChange={(opt) => updateMed(idx, 'medicationName', opt?.value || '')}
          />

          <h4 className="text-sm font-semibold text-text-primary">Sig</h4>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Quantity"
              name={`med_${idx}_quantity`}
              placeholder="Enter"
              value={med.quantity}
              onChange={(e) => updateMed(idx, 'quantity', e.target.value)}
            />
            <SelectDropdown
              label="Dosage Unit"
              name={`med_${idx}_dosageUnit`}
              placeholder="Select"
              options={DOSAGE_UNIT_OPTIONS}
              value={DOSAGE_UNIT_OPTIONS.find((o) => o.value === med.dosageUnit) || null}
              onChange={(opt) => updateMed(idx, 'dosageUnit', opt?.value || '')}
            />
            <SelectDropdown
              label="When"
              name={`med_${idx}_when`}
              placeholder="Select"
              options={MEDICATION_WHEN_OPTIONS}
              value={MEDICATION_WHEN_OPTIONS.find((o) => o.value === med.when) || null}
              onChange={(opt) => updateMed(idx, 'when', opt?.value || '')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SelectDropdown
              label="Frequency"
              name={`med_${idx}_frequency`}
              placeholder="Select"
              options={MEDICATION_FREQUENCY_OPTIONS}
              value={MEDICATION_FREQUENCY_OPTIONS.find((o) => o.value === med.frequency) || null}
              onChange={(opt) => updateMed(idx, 'frequency', opt?.value || '')}
            />
            <SelectDropdown
              label="Route"
              name={`med_${idx}_route`}
              placeholder="Select"
              options={MEDICATION_ROUTE_OPTIONS}
              value={MEDICATION_ROUTE_OPTIONS.find((o) => o.value === med.route) || null}
              onChange={(opt) => updateMed(idx, 'route', opt?.value || '')}
            />
            <SelectDropdown
              label="Status"
              name={`med_${idx}_status`}
              placeholder="Select"
              options={MEDICATION_STATUS_OPTIONS}
              value={MEDICATION_STATUS_OPTIONS.find((o) => o.value === med.status) || null}
              onChange={(opt) => updateMed(idx, 'status', opt?.value || '')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextArea
              label="Instruction"
              name={`med_${idx}_instruction`}
              placeholder="Type here..."
              value={med.instruction}
              onChangeCb={(e) => updateMed(idx, 'instruction', e.target.value)}
              rows={5}
            />
            <TextArea
              label="Note"
              name={`med_${idx}_note`}
              placeholder="Type here..."
              value={med.note}
              onChangeCb={(e) => updateMed(idx, 'note', e.target.value)}
              rows={5}
            />
          </div>

          <Checkbox
            label="For Lifetime"
            name={`med_${idx}_forLifetime`}
            checked={!!med.forLifetime}
            onChange={(e) => updateMed(idx, 'forLifetime', e.target.checked)}
            variant="blue"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addMed}
        className="flex items-center gap-1 text-sm text-blue-500 font-medium w-fit hover:underline"
      >
        <span className="text-base leading-none font-bold">+</span> Add More
      </button>

      <Checkbox
        label="Information in above section has been confirmed"
        name="medications.informationConfirmed"
        checked={!!m.informationConfirmed}
        onChange={(e) => setFieldValue('medications.informationConfirmed', e.target.checked)}
        variant="blue"
      />
    </div>
  );
}
