import Checkbox from '@/components/commonComponents/checkbox/Checkbox';

const HOUSING_OPTIONS = [
  'I have a steady place to live',
  'I have a place to live today, but I am worried about losing it in the future',
  'I do not have a steady place to live (I am temporarily staying with others, in a hotel shelter, living outside on the street, on a beach, in a car, abandoned building, bus or train station, or in a park)',
];

const PROBLEM_OPTIONS = [
  { key: 'pests', label: 'Pests such as bugs, ants, or mice' },
  { key: 'mold', label: 'Mold' },
  { key: 'leadPaint', label: 'Lead paint or pipes' },
  { key: 'lackOfHeat', label: 'Lack of heat' },
  { key: 'ovenStove', label: 'Oven or stove not working' },
  { key: 'smokeDetectors', label: 'Smoke detectors missing or not working' },
  { key: 'waterLeaks', label: 'Water leaks' },
  { key: 'noneAbove', label: 'None of the above' },
];

export default function LivingSituation({
  values,
  handleChange,
  setFieldValue,
}) {
  const ls = values?.livingSituation || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Living Situation
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. What is your living situation today?
        </p>
        {HOUSING_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="livingSituation.housing"
              value={opt}
              checked={ls.housing === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary mt-0.5"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Think about the place you live. Do you have problems with any of
          the following?
        </p>
        {PROBLEM_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.key}
            name={`livingSituation.problems.${opt.key}`}
            label={opt.label}
            checked={!!ls.problems?.[opt.key]}
            onChange={() =>
              setFieldValue(
                `livingSituation.problems.${opt.key}`,
                !ls.problems?.[opt.key],
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
