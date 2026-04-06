const OPTIONS = ['Yes', 'No', 'Already shut off'];

export default function Utilities({ values, handleChange }) {
  const u = values?.utilities || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Utilities</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. In the past 12 months has the electric, gas, oil, or water company
          threatened to shut off services in your home?
        </p>
        {OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="utilities.threatened"
              value={opt}
              checked={u.threatened === opt}
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
