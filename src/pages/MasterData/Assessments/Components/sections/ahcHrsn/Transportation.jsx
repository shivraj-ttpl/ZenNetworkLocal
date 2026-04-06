const YES_NO = ['Yes', 'No'];

export default function Transportation({ values, handleChange }) {
  const t = values?.transportation || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Transportation
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. In the past 12 months, has lack of reliable transportation kept you
          from medical appointments, meetings, work or from getting things
          needed for daily living?
        </p>
        {YES_NO.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="transportation.lackOfTransportation"
              value={opt}
              checked={t.lackOfTransportation === opt}
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
