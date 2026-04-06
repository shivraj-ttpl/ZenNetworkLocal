const OPTIONS = [
  'Yes, help finding work',
  'Yes, help keeping work',
  'I do not need or want help',
];

export default function Employment({ values, handleChange }) {
  const e = values?.employment || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Employment</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. Do you want help finding or keeping work or a job?
        </p>
        {OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="employment.helpWithWork"
              value={opt}
              checked={e.helpWithWork === opt}
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
