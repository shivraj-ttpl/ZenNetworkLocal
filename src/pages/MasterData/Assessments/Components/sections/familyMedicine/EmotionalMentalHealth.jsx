const SCALE_0_3 = [
  { label: '(0)', value: '0' },
  { label: '(1)', value: '1' },
  { label: '(2)', value: '2' },
  { label: '(3)', value: '3' },
];

const YES_NO = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const PHQ9_QUESTIONS = [
  { key: 'littleInterest', text: '1. Little interest or pleasure in doing things you used to enjoy' },
  { key: 'feelingDown', text: '2. Feeling down, depressed, or hopeless' },
  { key: 'troubleSleeping', text: '3. Trouble sleeping or sleeping too much' },
  { key: 'feelingTired', text: '4. Feeling tired or having little energy' },
  { key: 'poorAppetite', text: '5. Poor appetite or overeating' },
  { key: 'feelingBad', text: '6. Feeling bad about yourself or that you are a failure' },
  { key: 'troubleConcentrating', text: '7. Trouble concentrating on things' },
  { key: 'movingSlow', text: '8. Moving/speaking slowly or being fidgety' },
  { key: 'selfHarm', text: '9. Thoughts of being better off dead or self-harm' },
];

const GAD7_QUESTIONS = [
  { key: 'nervousAnxious', text: '1. Feeling nervous or anxious' },
  { key: 'unableToControlWorrying', text: '2. Unable to control worrying' },
  { key: 'worryingTooMuch', text: '3. Worrying too much about things' },
  { key: 'troubleRelaxing', text: '4. Trouble relaxing' },
  { key: 'beingRestless', text: '5. Being restless' },
  { key: 'easilyAnnoyed', text: '6. Easily annoyed or irritable' },
  { key: 'feelingAfraid', text: '7. Feeling afraid something awful might happen' },
];

const SUICIDE_QUESTIONS = [
  { key: 'wishedDead', text: '1. Wished you were dead or could go to sleep and not wake up?' },
  { key: 'thoughtsKilling', text: '2. Had thoughts of killing yourself?' },
  { key: 'thoughtHow', text: '3. Thought about how you might do this?' },
  { key: 'intentionToAct', text: '4. Had intention to act on these thoughts?' },
  { key: 'startedToPrepare', text: '5. Started to prepare or take steps to end your life?' },
];

function RadioScale({ name, value, options, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary w-4 h-4 shrink-0"
          />
          <span className="text-sm text-text-primary">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function ScoreBar({ label, scoreKey, severityKey, scaleText, values, handleChange, handleBlur }) {
  return (
    <div className="bg-neutral-50 rounded-lg px-4 py-3 flex flex-wrap items-center gap-3 mt-2">
      <span className="text-sm text-text-primary font-medium whitespace-nowrap">{label}</span>
      <input
        name={scoreKey}
        placeholder="00"
        value={values[scoreKey] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-16 h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 outline-none"
      />
      <span className="text-sm text-text-primary font-medium">Severity:</span>
      <input
        name={severityKey}
        placeholder="e.g Mild"
        value={values[severityKey] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-28 h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 outline-none"
      />
      <span className="text-xs text-text-secondary flex-1">{scaleText}</span>
      <button
        type="button"
        className="h-9 px-5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shrink-0"
      >
        Save
      </button>
    </div>
  );
}

export default function EmotionalMentalHealth({ values, handleBlur, setFieldValue }) {
  const emh = values?.emotionalMentalHealth || {};

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-text-primary">
        Emotional and Mental Health (Validated)
      </h3>

      {/* ─── PHQ-9 ─── */}
      <p className="text-sm text-blue-500 font-medium">
        PHQ-9 – Depression Scale (0 = Not at all, 1 = Several days, 2 = &gt;Half the days, 3 = Nearly every day)
      </p>

      {PHQ9_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <RadioScale
            name={`emotionalMentalHealth.${q.key}`}
            value={emh[q.key] || ''}
            options={SCALE_0_3}
            onChange={(val) => setFieldValue(`emotionalMentalHealth.${q.key}`, val)}
          />
        </div>
      ))}

      <ScoreBar
        label="Total PHQ-9 Score:"
        scoreKey="phq9Score"
        severityKey="phq9Severity"
        scaleText="(0-4=Minimal  5-9=Mild  10-14=Moderate  15-19=Mod Severe  20-27=Severe)"
        values={emh}
        handleChange={(e) =>
          setFieldValue(`emotionalMentalHealth.${e.target.name}`, e.target.value)
        }
        handleBlur={handleBlur}
      />

      {/* ─── GAD-7 ─── */}
      <p className="text-sm text-blue-500 font-medium mt-2">
        GAD-7 – Anxiety Scale (0 = Not at all, 1 = Several days, 2 = &gt;Half the days, 3 = Nearly every day)
      </p>

      {GAD7_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <RadioScale
            name={`emotionalMentalHealth.${q.key}`}
            value={emh[q.key] || ''}
            options={SCALE_0_3}
            onChange={(val) => setFieldValue(`emotionalMentalHealth.${q.key}`, val)}
          />
        </div>
      ))}

      <ScoreBar
        label="Total GAD-7 Score:"
        scoreKey="gad7Score"
        severityKey="gad7Severity"
        scaleText="(0-4=Minimal  5-9=Mild  10-14=Moderate  15-21=Severe)"
        values={emh}
        handleChange={(e) =>
          setFieldValue(`emotionalMentalHealth.${e.target.name}`, e.target.value)
        }
        handleBlur={handleBlur}
      />

      {/* ─── C-SSRS ─── */}
      <p className="text-sm text-blue-500 font-medium mt-2">
        Columbia Suicide Severity Rating Scale (C-SSRS – Brief Screener) (Past Month)
      </p>

      {SUICIDE_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <div className="flex items-center gap-6">
            {YES_NO.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name={`emotionalMentalHealth.${q.key}`}
                  value={opt.value}
                  checked={emh[q.key] === opt.value}
                  onChange={() => setFieldValue(`emotionalMentalHealth.${q.key}`, opt.value)}
                  className="accent-primary w-4 h-4"
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
