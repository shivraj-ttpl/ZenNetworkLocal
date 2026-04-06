const NIDA_OPTIONS = [
  { label: '(0) Never', value: '0' },
  { label: '(1) Once or twice', value: '1' },
  { label: '(2) Monthly', value: '2' },
  { label: '(3) Weekly', value: '3' },
  { label: '(4) Daily or almost daily (How many years?)', value: '4' },
];

const QUESTIONS = [
  {
    key: 'tobacco',
    text: '1. In the past year, how many times have you used tobacco products (cigarettes, cigars, pipes, vaping, snuff, chew)?',
  },
  {
    key: 'alcohol',
    text: '2. In the past year, how many times have you had 5 (men) or 4 (women) or more drinks containing alcohol in one day?',
  },
  {
    key: 'prescriptionDrugs',
    text: '3. In the past year, how many times have you used a prescription medication (e.g., opioids, benzodiazepines, stimulants) for reasons other than prescribed?',
  },
  {
    key: 'illegalDrugs',
    text: '4. In the past year, how many times have you used illegal drugs (e.g., marijuana, cocaine, heroin, methamphetamine, ecstasy, hallucinogens)',
  },
];

export default function SubstanceUseNida({ values, setFieldValue }) {
  const su = values?.substanceUseNida || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Substance Use (NIDA Quick Screen)
      </h3>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {NIDA_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name={`substanceUseNida.${q.key}`}
                  value={opt.value}
                  checked={su[q.key] === opt.value}
                  onChange={() =>
                    setFieldValue(`substanceUseNida.${q.key}`, opt.value)
                  }
                  className="accent-primary w-4 h-4 shrink-0"
                />
                <span className="text-sm text-text-primary">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
