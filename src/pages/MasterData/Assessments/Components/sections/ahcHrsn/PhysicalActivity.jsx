const DAYS_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7'];
const MINUTES_OPTIONS = [
  '0',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '90',
  '120',
  '150 or greater',
];

export default function PhysicalActivity({ values, handleChange }) {
  const pa = values?.physicalActivity || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Physical Activity
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. In the last 30 days, other than the activities you did for work, on
          average, how many days per week did you engage in moderate exercise
          (like walking fast, running, jogging, dancing, swimming, biking, or
          other similar activities)?
        </p>
        {DAYS_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="physicalActivity.daysPerWeek"
              value={opt}
              checked={pa.daysPerWeek === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. On average, how many minutes did you usually spend exercising at
          this level on one of those days?
        </p>
        {MINUTES_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="physicalActivity.minutesPerDay"
              value={opt}
              checked={pa.minutesPerDay === opt}
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
