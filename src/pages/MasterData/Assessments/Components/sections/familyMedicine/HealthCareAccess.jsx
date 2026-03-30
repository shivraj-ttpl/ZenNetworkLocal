import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { DURATION_UNIT_OPTIONS } from '@/pages/MasterData/Assessments/constant';

const YES_NO = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export default function HealthCareAccess({ values, handleChange, handleBlur, setFieldValue }) {
  const h = values?.healthCareAccess || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Health Care Access</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">
          1. Do you have a regular Primary Care Provider you go to for care?
        </p>
        <div className="flex items-center gap-6">
          {YES_NO.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="healthCareAccess.hasRegularProvider"
                value={opt.value}
                checked={h.hasRegularProvider === opt.value}
                onChange={() => setFieldValue('healthCareAccess.hasRegularProvider', opt.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">How long ago was your last Annual Wellness Visit</p>
        <div className="flex items-center gap-3">
          <Input
            name="healthCareAccess.lastWellnessVisitAmount"
            placeholder="Enter"
            value={h.lastWellnessVisitAmount || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-40"
          />
          <div className="flex-1">
            <SelectDropdown
              name="healthCareAccess.lastWellnessVisitUnit"
              placeholder="Select Month/Year"
              options={DURATION_UNIT_OPTIONS}
              value={DURATION_UNIT_OPTIONS.find((o) => o.value === h.lastWellnessVisitUnit) || null}
              onChange={(opt) =>
                setFieldValue('healthCareAccess.lastWellnessVisitUnit', opt?.value || '')
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">
          How many times have you been to the ER in the past year?
        </p>
        <Input
          name="healthCareAccess.erVisits"
          placeholder="Enter"
          type="number"
          value={h.erVisits || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">
          How many times have you stayed overnight in the hospital in the past year
        </p>
        <Input
          name="healthCareAccess.overnightHospital"
          placeholder="Enter"
          type="number"
          value={h.overnightHospital || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
