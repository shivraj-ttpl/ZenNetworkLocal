import Input from "@/components/commonComponents/input/Input";

const PHQ9_SCALE = ["Not at all", "Several Days", "Half the Days", "Nearly Every Day"];

const PHQ9_QUESTIONS = [
  { key: "littleInterest", text: "1. Little interest or pleasure in doing things you used to enjoy" },
  { key: "feelingDown", text: "2. Feeling down, depressed, or hopeless" },
  { key: "troubleSleeping", text: "3. Trouble sleeping or sleeping too much" },
  { key: "feelingTired", text: "4. Feeling tired or having little energy" },
  { key: "poorAppetite", text: "5. Poor appetite or overeating" },
  { key: "feelingBad", text: "6. Feeling bad about yourself or that you are a failure" },
  { key: "troubleConcentrating", text: "7. Trouble concentrating on things" },
  { key: "movingSlow", text: "8. Moving/speaking slowly or being fidgety" },
  { key: "selfHarm", text: "9. Thoughts of being better off dead or self-harm" },
];

const GAD7_SCALE = ["Not at all", "Several Days", "Half the Days", "Nearly Every Day"];

const GAD7_QUESTIONS = [
  { key: "nervousAnxious", text: "1. Feeling nervous or anxious" },
  { key: "unableToControlWorrying", text: "2. Unable to control worrying" },
  { key: "worryingTooMuch", text: "3. Worrying too much about things" },
  { key: "troubleRelaxing", text: "4. Trouble relaxing" },
  { key: "beingRestless", text: "5. Being restless" },
  { key: "easilyAnnoyed", text: "6. Easily annoyed or irritable" },
  { key: "feelingAfraid", text: "7. Feeling afraid something awful might happen" },
];

const SUICIDE_QUESTIONS = [
  { key: "wishedDead", text: "1. Wished you were dead or could go to sleep and not wake up?" },
  { key: "thoughtsKilling", text: "2. Had thoughts of killing yourself?" },
  { key: "thoughtHow", text: "3. Thought about how you might do this?" },
  { key: "intentionToAct", text: "4. Had intention to act on these thoughts?" },
  { key: "startedToPrepare", text: "5. Started to prepare or take steps to end your life?" },
];

export default function EmotionalMentalHealth({ values, handleChange, handleBlur }) {
  const emh = values?.emotionalMentalHealth || {};

  return (
    <div className="flex flex-col gap-6">
      {/* PHQ-9 Depression */}
      <p className="text-sm font-semibold text-text-primary list-item ml-4">PHQ-9 – Depression</p>

      {PHQ9_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {PHQ9_SCALE.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`emotionalMentalHealth.${q.key}`}
                value={opt}
                checked={emh[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-1 border-l-4 border-border pl-4">
        <Input
          label="Total PHQ-9 Score"
          name="emotionalMentalHealth.phq9Score"
          value={emh.phq9Score || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="text-xs text-text-secondary">
          Severity: 0-4=Minimal, 5-9=Mild 10-14=Moderate, 15-19=Mod Severe, 20-27=Severe.
        </p>
      </div>

      {/* GAD-7 Anxiety */}
      <p className="text-sm font-semibold text-text-primary list-item ml-4">GAD-7 – Anxiety</p>

      {GAD7_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {GAD7_SCALE.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`emotionalMentalHealth.${q.key}`}
                value={opt}
                checked={emh[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-1 border-l-4 border-border pl-4">
        <Input
          label="Total GAD-7 Score"
          name="emotionalMentalHealth.gad7Score"
          value={emh.gad7Score || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="text-xs text-text-secondary">
          Severity: 0-4=Minimal, 5-9=Mild 10-14=Moderate, 15-21=Severe.
        </p>
      </div>

      {/* Columbia Suicide Severity */}
      <p className="text-sm font-semibold text-text-primary list-item ml-4">Columbia Suicide Severity (Past Month)</p>

      {SUICIDE_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`emotionalMentalHealth.${q.key}`}
                value={opt}
                checked={emh[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <p className="text-sm font-semibold ">
        If YES to any, immediate clinical assessment required. Call the suicide hotline at 988 or text 988lifeline.org
      </p>
    </div>
  );
}
