import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';

import TextArea from '../../../../../components/commonComponents/textArea/index';

const STRATEGY_OPTIONS = [
  { key: 'pillBox', label: 'Using a pill box' },
  { key: 'timerReminder', label: 'Setting a timer reminder on my phone' },
  { key: 'toothBrush', label: 'Putting my medications by my tooth brush' },
  { key: 'someoneHelp', label: 'Having someone help me take my medications' },
];

const FREQUENCY_OPTIONS = [
  'None of the time',
  'Some of the time',
  'Most of the time',
  'All of the time',
];

const QUESTIONS = [
  {
    key: 'forgetMedicine',
    label: 'How often do you forget to take your medicine?',
    lastValue: 'Some of the time',
  },
  {
    key: 'decideNotTake',
    label: 'How often do you decide not to take your medicine?',
    lastValue: 'Most of the time',
  },
  {
    key: 'runOut',
    label: 'How often do you run out of medicine?',
    lastValue: 'Most of the time',
  },
  {
    key: 'forgetPrescriptions',
    label: 'How often do you forget to get your prescriptions filled?',
    lastValue: 'Some of the time',
  },
  {
    key: 'missBeforeDoctor',
    label:
      'How often do you miss taking your medicine before you go to the doctor?',
    lastValue: 'Most of the time',
  },
  {
    key: 'stopFeelBetter',
    label: 'How often do you stop taking your medicine when you feel better?',
    lastValue: 'Some of the time',
  },
  {
    key: 'stopFeelWorse',
    label:
      'How often do you stop taking your medicine when you feel worse after taking it?',
    lastValue: 'Some of the time',
  },
];

export default function MedicationAdherenceGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const medication = values?.medicationAdherenceGoals || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Strategy selection */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-primary">
          What strategies are you currently doing to help you with medication
          adherence?
        </p>

        {STRATEGY_OPTIONS.map((strategy) => (
          <Checkbox
            key={strategy.key}
            name={`medicationAdherenceGoals.strategies.${strategy.key}`}
            label={strategy.label}
            checked={!!medication.strategies?.[strategy.key]}
            onChange={() =>
              setFieldValue(
                `medicationAdherenceGoals.strategies.${strategy.key}`,
                !medication.strategies?.[strategy.key],
              )
            }
          />
        ))}

        {/* Other with text input */}
        <div className="flex items-center gap-3">
          <Checkbox
            name="medicationAdherenceGoals.strategies.other"
            label="Other"
            checked={!!medication.strategies?.other}
            onChange={() =>
              setFieldValue(
                'medicationAdherenceGoals.strategies.other',
                !medication.strategies?.other,
              )
            }
          />
          <Input
            name="medicationAdherenceGoals.strategies.otherSpecify"
            placeholder="Enter"
            value={medication.strategies?.otherSpecify || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Questions table */}
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="grid grid-cols-[200px_180px_180px_1fr] gap-3 p-3 bg-neutral-100 items-center">
          <span className="text-xs font-semibold text-text-secondary">
            Self-Care / Stress Management
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Last State
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Current State
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            New Strategy to achieve ideal adherence this Month
          </span>
        </div>

        {/* Question rows */}
        {QUESTIONS.map((question) => {
          const qData = medication.questions?.[question.key] || {};
          const prefix = `medicationAdherenceGoals.questions.${question.key}`;

          return (
            <div
              key={question.key}
              className="grid grid-cols-[200px_180px_180px_1fr] gap-3 py-4 border-b border-neutral-100"
            >
              <span className="text-sm text-text-primary font-medium">
                {question.label}
              </span>

              {/* Last State */}
              <div className="flex flex-col gap-2">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <Checkbox
                    key={`${question.key}-last-${opt}`}
                    name={`${prefix}.lastValue`}
                    label={opt}
                    variant="blue"
                    checked={qData.lastValue === opt}
                    onChange={() => setFieldValue(`${prefix}.lastValue`, opt)}
                  />
                ))}
              </div>

              {/* Current State */}
              <div className="flex flex-col gap-2">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <Checkbox
                    key={`${question.key}-current-${opt}`}
                    name={`${prefix}.currentValue`}
                    label={opt}
                    checked={qData.currentValue === opt}
                    onChange={() =>
                      setFieldValue(`${prefix}.currentValue`, opt)
                    }
                  />
                ))}
              </div>

              {/* Strategy text area */}
              <TextArea
                name={`${prefix}.strategy`}
                placeholder="Enter..."
                value={qData.strategy || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
