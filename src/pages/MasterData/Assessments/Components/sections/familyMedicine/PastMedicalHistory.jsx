const CONDITIONS = [
  "Diabetes",
  "High Blood Pressure",
  "High Cholesterol",
  "Obesity/Overweight",
  "Heart Disease/Heart Failure",
  "Stroke/TIA",
  "Asthma",
  "COPD/Emphysema",
  "Chronic Kidney Disease",
  "Thyroid Disorder",
  "Cancer (Type)",
  "Depression",
  "Anxiety",
  "PTSD",
];

export default function PastMedicalHistory() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Condition</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Date First Diagnosed</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Notes</th>
            </tr>
          </thead>
          <tbody>
            {CONDITIONS.map((condition) => (
              <tr key={condition} className="border-t border-border">
                <td className="px-4 py-3 text-text-primary">{condition}</td>
                <td className="px-4 py-3 text-text-secondary">-</td>
                <td className="px-4 py-3 text-text-secondary">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
