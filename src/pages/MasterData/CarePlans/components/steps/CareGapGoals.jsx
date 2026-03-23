import Input from '@/components/commonComponents/input/Input';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

const GOAL_OPTIONS = [
  { label: 'Improve', value: 'improve' },
  { label: 'Maintain', value: 'maintain' },
  { label: 'Monitor', value: 'monitor' },
];

const MEASURES = [
  {
    key: 'bloodPressure',
    label: 'Blood Pressure',
    ideal: '100/70 to 130/80',
    hasGoal: true,
  },
  {
    key: 'bmi',
    label: 'BMI',
    ideal: '20-25',
    hasGoal: true,
  },
  {
    key: 'hba1c',
    label: 'HbA1C',
    ideal: '<7',
    hasGoal: true,
  },
  {
    key: 'ldl',
    label: 'LDL',
    ideal: '<70 if no ASCVD\n<55 if ASCVD',
    hasGoal: true,
  },
  {
    key: 'urineAlbCr',
    label: 'Urine Alb/Cr',
    ideal: 'Date within past year',
    hasGoal: true,
  },
  {
    key: 'egfr',
    label: 'eGFR',
    ideal: 'Date within past year',
    hasGoal: true,
  },
];

export default function CareGapGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const gap = values?.careGapGoals || {};

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="grid grid-cols-[140px_180px_180px_160px_1fr] gap-3 p-3 bg-neutral-100 items-center">
        <span className="text-xs font-semibold text-text-secondary">
          Measure
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
        <span className="text-xs font-semibold text-text-secondary">Ideal</span>
      </div>

      {/* Measure rows */}
      {MEASURES.map((measure) => (
        <MeasureRow
          key={measure.key}
          measure={measure}
          values={gap[measure.key] || {}}
          prefix={`careGapGoals.${measure.key}`}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
        />
      ))}

      {/* On Statin */}
      <div className="grid grid-cols-[160px_160px_180px_160px_1fr] gap-3 py-4  items-center">
        <span className="text-sm text-text-primary font-medium">On Statin</span>
        <div className="flex items-center gap-4">
          {['Yes', 'No'].map((opt) => (
            <label
              key={`statin-last-${opt}`}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="careGapGoals.onStatin.lastValue"
                value={opt}
                checked={gap?.onStatin?.lastValue === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {['Yes', 'No'].map((opt) => (
            <label
              key={`statin-current-${opt}`}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="careGapGoals.onStatin.currentValue"
                value={opt}
                checked={gap?.onStatin?.currentValue === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <div />
        <span className="text-xs text-text-secondary">Yes</span>
      </div>

      {/* Eye Exam */}
      <DateRow
        label="Eye Exam"
        ideal="Date within past year"
        prefix="careGapGoals.eyeExam"
        values={gap?.eyeExam || {}}
        setFieldValue={setFieldValue}
      />

      {/* Foot Exam */}
      <DateRow
        label="Foot Exam"
        ideal="Date within past year"
        prefix="careGapGoals.footExam"
        values={gap?.footExam || {}}
        setFieldValue={setFieldValue}
      />
    </div>
  );
}

function MeasureRow({
  measure,
  values,
  prefix,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  return (
    <div className="grid grid-cols-[140px_190px_190px_150px_1fr] gap-3 py-4">
      <span className="text-sm text-text-primary font-medium pt-2">
        {measure.label}
      </span>

      {/* Last Value column */}
      <div className="flex flex-col gap-2">
        <Input
          name={`${prefix}.lastValue`}
          placeholder=""
          value={values?.lastValue || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <DatePicker
          name={`${prefix}.lastDate`}
          value={values?.lastDate || null}
          onChangeCb={(val) => setFieldValue(`${prefix}.lastDate`, val)}
          placeholder="Select Date"
        />
      </div>

      {/* Current Value column */}
      <div className="flex flex-col gap-2">
        <Input
          name={`${prefix}.currentValue`}
          placeholder="Enter"
          value={values?.currentValue || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <DatePicker
          name={`${prefix}.currentDate`}
          value={values?.currentDate || null}
          onChangeCb={(val) => setFieldValue(`${prefix}.currentDate`, val)}
          placeholder="Select Date"
        />
      </div>

      {/* Goal this Month */}
      {measure.hasGoal && (
        <div>
          <SelectDropdown
            name={`${prefix}.goal`}
            placeholder="Select"
            options={GOAL_OPTIONS}
            value={values?.goal || null}
            onChangeCb={(val) => setFieldValue(`${prefix}.goal`, val)}
          />
        </div>
      )}

      {/* Ideal */}
      <span className="text-xs text-text-secondary pt-2 whitespace-pre-line">
        {measure.ideal}
      </span>
    </div>
  );
}

function DateRow({ label, ideal, prefix, values, setFieldValue }) {
  return (
    <div className="grid grid-cols-[140px_160px_160px_150px_1fr] gap-3 py-4  items-center">
      <span className="text-sm text-text-primary font-medium">{label}</span>
      <DatePicker
        name={`${prefix}.lastDate`}
        value={values?.lastDate || null}
        onChangeCb={(val) => setFieldValue(`${prefix}.lastDate`, val)}
        placeholder="Select Date"
      />
      <DatePicker
        name={`${prefix}.currentDate`}
        value={values?.currentDate || null}
        onChangeCb={(val) => setFieldValue(`${prefix}.currentDate`, val)}
        placeholder="Select Date"
      />
      <div />
      <span className="text-xs text-text-secondary">{ideal}</span>
    </div>
  );
}
