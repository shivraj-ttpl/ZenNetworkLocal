const HEALTH_SCALE = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const QUESTIONS = [
  { key: "generalHealth", text: "1. General health" },
  { key: "qualityOfLife", text: "2. Quality of life" },
  { key: "physicalHealth", text: "3. Physical health" },
  { key: "mentalHealth", text: "4. Mental health" },
  { key: "socialActivities", text: "5. Satisfaction with social relationships" },
  { key: "carryOutActivities", text: "6. Ability to carry out every day physical activities" },
  { key: "emotionalProblems", text: "7. Frequency of emotional problems" },
  { key: "fatigue", text: "8. Average fatigue" },
  { key: "pain", text: "9. Average pain" },
  { key: "sleepQuality", text: "10. Sleep quality" },
];

export default function PromisGlobalHealth({ values, handleChange }) {
  const p = values?.promisGlobalHealth || {};

  return (
    <div className="flex flex-col gap-6">
      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {HEALTH_SCALE.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`promisGlobalHealth.${q.key}`}
                value={opt}
                checked={p[q.key] === opt}
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
