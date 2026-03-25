const ARMS_SCALE = ["None of the time", "Some of the time", "Most of the time", "All of the time"];

const QUESTIONS = [
  { key: "forgetMedicine", text: "1. How often do you forget to take your medicine?" },
  { key: "decidedNotToTake", text: "2. How often do you decide not to take your medicine?" },
  { key: "runOutOfMedicine", text: "3. How often do you run out of medicine?" },
  { key: "forgetToGetPrescription", text: "4. How often do you forget to get your prescriptions filled?" },
  { key: "skipBeforeDoctor", text: "5. How often do you miss taking your medicine before you go to the doctor?" },
  { key: "stopWhenFeelBetter", text: "6. How often do you stop taking your medicine when you feel better?" },
  { key: "stopWhenFeelWorse", text: "7. How often do you stop taking your medicine when you feel worse after taking it?" },
];

export default function MedicationAdherence({ values, handleChange }) {
  const ma = values?.medicationAdherence || {};

  return (
    <div className="flex flex-col gap-6">

      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {ARMS_SCALE.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`medicationAdherence.${q.key}`}
                value={opt}
                checked={ma[q.key] === opt}
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
