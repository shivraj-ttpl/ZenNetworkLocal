const PHQ_OPTIONS = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
const STRESS_OPTIONS = ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"];

export default function MentalHealth({ values, handleChange }) {
  const mh = values?.mentalHealth || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Mental Health</h3>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-primary">
          1. Over the past 2 weeks, how often have you been bothered by any of the following
          problems?
        </p>

        <div className="flex flex-col gap-2 ml-4">
          <p className="text-sm font-medium text-text-primary">
            &bull; Little interest or pleasure in doing things?
          </p>
          {PHQ_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mentalHealth.littleInterest"
                value={opt}
                checked={mh.littleInterest === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <p className="text-sm font-medium text-text-primary">
            &bull; Feeling down, depressed, or hopeless?
          </p>
          {PHQ_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mentalHealth.feelingDown"
                value={opt}
                checked={mh.feelingDown === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Stress means a situation in which a person feels tense, restless, nervous, or
          anxious, or is unable to sleep at night because his or her mind is troubled all the
          time. Do you feel this kind of stress these days?
        </p>
        {STRESS_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mentalHealth.stress"
              value={opt}
              checked={mh.stress === opt}
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
