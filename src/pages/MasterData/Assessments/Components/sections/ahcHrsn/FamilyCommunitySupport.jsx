const HELP_OPTIONS = [
  "I don't need any help",
  'I get all the help I need',
  'I could use a little more help',
  'I need a lot more help',
];

const LONELY_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

export default function FamilyCommunitySupport({ values, handleChange }) {
  const fcs = values?.familyCommunitySupport || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Family and Community Support
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. If for any reason you need help with day-to-day activities such as
          bathing, preparing meals, shopping, managing finances, etc., do you
          get the help you need?
        </p>
        {HELP_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyCommunitySupport.dailyHelp"
              value={opt}
              checked={fcs.dailyHelp === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. How often do you feel lonely or isolated from those around you?
        </p>
        {LONELY_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyCommunitySupport.lonely"
              value={opt}
              checked={fcs.lonely === opt}
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
