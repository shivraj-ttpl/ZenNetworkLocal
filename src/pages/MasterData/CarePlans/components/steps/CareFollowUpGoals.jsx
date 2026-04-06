import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import Input from '@/components/commonComponents/input/Input';

const REFERRALS = [
  { key: 'primaryCareVisit', label: 'Primary Care Visit' },
  { key: 'clinicalPharmacists', label: 'Visit with Clinical Pharmacists' },
  { key: 'diabetesNutritionist', label: 'Visit with Diabetes Nutritionist' },
  { key: 'physicalTherapist', label: 'Physical Therapist or Personal Trainer' },
  { key: 'socialServiceVisit', label: 'Social Service Visit' },
  { key: 'eyeExam', label: 'Eye Exam' },
  { key: 'footExam', label: 'Foot Exam' },
  { key: 'counseling', label: 'Counseling' },
];

export default function CareFollowUpGoals({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const followUp = values?.careFollowUpGoals || {};

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="grid grid-cols-[240px_220px_190px_190px] gap-3 p-3 bg-neutral-100 items-center">
        <span className="text-xs font-semibold text-text-secondary">
          Recommended Referrals
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Date Referred
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Place Referred
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          Date Completed
        </span>
      </div>

      {/* Referral rows */}
      {REFERRALS.map((referral) => {
        const data = followUp[referral.key] || {};
        const prefix = `careFollowUpGoals.${referral.key}`;

        return (
          <div
            key={referral.key}
            className="grid grid-cols-[240px_220px_200px_200px] gap-3 py-4 border-b border-neutral-100 items-center"
          >
            <span className="text-sm text-text-primary font-medium">
              {referral.label}
            </span>

            <DatePicker
              name={`${prefix}.dateReferred`}
              value={data.dateReferred || null}
              onChangeCb={(val) => setFieldValue(`${prefix}.dateReferred`, val)}
              placeholder="Select Date"
            />

            <Input
              name={`${prefix}.placeReferred`}
              placeholder="Enter"
              value={data.placeReferred || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <DatePicker
              name={`${prefix}.dateCompleted`}
              value={data.dateCompleted || null}
              onChangeCb={(val) =>
                setFieldValue(`${prefix}.dateCompleted`, val)
              }
              placeholder="Select Date"
            />
          </div>
        );
      })}
    </div>
  );
}
