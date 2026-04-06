import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

const GOAL_OPTIONS = [
  { label: 'Improve', value: 'improve' },
  { label: 'Maintain', value: 'maintain' },
  { label: 'Monitor', value: 'monitor' },
];

const MEASURES = [
  {
    key: 'caffeineDrinks',
    label: 'Average number of Caffeine drinks/day',
    ideal: '1-3 coffee, 6 cups tea\nNo energy drinks',
  },
  {
    key: 'hoursOfSleep',
    label: 'Average number of hours of sleep each night',
    ideal: '7-9 hours',
  },
  {
    key: 'waterIntake',
    label: 'Average water intake (cups/day)',
    ideal: '8 cups (64 ounces)',
  },
  {
    key: 'alcoholDrinks',
    label: 'Average number of drinks with alcohol a day',
    ideal: '0',
  },
  {
    key: 'fruitsVegetables',
    label: 'Average fruits and vegetable servings a day',
    ideal: '5 or more servings',
  },
  {
    key: 'whiteFood',
    label: 'Average servings of white food (bread, pasta, white rice) a day',
    ideal: '0',
  },
  {
    key: 'sugarFood',
    label:
      'Average servings of food or drinks with sugar a day (Pastries, Candy, sodas, juice)',
    ideal: '0',
  },
  {
    key: 'processedFood',
    label: 'Average servings of processed or fast foods a day',
    ideal: '0',
  },
  {
    key: 'proteinGrams',
    label: 'Average number of grams of protein a day',
    ideal: '60 or more grams',
  },
];

const RADIO_QUESTIONS = [
  { key: 'weighFood', label: 'Do you weigh your food?', ideal: 'Yes' },
  {
    key: 'logFoodDrinks',
    label: 'Do you log your food and drinks?',
    ideal: 'Yes',
  },
  { key: 'logExercise', label: 'Do you log your exercise?', ideal: 'Yes' },
];

export default function NutritionGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const nutrition = values?.nutritionGoals || {};

  return (
    <div className="flex flex-col gap-0">
      <p className="text-sm font-semibold text-text-primary mb-4">
        What Kind of Vegetables do you like best?
      </p>

      {/* Header */}
      <div className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 p-3 bg-neutral-100 items-center">
        <span className="text-xs font-semibold text-text-secondary">
          Measure
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Last State Date
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Current State – Date
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
          values={nutrition[measure.key] || {}}
          prefix={`nutritionGoals.${measure.key}`}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
        />
      ))}

      {/* Radio question rows */}
      {RADIO_QUESTIONS.map((question) => (
        <RadioRow
          key={question.key}
          question={question}
          values={nutrition[question.key] || {}}
          prefix={`nutritionGoals.${question.key}`}
          handleChange={handleChange}
        />
      ))}
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
    <div className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 py-4">
      <span className="text-sm text-text-primary font-medium pt-2">
        {measure.label}
      </span>

      {/* Last State Date */}
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

      {/* Current State – Date */}
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
      <div>
        <SelectDropdown
          name={`${prefix}.goal`}
          placeholder="Select"
          options={GOAL_OPTIONS}
          value={values?.goal || null}
          onChangeCb={(val) => setFieldValue(`${prefix}.goal`, val)}
        />
      </div>

      {/* Ideal */}
      <span className="text-xs text-text-secondary pt-2 whitespace-pre-line">
        {measure.ideal}
      </span>
    </div>
  );
}

function RadioRow({ question, values, prefix, handleChange }) {
  return (
    <div className="grid grid-cols-[160px_180px_180px_150px_1fr] gap-3 py-4 items-center">
      <span className="text-sm text-text-primary font-medium">
        {question.label}
      </span>

      {/* Last State */}
      <div className="flex items-center gap-4">
        {['Yes', 'No'].map((opt) => (
          <label
            key={`${question.key}-last-${opt}`}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="radio"
              name={`${prefix}.lastValue`}
              value={opt}
              checked={values?.lastValue === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* Current State */}
      <div className="flex items-center gap-4">
        {['Yes', 'No'].map((opt) => (
          <label
            key={`${question.key}-current-${opt}`}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="radio"
              name={`${prefix}.currentValue`}
              value={opt}
              checked={values?.currentValue === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* Empty goal column */}
      <div />

      {/* Ideal */}
      <span className="text-xs text-text-secondary">{question.ideal}</span>
    </div>
  );
}
