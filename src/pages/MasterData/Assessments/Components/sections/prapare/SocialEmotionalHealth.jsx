import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';

const SOCIAL_CONNECTION_OPTIONS = [
  'Less than high school degree',
  'High school diploma or GED',
  'More than high school',
  'I choose not to answer this question',
];

const WORK_OPTIONS = [
  'Unemployed',
  'Part-time or temporary work',
  'Full-time work',
];

const INSURANCE_OPTIONS = [
  'None/uninsured',
  'Medicaid',
  'CHIP Medicaid',
  'Medicare',
  'Other public insurance (not CHIP)',
  'Other public insurance (CHIP)',
  'Private Insurance',
];

const UNABLE_TO_GET_OPTIONS = [
  { key: 'food', label: 'Food' },
  { key: 'clothing', label: 'Clothing' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'childCare', label: 'Child Care' },
  {
    key: 'medicineHealthCare',
    label:
      'Medicine or Any Health Care (Medical, Dental, Mental Health, Vision)',
  },
  { key: 'phone', label: 'Phone' },
];

const TRANSPORTATION_FREQUENCY_OPTIONS = [
  'Less than once a week',
  '1 or 2 times a week',
  '3 to 5 times a week',
  '5 or more times a week',
  'I choose not to answer this question',
];

const STRESS_OPTIONS = [
  'Not at all',
  'A little bit',
  'Somewhat',
  'Quite a bit',
  'Very much',
  'I choose not to answer this question',
];

export default function SocialEmotionalHealth({
  values,
  handleChange,
  setFieldValue,
}) {
  const seh = values?.socialEmotionalHealth || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Social and Emotional Health
      </h3>

      {/* 1. Social connection */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. How often do you see or talk to people that you care about and feel
          close to? (For example: talking to friends on the phone, visiting
          friends or family, going to church or club meetings)
        </p>
        {SOCIAL_CONNECTION_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="socialEmotionalHealth.socialConnection"
              value={opt}
              checked={seh.socialConnection === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 2. Work situation */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. What is your current work situation?
        </p>
        {WORK_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="socialEmotionalHealth.work"
              value={opt}
              checked={seh.work === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="socialEmotionalHealth.work"
            value="otherwiseUnemployed"
            checked={seh.work === 'otherwiseUnemployed'}
            onChange={handleChange}
            className="w-4 h-4 accent-primary mt-0.5"
          />
          <span className="text-sm">
            Otherwise unemployed but not seeking work (ex: student, retired,
            disabled, unpaid primary care giver) Please write:
          </span>
        </label>
        {seh.work === 'otherwiseUnemployed' && (
          <div className="ml-6">
            <Input
              name="socialEmotionalHealth.workOtherSpecify"
              placeholder="Type here"
              value={seh.workOtherSpecify || ''}
              onChange={handleChange}
            />
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="socialEmotionalHealth.work"
            value="chooseNotToAnswer"
            checked={seh.work === 'chooseNotToAnswer'}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 3. Insurance */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          3. What is your main insurance?
        </p>
        {INSURANCE_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="socialEmotionalHealth.insurance"
              value={opt}
              checked={seh.insurance === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 4. Income */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          4. During the past year, what was the total combined income for you
          and the family members you live with? This information will help us
          determine if you are eligible for any benefits.
        </p>
        <Input
          name="socialEmotionalHealth.income"
          placeholder=""
          value={seh.income || ''}
          onChange={handleChange}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="socialEmotionalHealth.incomeDecline"
            value="decline"
            checked={seh.incomeDecline === 'decline'}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 5. Unable to get necessities */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          5. In the past year, have you or any family members you live with been
          unable to get any of the following when it was really needed? Check
          all that apply.
        </p>
        {UNABLE_TO_GET_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.key}
            name={`socialEmotionalHealth.unableToGet.${opt.key}`}
            label={opt.label}
            checked={!!seh.unableToGet?.[opt.key]}
            onChange={() =>
              setFieldValue(
                `socialEmotionalHealth.unableToGet.${opt.key}`,
                !seh.unableToGet?.[opt.key],
              )
            }
          />
        ))}
        <div className="flex items-center gap-3">
          <Checkbox
            name="socialEmotionalHealth.unableToGet.other"
            label="Other (please write):"
            checked={!!seh.unableToGet?.other}
            onChange={() =>
              setFieldValue(
                'socialEmotionalHealth.unableToGet.other',
                !seh.unableToGet?.other,
              )
            }
          />
        </div>
        {seh.unableToGet?.other && (
          <div className="ml-6">
            <Input
              name="socialEmotionalHealth.unableToGetOther"
              placeholder=""
              value={seh.unableToGetOther || ''}
              onChange={handleChange}
            />
          </div>
        )}
        <Checkbox
          name="socialEmotionalHealth.unableToGet.chooseNotToAnswer"
          label="I choose not to answer this question"
          checked={!!seh.unableToGet?.chooseNotToAnswer}
          onChange={() =>
            setFieldValue(
              'socialEmotionalHealth.unableToGet.chooseNotToAnswer',
              !seh.unableToGet?.chooseNotToAnswer,
            )
          }
        />
      </div>

      {/* 6. Transportation */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          6. Has lack of transportation kept you from medical appointments,
          meetings, work, or from getting things needed for daily living? Check
          all that apply.
        </p>
        {TRANSPORTATION_FREQUENCY_OPTIONS.map((opt) => (
          <Checkbox
            key={opt}
            name={`socialEmotionalHealth.transportation.${opt}`}
            label={opt}
            checked={!!seh.transportation?.[opt]}
            onChange={() =>
              setFieldValue(
                `socialEmotionalHealth.transportation.${opt}`,
                !seh.transportation?.[opt],
              )
            }
          />
        ))}
      </div>

      {/* 7. Stress */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          7. Stress is when someone feels tense, nervous, anxious, or can&apos;t
          sleep at night because their mind is troubled. How stressed are you?
        </p>
        {STRESS_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="socialEmotionalHealth.stress"
              value={opt}
              checked={seh.stress === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
