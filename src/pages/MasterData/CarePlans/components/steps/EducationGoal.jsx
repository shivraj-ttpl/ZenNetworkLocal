import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';

const EDUCATION_MODULES = [
  {
    key: 'welcomeGettingStarted',
    label: '1. Welcome to the Program / Getting Started Understanding Diabetes',
  },
  { key: 'trackingFoodActivity', label: '2. Tracking Food and Activity' },
  { key: 'beFatDetective', label: '3. Be a Fat Detective' },
  { key: 'healthyEating', label: '4. Healthy Eating' },
  { key: 'moveThoseMuscles', label: '5. Move Those Muscles' },
  { key: 'problemSolving', label: '6. Problem Solving' },
  {
    key: 'slipperySlopeLifestyle',
    label: '7. Slippery Slope of Lifestyle Change',
  },
  { key: 'healthyEatingOut', label: '8. Healthy Eating Out' },
  { key: 'managingStress', label: '9. Managing Stress' },
  {
    key: 'stayingMotivated',
    label: '10. Staying Motivated / Staying on Track',
  },
  { key: 'heartHealth', label: '11. Heart Health' },
  { key: 'takeChargeThoughts', label: '12. Take Charge of Your Thoughts' },
  { key: 'gettingBackOnTrack', label: '13. Getting Back on Track' },
  { key: 'sleepAndHealth', label: '14. Sleep and Health' },
  { key: 'timeManagement', label: '15. Time Management / Balancing Life' },
  { key: 'stayingActiveForLife', label: '16. Staying Active for Life' },
  { key: 'healthyEatingForLife', label: '17. Healthy Eating for Life' },
  { key: 'lookingBackForward', label: '18. Looking Back and Looking Forward' },
  {
    key: 'copingHolidays',
    label: '19. Coping with Holidays & Special Occasions',
  },
  { key: 'familySocialSupport', label: '20. Family & Social Support' },
  { key: 'mindfulEating', label: '21. Mindful Eating' },
  { key: 'preventingWeightRegain', label: '22. Preventing Weight Regain' },
];

export default function EducationGoal({ values, setFieldValue }) {
  const education = values?.educationGoal || {};

  return (
    <div className="flex flex-col gap-0">
      <p className="text-sm font-semibold text-text-primary mb-4">
        Which recommended education modules have you completed for Diabetes?
      </p>

      {/* Header */}
      <div className="grid grid-cols-[1fr_200px_140px] gap-3 p-3 bg-neutral-100 items-center">
        <span className="text-xs font-semibold text-text-secondary">
          Modules from the Diabetes Prevention Program
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Completed Date
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Goal this Month
        </span>
      </div>

      {/* Module rows */}
      {EDUCATION_MODULES.map((mod) => {
        const moduleData = education[mod.key] || {};
        const prefix = `educationGoal.${mod.key}`;

        return (
          <div
            key={mod.key}
            className="grid grid-cols-[1fr_200px_140px] gap-3 py-3 px-3 border-b border-neutral-100 items-center"
          >
            <span className="text-sm text-text-primary">{mod.label}</span>

            <DatePicker
              name={`${prefix}.completedDate`}
              value={moduleData.completedDate || null}
              onChangeCb={(val) =>
                setFieldValue(`${prefix}.completedDate`, val)
              }
              placeholder="Select Date"
            />

            <Checkbox
              name={`${prefix}.goalThisMonth`}
              label="Yes"
              checked={!!moduleData.goalThisMonth}
              onChange={() =>
                setFieldValue(
                  `${prefix}.goalThisMonth`,
                  !moduleData.goalThisMonth,
                )
              }
            />
          </div>
        );
      })}
    </div>
  );
}
