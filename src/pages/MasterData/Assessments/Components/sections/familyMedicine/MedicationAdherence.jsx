const ARMS_SCALE = [
  { label: 'None of the time (1)', value: '1' },
  { label: 'Some of the time (2)', value: '2' },
  { label: 'Most of the time (3)', value: '3' },
  { label: 'All of the time (4)', value: '4' },
];

const QUESTIONS = [
  { key: 'forgetMedicine', text: '1. How often do you forget to take your medicine?' },
  { key: 'decidedNotToTake', text: '2. How often do you decide not to take your medicine?' },
  { key: 'runOutOfMedicine', text: '3. How often do you run out of medicine?' },
  { key: 'forgetToGetPrescription', text: '4. How often do you forget to get your prescriptions filled?' },
  { key: 'skipBeforeDoctor', text: '5. How often do you miss taking your medicine before you go to the doctor?' },
  { key: 'stopWhenFeelBetter', text: '6. How often do you stop taking your medicine when you feel better?' },
  { key: 'stopWhenFeelWorse', text: '7. How often do you stop taking your medicine when you feel worse after taking it?' },
];

export default function MedicationAdherence({ values, setFieldValue }) {
  const ma = values?.medicationAdherence || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Medication Adherence & Access (ARMS-7)
      </h3>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{q.text}</p>
          <div className="grid grid-cols-4 gap-3">
            {ARMS_SCALE.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name={`medicationAdherence.${q.key}`}
                  value={opt.value}
                  checked={ma[q.key] === opt.value}
                  onChange={() => setFieldValue(`medicationAdherence.${q.key}`, opt.value)}
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
