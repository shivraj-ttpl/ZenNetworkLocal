import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

import {
  ETHNICITY_OPTIONS,
  LANGUAGE_OPTIONS,
  RACE_OPTIONS,
} from '../../../constant';

const YES_NO_CHOOSE = ['Yes', 'No', 'I choose not to answer this question'];

export default function PersonalCharacteristics({
  values,
  handleChange,
  setFieldValue,
}) {
  const pc = values?.personalCharacteristics || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Personal Characteristics
      </h3>

      {/* 1. Race */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. Are you Hispanic or Latino?
        </p>
        {ETHNICITY_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="personalCharacteristics.ethnicity"
              value={opt.value}
              checked={pc.ethnicity === opt.value}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* 2. Race checkboxes */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Which race(s) are you?
        </p>
        {RACE_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.value}
            name={`personalCharacteristics.race.${opt.value}`}
            label={opt.label}
            checked={!!pc.race?.[opt.value]}
            onChange={() =>
              setFieldValue(
                `personalCharacteristics.race.${opt.value}`,
                !pc.race?.[opt.value],
              )
            }
          />
        ))}
        <div className="flex items-center gap-3">
          <Checkbox
            name="personalCharacteristics.race.other"
            label="Other"
            checked={!!pc.race?.other}
            onChange={() =>
              setFieldValue(
                'personalCharacteristics.race.other',
                !pc.race?.other,
              )
            }
          />
          <Input
            name="personalCharacteristics.race.otherSpecify"
            placeholder="Please Write"
            value={pc.race?.otherSpecify || ''}
            onChange={handleChange}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!pc.race?.chooseNotToAnswer}
            onChange={() =>
              setFieldValue(
                'personalCharacteristics.race.chooseNotToAnswer',
                !pc.race?.chooseNotToAnswer,
              )
            }
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 3. Seasonal/migrant farm work */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          3. At any point in the past 2 years, has season or migrant farm work
          been your or your family&apos;s main source of income?
        </p>
        {YES_NO_CHOOSE.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="personalCharacteristics.farmWork"
              value={opt}
              checked={pc.farmWork === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 4. Discharged from armed forces */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          4. Have you been discharged from the armed forces of the United
          States?
        </p>
        {YES_NO_CHOOSE.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="personalCharacteristics.armedForces"
              value={opt}
              checked={pc.armedForces === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 5. Language */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          5. What language are you most comfortable speaking?
        </p>
        <SelectDropdown
          name="personalCharacteristics.language"
          placeholder="Select Language"
          options={LANGUAGE_OPTIONS}
          value={pc.language || null}
          onChangeCb={(val) =>
            setFieldValue('personalCharacteristics.language', val)
          }
        />
      </div>
    </div>
  );
}
