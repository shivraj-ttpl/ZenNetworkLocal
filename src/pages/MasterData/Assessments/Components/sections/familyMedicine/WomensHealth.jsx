import Input from '@/components/commonComponents/input/Input';

const YES_NO = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const PREGNANT_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: "I don't know", value: 'unknown' },
];

export default function WomensHealth({ values, handleChange, handleBlur, setFieldValue }) {
  const w = values?.womensHealth || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">{"Women's Health"}</h3>

      {/* Q1 */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-text-primary">
          1. How many times have you been pregnant in your life?
        </p>
        <Input
          name="womensHealth.timesPregnant"
          placeholder="Enter"
          type="number"
          value={w.timesPregnant || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="a. How many children have you had"
            name="womensHealth.children"
            placeholder="Enter"
            type="number"
            value={w.children || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="b. How many miscarriages"
            name="womensHealth.miscarriages"
            placeholder="Enter"
            type="number"
            value={w.miscarriages || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="c. How many terminations"
            name="womensHealth.terminations"
            placeholder="Enter"
            type="number"
            value={w.terminations || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Q2 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">2. When was your last menstrual period?</p>
        <Input
          name="womensHealth.lastMenstrualPeriod"
          placeholder="Enter"
          value={w.lastMenstrualPeriod || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Q3 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">3. Are you using contraception?</p>
        <div className="flex items-center gap-6">
          {YES_NO.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="womensHealth.usingContraception"
                value={opt.value}
                checked={w.usingContraception === opt.value}
                onChange={() => setFieldValue('womensHealth.usingContraception', opt.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q4 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">4. Are you currently pregnant?</p>
        <div className="flex items-center gap-6">
          {PREGNANT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="womensHealth.currentlyPregnant"
                value={opt.value}
                checked={w.currentlyPregnant === opt.value}
                onChange={() => setFieldValue('womensHealth.currentlyPregnant', opt.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
