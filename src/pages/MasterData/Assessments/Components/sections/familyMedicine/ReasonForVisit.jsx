import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';

export default function ReasonForVisit({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const r = values?.reasonForVisit || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Reason for Visit & Health Goals
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">What brings you in today?</p>
        <Input
          name="reasonForVisit.bringsYouIn"
          placeholder="Enter"
          value={r.bringsYouIn || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">
          What matters most to you in your health and life?
        </p>
        <Input
          name="reasonForVisit.mattersToYou"
          placeholder="Enter"
          value={r.mattersToYou || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-text-primary">
          Top 3 health goals for the next 6–12 months:
        </p>
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center gap-3">
            <span className="text-sm text-text-primary w-5 shrink-0">
              {num}.
            </span>
            <Input
              name={`reasonForVisit.healthGoal${num}`}
              placeholder="Enter"
              value={r[`healthGoal${num}`] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <Checkbox
        label="Information in above section has been confirmed"
        name="reasonForVisit.informationConfirmed"
        checked={!!r.informationConfirmed}
        onChange={(e) =>
          setFieldValue('reasonForVisit.informationConfirmed', e.target.checked)
        }
        variant="blue"
      />
    </div>
  );
}
