const YES_NO_CHOOSE = ['Yes', 'No', 'I choose not to answer this question'];

const QUESTIONS = [
  {
    key: 'jailPrison',
    label:
      '1. In the past year, have you spent more than 2 nights in a row in a jail, prison, detention center, or juvenile correctional facility?',
  },
  {
    key: 'refugee',
    label: '2. Are you a refugee?',
  },
  {
    key: 'physicallySafe',
    label:
      '3. Do you feel physically and emotionally safe where you currently live?',
  },
  {
    key: 'afraidOfPartner',
    label:
      '4. In the past year, have you been afraid of your partner or ex-partner?',
  },
];

export default function OptionalAdditionalQuestions({ values, handleChange }) {
  const oaq = values?.optionalAdditionalQuestions || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Optional Additional Questions
      </h3>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.label}</p>
          {YES_NO_CHOOSE.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`optionalAdditionalQuestions.${q.key}`}
                value={opt}
                checked={oaq[q.key] === opt}
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
