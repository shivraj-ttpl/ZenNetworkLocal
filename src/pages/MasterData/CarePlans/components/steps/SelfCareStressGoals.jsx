import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

const GOAL_OPTIONS = [
  { label: 'Improve', value: 'improve' },
  { label: 'Maintain', value: 'maintain' },
  { label: 'Monitor', value: 'monitor' },
];

const ACTIVITY_TYPES = [
  { key: 'meditation', label: 'Meditation' },
  { key: 'visualization', label: 'Visualization' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'spaDays', label: 'Spa Days' },
  { key: 'manicures', label: 'Manicures' },
  { key: 'seeingFriendsFamily', label: 'Seeing friends or family' },
  { key: 'reading', label: 'Reading' },
  { key: 'exercise', label: 'Exercise' },
  { key: 'crafting', label: 'Crafting' },
  { key: 'makingArt', label: 'Making art' },
  { key: 'music', label: 'Music' },
];

export default function SelfCareStressGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const selfCare = values?.selfCareStressGoals || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Activity type selection */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-primary">
          What kind of activities do you like best for stress management and self
          care?
        </p>

        <div className="grid grid-cols-3 gap-3">
          {ACTIVITY_TYPES.map((type) => (
            <Checkbox
              key={type.key}
              name={`selfCareStressGoals.types.${type.key}`}
              label={type.label}
              checked={!!selfCare.types?.[type.key]}
              onChange={() =>
                setFieldValue(
                  `selfCareStressGoals.types.${type.key}`,
                  !selfCare.types?.[type.key],
                )
              }
            />
          ))}

          {/* Other with text input */}
          <div className="flex items-center gap-3">
            <Checkbox
              name="selfCareStressGoals.types.other"
              label="Other"
              checked={!!selfCare.types?.other}
              onChange={() =>
                setFieldValue(
                  'selfCareStressGoals.types.other',
                  !selfCare.types?.other,
                )
              }
            />
            <Input
              name="selfCareStressGoals.types.otherSpecify"
              placeholder="Enter"
              value={selfCare.types?.otherSpecify || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>

      {/* Measure table */}
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="grid grid-cols-[180px_180px_180px_150px_1fr] gap-3 p-3 bg-neutral-100 items-center">
          <span className="text-xs font-semibold text-text-secondary">
            Self-Care / Stress Management
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

        {/* Single measure row */}
        <div className="grid grid-cols-[180px_180px_180px_150px_1fr] gap-3 py-4">
          <span className="text-sm text-text-primary font-medium pt-2">
            Average times a week for self-care / stress reduction activities
          </span>

          {/* Last Value */}
          <div className="flex flex-col gap-2">
            <Input
              name="selfCareStressGoals.measure.lastValue"
              placeholder=""
              value={selfCare.measure?.lastValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <DatePicker
              name="selfCareStressGoals.measure.lastDate"
              value={selfCare.measure?.lastDate || null}
              onChangeCb={(val) =>
                setFieldValue('selfCareStressGoals.measure.lastDate', val)
              }
              placeholder="Select Date"
            />
          </div>

          {/* Current Value */}
          <div className="flex flex-col gap-2">
            <Input
              name="selfCareStressGoals.measure.currentValue"
              placeholder="Minutes/Week"
              value={selfCare.measure?.currentValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <DatePicker
              name="selfCareStressGoals.measure.currentDate"
              value={selfCare.measure?.currentDate || null}
              onChangeCb={(val) =>
                setFieldValue('selfCareStressGoals.measure.currentDate', val)
              }
              placeholder="Select Date"
            />
          </div>

          {/* Goal this Month */}
          <div>
            <SelectDropdown
              name="selfCareStressGoals.measure.goal"
              placeholder="Select"
              options={GOAL_OPTIONS}
              value={selfCare.measure?.goal || null}
              onChangeCb={(val) =>
                setFieldValue('selfCareStressGoals.measure.goal', val)
              }
            />
          </div>

          {/* Ideal */}
          <span className="text-xs text-text-secondary pt-2">
            Daily, &gt; 140 min a week
          </span>
        </div>
      </div>
    </div>
  );
}
