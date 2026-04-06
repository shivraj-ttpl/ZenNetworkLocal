const OPTIONS = ['Very hard', 'Somewhat hard', 'Not hard at all'];

export default function FinancialStrain({ values, handleChange }) {
  const fs = values?.financialStrain || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">
        Financial Strain
      </h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. How hard is it for you to pay for the very basics like food,
          housing, medical care, and heating? Would you say it is:
        </p>
        {OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="financialStrain.payForBasics"
              value={opt}
              checked={fs.payForBasics === opt}
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
