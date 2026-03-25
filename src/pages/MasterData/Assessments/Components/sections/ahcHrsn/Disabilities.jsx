const YES_NO = ["Yes", "No"];

export default function Disabilities({ values, handleChange }) {
  const d = values?.disabilities || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Disabilities</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. Because of a physical, mental, or emotional condition, do you have serious
          difficulty concentrating, remembering, or making decisions? (5 years old or older)
        </p>
        {YES_NO.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="disabilities.difficultyConcentrating"
              value={opt}
              checked={d.difficultyConcentrating === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Because of a physical, mental, or emotional condition, do you have difficulty doing
          errands alone such as visiting a doctor&apos;s office or shopping? (15 years old or
          older)
        </p>
        {YES_NO.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="disabilities.difficultyErrands"
              value={opt}
              checked={d.difficultyErrands === opt}
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
