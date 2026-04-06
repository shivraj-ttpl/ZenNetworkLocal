import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';

const CONDITIONS = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'highBloodPressure', label: 'High blood pressure' },
  { key: 'highCholesterol', label: 'High cholesterol' },
  { key: 'obesityOverweight', label: 'Obesity/Overweight' },
  { key: 'heartDisease', label: 'Heart disease/Heart failure' },
  { key: 'strokeTia', label: 'Stroke/TIA' },
  { key: 'asthma', label: 'Asthma' },
  { key: 'copdEmphysema', label: 'COPD/Emphysema' },
  { key: 'chronicKidneyDisease', label: 'Chronic kidney disease' },
  { key: 'thyroidDisorder', label: 'Thyroid disorder' },
  { key: 'cancerType', label: 'Cancer (type)' },
  { key: 'depression', label: 'Depression' },
  { key: 'anxiety', label: 'Anxiety' },
  { key: 'ptsd', label: 'PTSD' },
  { key: 'bipolarDisorder', label: 'Bipolar disorder' },
  { key: 'schizophrenia', label: 'Schizophrenia/Psychotic disorder' },
  { key: 'substanceUseDisorder', label: 'Substance use disorder' },
  { key: 'suicideAttempt', label: 'History of Suicide Attempt' },
  { key: 'chronicPain', label: 'Chronic pain/arthritis' },
  { key: 'sleepApnea', label: 'Sleep apnea' },
  { key: 'liverDisease', label: 'Liver disease/Hepatitis' },
  { key: 'hiv', label: 'HIV' },
  { key: 'otherChronicIllness', label: 'Other chronic illness' },
];

export default function PastMedicalHistory({ values, setFieldValue }) {
  const conditions = values?.pastMedicalHistory?.conditions || {};

  return (
    <div className="flex flex-col gap-0">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Past Medical History
      </h3>

      {/* Header */}
      <div className="grid grid-cols-2 gap-4 px-2 pb-2">
        <span className="text-sm font-medium text-text-secondary">
          Chronic Disease Condition
        </span>
        <span className="text-sm font-medium text-text-secondary">
          Onset Date
        </span>
      </div>

      {/* Rows */}
      {CONDITIONS.map((condition, idx) => (
        <div
          key={condition.key}
          className="grid grid-cols-2 gap-4 px-2 py-2.5 border-t border-border items-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary w-7 shrink-0">
              {idx + 1}.
            </span>
            <Checkbox
              checked={!!conditions[condition.key]?.checked}
              onChange={(e) =>
                setFieldValue(
                  `pastMedicalHistory.conditions.${condition.key}.checked`,
                  e.target.checked,
                )
              }
              variant="blue"
            />
            <span className="text-sm text-text-primary">{condition.label}</span>
          </div>
          <Input
            name={`pastMedicalHistory.conditions.${condition.key}.onsetDate`}
            type="date"
            placeholder="Select"
            value={conditions[condition.key]?.onsetDate || ''}
            onChange={(e) =>
              setFieldValue(
                `pastMedicalHistory.conditions.${condition.key}.onsetDate`,
                e.target.value,
              )
            }
          />
        </div>
      ))}
    </div>
  );
}
