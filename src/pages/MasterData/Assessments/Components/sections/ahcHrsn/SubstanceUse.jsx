const FREQUENCY_OPTIONS = ["Never", "Once or Twice", "Monthly", "Weekly", "Daily or Almost Daily"];

const QUESTIONS = [
  {
    key: "alcohol",
    label:
      "1. How many times in the past 12 months have you had 5 or more drinks in a day (males) or 4 or more drinks in a day (females)? One drink is 12 ounces of beer, 5 ounces of wine, or 1.5 ounces of 80-proof spirits.",
  },
  {
    key: "tobacco",
    label:
      "2. How many times in the past 12 months have you used tobacco products (like cigarettes, cigars, snuff, chew, electronic cigarettes)?",
  },
  {
    key: "prescriptionDrugs",
    label:
      "3. How many times in the past year have you used prescription drugs for non-medical reasons?",
  },
  {
    key: "illegalDrugs",
    label: "4. How many times in the past year have you used illegal drugs?",
  },
];

export default function SubstanceUse({ values, handleChange }) {
  const su = values?.substanceUse || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Substance Use</h3>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.label}</p>
          {FREQUENCY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`substanceUse.${q.key}`}
                value={opt}
                checked={su[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
