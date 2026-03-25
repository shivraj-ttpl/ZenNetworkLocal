const FREQUENCY_OPTIONS = ["Often true", "Sometimes true", "Never true"];

export default function Food({ values, handleChange }) {
  const food = values?.food || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Food</h3>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. Within the past 12 months, you worried that your food would run out before you
          got money to buy more.
        </p>
        {FREQUENCY_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="food.worriedFoodRunOut"
              value={opt}
              checked={food.worriedFoodRunOut === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. Within the past 12 months, the food you bought just didn&apos;t last and you didn&apos;t
          have money to get more.
        </p>
        {FREQUENCY_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="food.foodDidntLast"
              value={opt}
              checked={food.foodDidntLast === opt}
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
