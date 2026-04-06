const QUESTIONS = [
  { key: 'generalHealth', text: '1.  General health:' },
  { key: 'qualityOfLife', text: '2. Quality of life:' },
  { key: 'physicalHealth', text: '3. Physical health:' },
  { key: 'mentalHealth', text: '4. Mental health (mood/ability to think):' },
  {
    key: 'socialActivities',
    text: '5. Satisfaction with social relationships:',
  },
  {
    key: 'carryOutActivities',
    text: '6. Ability to carry out every day physical activities:',
  },
  { key: 'emotionalProblems', text: '7. Frequency of emotional problems:' },
  { key: 'fatigue', text: '8. Average fatigue:' },
  { key: 'averagePain', text: '9. Average pain:' },
  { key: 'sleepQuality', text: '10. Sleep quality:' },
];

const SCALE = ['1', '2', '3', '4', '5'];

export default function PromisGlobalHealth({ values, setFieldValue }) {
  const p = values?.promisGlobalHealth || {};

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-text-primary">
          PROMIS GLOBAL Health
        </h3>
        <p className="text-sm text-blue-500 mt-1">
          (1 = Poor , 5 = Excellent)&nbsp;&nbsp;Please rate how you feel about
          your health
        </p>
      </div>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <div className="grid grid-cols-5 gap-2">
            {SCALE.map((val) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name={`promisGlobalHealth.${q.key}`}
                  value={val}
                  checked={p[q.key] === val}
                  onChange={() =>
                    setFieldValue(`promisGlobalHealth.${q.key}`, val)
                  }
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-text-primary">{val}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
