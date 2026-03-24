import Input from '@/components/commonComponents/input/Input';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';

const INPUT_QUESTIONS = [
  { key: 'heightFeet', label: '1. Height:', prefix: 'Feet' },
  { key: 'heightInches', label: null, prefix: 'Inches' },
  { key: 'weight', label: '2. Weight', prefix: 'Pounds' },
  { key: 'bmiValue', label: '3. Your BMI is:' },
  { key: 'idealWeight', label: '4. What is your ideal weight?' },
];

const RADIO_QUESTIONS = [
  { key: 'fingerStickGlucometer', label: '5. Do you have a finger stick glucometer?' },
  { key: 'continuousGlucose', label: '6. Do you have continuous glucose monitoring?' },
  { key: 'bloodPressureCuff', label: '7. Do you have a blood pressure cuff?' },
];

const SINGLE_INPUT_QUESTIONS = [
  { key: 'systolicBPToday', label: '8. Systolic Blood Pressure today:' },
  { key: 'diastolicBPToday', label: '9. Diastolic Blood Pressure today:' },
  { key: 'pulseToday', label: '10. Pulse today:' },
  { key: 'lowGlucoseLastWeek', label: '11. Low Glucose Last Week:' },
  { key: 'highGlucoseLastWeek', label: '12. High Glucose Last Week:' },
];

const MEASURES = [
  { key: 'bmi', label: 'BMI', ideal: '19 – 25 pounds' },
  { key: 'systolicBP', label: 'Systolic BP (top number)', ideal: '100-130' },
  { key: 'diastolicBP', label: 'Diastolic Blood Pressure (bottom number)', ideal: '60-80' },
  { key: 'pulse', label: 'Pulse', ideal: '60-99' },
  { key: 'lowGlucose', label: 'Low Glucose last week', ideal: '>90' },
  { key: 'highGlucose', label: 'High Glucose last week', ideal: '<150' },
];

export default function HomeTrackingGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const tracking = values?.homeTrackingGoals || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Questions section */}
      <div className="flex flex-col gap-4">
        {/* 1. Height - Feet & Inches */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
            1. Height:
          </span>
          <span className="text-sm text-text-secondary">Feet</span>
          <div className="w-[120px]">
            <Input
              name="homeTrackingGoals.heightFeet"
              placeholder="Enter"
              value={tracking.heightFeet || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <span className="text-sm text-text-secondary">Inches</span>
          <div className="w-[120px]">
            <Input
              name="homeTrackingGoals.heightInches"
              placeholder="Enter"
              value={tracking.heightInches || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* 2. Weight */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
            2. Weight
          </span>
          <span className="text-sm text-text-secondary">Pounds</span>
          <div className="w-[120px]">
            <Input
              name="homeTrackingGoals.weight"
              placeholder="Enter"
              value={tracking.weight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* 3. BMI */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
            3. Your BMI is:
          </span>
          <div className="w-[120px]">
            <Input
              name="homeTrackingGoals.bmiValue"
              placeholder="Enter"
              value={tracking.bmiValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* 4. Ideal weight */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
            4. What is your ideal weight?
          </span>
          <div className="w-[120px]">
            <Input
              name="homeTrackingGoals.idealWeight"
              placeholder="Enter"
              value={tracking.idealWeight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* 5-7. Radio questions */}
        {RADIO_QUESTIONS.map((q) => (
          <div key={q.key} className="flex items-center gap-3">
            <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
              {q.label}
            </span>
            <div className="flex items-center gap-4">
              {['Yes', 'No'].map((opt) => (
                <label
                  key={`${q.key}-${opt}`}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`homeTrackingGoals.${q.key}`}
                    value={opt}
                    checked={tracking[q.key] === opt}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* 8-12. Single input questions */}
        {SINGLE_INPUT_QUESTIONS.map((q) => (
          <div key={q.key} className="flex items-center gap-3">
            <span className="text-sm text-text-primary font-medium w-[240px] shrink-0">
              {q.label}
            </span>
            <div className="w-[120px]">
              <Input
                name={`homeTrackingGoals.${q.key}`}
                placeholder="Enter"
                value={tracking[q.key] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Measures table */}
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 p-3 bg-neutral-100 items-center">
          <span className="text-xs font-semibold text-text-secondary">
            Measures to Track
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
        {MEASURES.map((measure) => {
          const data = tracking.measures?.[measure.key] || {};
          const prefix = `homeTrackingGoals.measures.${measure.key}`;

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
                  onChangeCb={(val) =>
                    setFieldValue(`${prefix}.lastDate`, val)
                  }
                  placeholder="Select Date"
                />
              </div>

              {/* Current Value */}
              <div className="flex flex-col gap-2">
                <Input
                  name={`${prefix}.currentValue`}
                  placeholder="Enter"
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
                <Input
                  name={`${prefix}.goal`}
                  placeholder="Enter"
                  value={data.goal || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
