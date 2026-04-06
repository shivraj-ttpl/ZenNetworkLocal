const FREQUENCY_OPTIONS = [
  'Never',
  'Rarely',
  'Sometimes',
  'Fairly often',
  'Frequently',
];

const QUESTIONS = [
  {
    key: 'physicallyHurt',
    label:
      '1. How often does anyone, including family and friends, physically hurt you?',
  },
  {
    key: 'insult',
    label:
      '2. How often does anyone, including family and friends, insult or talk down to you?',
  },
  {
    key: 'threaten',
    label:
      '3. How often does anyone, including family and friends, threaten you with harm?',
  },
  {
    key: 'screamCurse',
    label:
      '4. How often does anyone, including family and friends, scream or curse at you?',
  },
];

export default function Safety({ values, handleChange }) {
  const s = values?.safety || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Safety</h3>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.label}</p>
          {FREQUENCY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`safety.${q.key}`}
                value={opt}
                checked={s[q.key] === opt}
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
