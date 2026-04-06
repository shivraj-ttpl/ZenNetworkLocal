import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import TextArea from '@/components/commonComponents/textArea/index';

const BARRIERS = [
  {
    key: 'transportation',
    label: "Can't get transportation to medical visits",
    solutions: [
      { key: 'linkTransportation', label: 'Link to Transportation' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'childElderCare',
    label: 'Need help with child or elder adult care',
    solutions: [
      { key: 'telemedicineVisit', label: 'Telemedicine Visit' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'workPrevents',
    label: 'Work prevents me from going to medical appointments',
    solutions: [
      { key: 'telemedicineVisit', label: 'Telemedicine Visit' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'forgettingMedications',
    label: 'Forgetting to take medications',
    solutions: [
      { key: 'workAdherencePlan', label: 'Work on adherence plan' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'costMedications',
    label: 'Cost of medications and supplies',
    solutions: [
      { key: 'tryGoodRx', label: 'Try Good Rx' },
      { key: 'patientAssistance', label: 'Patient assistance Program' },
    ],
  },
  {
    key: 'dietRestrictions',
    label: 'Difficulty following diet restrictions',
    solutions: [
      { key: 'nutritionist', label: 'Nutritionist' },
      { key: 'lifestyleProgram', label: 'Lifestyle Program' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'lowBloodSugar',
    label: 'Fear of low blood sugar episodes',
    solutions: [
      { key: 'continuousGlucose', label: 'Continuous Glucose Monitor' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'lackFamilySupport',
    label: 'Lack of family support',
    solutions: [
      { key: 'supportCHW', label: 'Support from CHW' },
      { key: 'joinGroupActivity', label: 'Join group activity' },
      { key: 'other', label: 'Other' },
    ],
  },
  {
    key: 'workScheduleConflicts',
    label: 'Work schedule conflicts with meal timing',
    solutions: [
      { key: 'mealPrep', label: 'Meal Prep' },
      { key: 'changeMedTiming', label: 'Change med timing' },
      { key: 'other', label: 'Other' },
    ],
  },
];

const EXPECTED_OUTCOMES = [
  { key: 'hba1cBelow7', label: 'HbA1c maintained below 7%' },
  { key: 'reducedRisk', label: 'Reduced risk of diabetes complications' },
  { key: 'betterEnergy', label: 'Better daily energy levels' },
  { key: 'improvedAdherence', label: 'Improved medication adherence' },
  { key: 'weightLoss', label: 'Weight loss' },
  {
    key: 'bloodSugarReadings',
    label: 'Blood sugar readings between 80 and 150',
  },
  { key: 'bloodPressureBelow', label: 'Blood Pressure below 140/90' },
  { key: 'betterQuality', label: 'Better quality of life' },
];

const CONFIDENCE_OPTIONS = [
  { key: 'veryConfident', label: 'Very Confident' },
  { key: 'somewhatConfident', label: 'Somewhat Confident' },
  { key: 'notVeryConfident', label: 'Not Very Confident' },
  { key: 'notAtAllConfident', label: 'Not at all Confident' },
];

const FOLLOW_UP_OPTIONS = [
  { key: 'oneDay', label: '1 day' },
  { key: 'oneWeek', label: '1 week' },
  { key: 'oneMonth', label: '1 month' },
  { key: 'threeMonths', label: '3 months' },
  { key: 'sixMonths', label: '6 months' },
];

export default function PlanForSuccess({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const plan = values?.planForSuccess || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Barriers and Solutions */}
      <div className="flex flex-col gap-0">
        <div className="bg-neutral-200 px-4 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Barriers and Solutions
          </span>
        </div>

        <p className="text-sm font-semibold text-text-primary mt-4 mb-3">
          What makes it difficult to manage your diabetes? What could help?
        </p>

        {/* Header */}
        <div className="grid grid-cols-[300px_220px_1fr] gap-3 p-3 bg-neutral-100 items-center">
          <span className="text-xs font-semibold text-text-secondary">
            Barriers
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Potential Solutions
          </span>
          <span className="text-xs font-semibold text-text-secondary">
            Plan Notes
          </span>
        </div>

        {/* Barrier rows */}
        {BARRIERS.map((barrier) => {
          const barrierData = plan.barriers?.[barrier.key] || {};
          const prefix = `planForSuccess.barriers.${barrier.key}`;

          return (
            <div
              key={barrier.key}
              className="grid grid-cols-[300px_220px_1fr] gap-3 py-4 border-b border-neutral-100"
            >
              <Checkbox
                name={`${prefix}.checked`}
                label={barrier.label}
                checked={!!barrierData.checked}
                onChange={() =>
                  setFieldValue(`${prefix}.checked`, !barrierData.checked)
                }
              />

              <div className="flex flex-col gap-2">
                {barrier.solutions.map((sol) => (
                  <Checkbox
                    key={sol.key}
                    name={`${prefix}.solutions.${sol.key}`}
                    label={sol.label}
                    checked={!!barrierData.solutions?.[sol.key]}
                    onChange={() =>
                      setFieldValue(
                        `${prefix}.solutions.${sol.key}`,
                        !barrierData.solutions?.[sol.key],
                      )
                    }
                  />
                ))}
              </div>

              <TextArea
                name={`${prefix}.planNotes`}
                placeholder="Enter..."
                value={barrierData.planNotes || ''}
                onChangeCb={(e) =>
                  setFieldValue(`${prefix}.planNotes`, e.target.value)
                }
                rows={3}
              />
            </div>
          );
        })}
      </div>

      {/* Expected Outcome */}
      <div className="flex flex-col gap-3">
        <div className="bg-neutral-200 px-4 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Expected Outcome
          </span>
        </div>

        <p className="text-sm font-semibold text-text-primary mt-2">
          What diabetes management outcomes do you hope to achieve?
        </p>

        {EXPECTED_OUTCOMES.map((outcome) => (
          <Checkbox
            key={outcome.key}
            name={`planForSuccess.expectedOutcomes.${outcome.key}`}
            label={outcome.label}
            checked={!!plan.expectedOutcomes?.[outcome.key]}
            onChange={() =>
              setFieldValue(
                `planForSuccess.expectedOutcomes.${outcome.key}`,
                !plan.expectedOutcomes?.[outcome.key],
              )
            }
          />
        ))}

        {/* Other with text input */}
        <div className="flex items-center gap-3">
          <Checkbox
            name="planForSuccess.expectedOutcomes.other"
            label="Other"
            checked={!!plan.expectedOutcomes?.other}
            onChange={() =>
              setFieldValue(
                'planForSuccess.expectedOutcomes.other',
                !plan.expectedOutcomes?.other,
              )
            }
          />
          <Input
            name="planForSuccess.expectedOutcomes.otherSpecify"
            placeholder="Enter"
            value={plan.expectedOutcomes?.otherSpecify || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Confidence */}
      <div className="flex flex-col gap-3">
        <div className="bg-neutral-200 px-4 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Confidence
          </span>
        </div>

        <p className="text-sm font-semibold text-text-primary mt-2">
          How confident are you that you can achieve your self-management goals
          over the next month?
        </p>

        {CONFIDENCE_OPTIONS.map((option) => (
          <Checkbox
            key={option.key}
            name="planForSuccess.confidence"
            label={option.label}
            checked={plan.confidence === option.key}
            onChange={() =>
              setFieldValue('planForSuccess.confidence', option.key)
            }
          />
        ))}
      </div>

      {/* Additional Notes */}
      <div className="flex flex-col gap-3">
        <div className="bg-neutral-200 px-4 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Additional Notes
          </span>
        </div>

        <p className="text-sm font-semibold text-text-primary mt-2">
          Any other information about your diabetes management
        </p>

        <TextArea
          name="planForSuccess.additionalNotes"
          placeholder="Enter..."
          value={plan.additionalNotes || ''}
          onChangeCb={(e) =>
            setFieldValue('planForSuccess.additionalNotes', e.target.value)
          }
          rows={6}
        />
      </div>

      {/* Follow up plan */}
      <div className="flex flex-col gap-3">
        <div className="bg-neutral-200 px-4 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Follow up plan for next Care Management Session
          </span>
        </div>

        <p className="text-sm font-semibold text-text-primary mt-2">
          How confident are you that you can achieve your self-management goals
          over the next month?
        </p>

        {FOLLOW_UP_OPTIONS.map((option) => (
          <Checkbox
            key={option.key}
            name={`planForSuccess.followUp.${option.key}`}
            label={option.label}
            checked={!!plan.followUp?.[option.key]}
            onChange={() =>
              setFieldValue(
                `planForSuccess.followUp.${option.key}`,
                !plan.followUp?.[option.key],
              )
            }
          />
        ))}

        {/* Other with text input */}
        <div className="flex items-center gap-3">
          <Checkbox
            name="planForSuccess.followUp.other"
            label="Other"
            checked={!!plan.followUp?.other}
            onChange={() =>
              setFieldValue(
                'planForSuccess.followUp.other',
                !plan.followUp?.other,
              )
            }
          />
          <Input
            name="planForSuccess.followUp.otherSpecify"
            placeholder="Enter"
            value={plan.followUp?.otherSpecify || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
}
