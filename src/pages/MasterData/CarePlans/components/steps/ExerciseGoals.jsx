import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

const GOAL_OPTIONS = [
  { label: 'Improve', value: 'improve' },
  { label: 'Maintain', value: 'maintain' },
  { label: 'Monitor', value: 'monitor' },
];

const EXERCISE_TYPES = [
  { key: 'walkingFast', label: 'Walking fast (Cardiovascular)' },
  { key: 'running', label: 'Running (Cardiovascular)' },
  { key: 'biking', label: 'Biking (Cardiovascular)' },
  { key: 'swimming', label: 'Swimming (Cardiovascular)' },
  { key: 'pickleBall', label: 'Pickle Ball (Cardiovascular)' },
  { key: 'yoga', label: 'Yoga (Flexibility, Strength, Cardiovascular)' },
  { key: 'pilates', label: 'Pilates (Flexibility, Strength, Cardiovascular)' },
  {
    key: 'weightsMachines',
    label: 'Weights/Machines - Strength Training (Strength)',
  },
];

const EXERCISE_MEASURES = [
  {
    key: 'cardiovascular',
    label: 'Cardiovascular',
    ideal: 'Daily, >150 min/week',
  },
  {
    key: 'strength',
    label: 'Strength',
    ideal: 'Daily, >150 min/week',
  },
  {
    key: 'flexibilityStretching',
    label: 'Flexibility/Stretching',
    ideal: 'Daily, >150 min/week',
  },
];

export default function ExerciseGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const exercise = values?.exerciseGoals || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Exercise type selection */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-primary">
          What kind of exercise do you like best?
        </p>

        {EXERCISE_TYPES.map((type) => (
          <Checkbox
            key={type.key}
            name={`exerciseGoals.types.${type.key}`}
            label={type.label}
            checked={!!exercise.types?.[type.key]}
            onChange={() =>
              setFieldValue(
                `exerciseGoals.types.${type.key}`,
                !exercise.types?.[type.key],
              )
            }
          />
        ))}

        {/* Other with text input */}
        <div className="flex items-center gap-3">
          <Checkbox
            name="exerciseGoals.types.other"
            label="Other"
            checked={!!exercise.types?.other}
            onChange={() =>
              setFieldValue('exerciseGoals.types.other', !exercise.types?.other)
            }
          />
          <Input
            name="exerciseGoals.types.otherSpecify"
            placeholder="Enter"
            value={exercise.types?.otherSpecify || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Exercise measures table */}
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 p-3 bg-neutral-100 items-center">
          <span className="text-xs font-semibold text-text-secondary">
            Exercise Type
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Last Value
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Current Value
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Goal this Month
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Ideal
          </span>
        </div>

        {/* Measure rows */}
        {EXERCISE_MEASURES.map((measure) => {
          const data = exercise.measures?.[measure.key] || {};
          const prefix = `exerciseGoals.measures.${measure.key}`;

          return (
            <div
              key={measure.key}
              className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 py-4"
            >
              <span className="text-sm text-text-primary font-medium pt-2">
                {measure.label}
              </span>

              {/* Last Value */}
              <div className="flex flex-col gap-2">
                <Input
                  name={`${prefix}.lastValue`}
                  placeholder=""
                  value={data.lastValue || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <DatePicker
                  name={`${prefix}.lastDate`}
                  value={data.lastDate || null}
                  onChangeCb={(val) => setFieldValue(`${prefix}.lastDate`, val)}
                  placeholder="Select Date"
                />
              </div>

              {/* Current Value */}
              <div className="flex flex-col gap-2">
                <Input
                  name={`${prefix}.currentValue`}
                  placeholder="Minutes/Week"
                  value={data.currentValue || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <DatePicker
                  name={`${prefix}.currentDate`}
                  value={data.currentDate || null}
                  onChangeCb={(val) =>
                    setFieldValue(`${prefix}.currentDate`, val)
                  }
                  placeholder="Select Date"
                />
              </div>

              {/* Goal this Month */}
              <div>
                <SelectDropdown
                  name={`${prefix}.goal`}
                  placeholder="Select"
                  options={GOAL_OPTIONS}
                  value={data.goal || null}
                  onChangeCb={(val) => setFieldValue(`${prefix}.goal`, val)}
                />
              </div>

              {/* Ideal */}
              <span className="text-xs text-text-secondary pt-2">
                {measure.ideal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
