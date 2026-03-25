import Input from "@/components/commonComponents/input/Input";

const FREQUENCY_OPTIONS = ["Never", "Once or twice", "Monthly", "Weekly", "Daily or almost daily"];

const QUESTIONS = [
  {
    key: "tobacco",
    text: "1. In the past year, how many times have you used tobacco products (cigarettes, cigars, pipes, vaping, snuff, chew)?",
  },
  {
    key: "alcohol",
    text: "2. In the past year, how many times have you had 5 (men) or 4 (women) or more drinks containing alcohol in one day?",
  },
  {
    key: "prescriptionDrugs",
    text: "3. In the past year, how many times have you used a prescription medication (e.g., opioids, benzodiazepines, stimulants) for reasons other than prescribed?",
  },
  {
    key: "illegalDrugs",
    text: "4. In the past year, how many times have you used illegal drugs (e.g., marijuana, cocaine, heroin, methamphetamine, ecstasy, hallucinogens)?",
  },
];

export default function SubstanceUseNida({ values, handleChange, handleBlur }) {
  const su = values?.substanceUseNida || {};

  return (
    <div className="flex flex-col gap-6">
      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {FREQUENCY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`substanceUseNida.${q.key}`}
                value={opt}
                checked={su[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
          <Input
            name={`substanceUseNida.${q.key}Years`}
            placeholder="How many years?"
            value={su[`${q.key}Years`] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-[220px]"
          />
        </div>
      ))}
    </div>
  );
}
