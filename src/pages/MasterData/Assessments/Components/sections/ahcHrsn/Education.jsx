const YES_NO = ['Yes', 'No'];

export default function Education({ values, handleChange }) {
  const edu = values?.education || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Education</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. Do you speak a language other than English at home?
        </p>
        {YES_NO.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="education.otherLanguage"
              value={opt}
              checked={edu.otherLanguage === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Do you want help with school or training? For example, starting or
          completing job training or getting a high school diploma, GED or
          equivalent.
        </p>
        {YES_NO.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="education.helpWithSchool"
              value={opt}
              checked={edu.helpWithSchool === opt}
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
