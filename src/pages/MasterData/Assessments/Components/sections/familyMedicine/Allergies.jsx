const PLACEHOLDER_ROWS = [1, 2, 3];

export default function Allergies() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Allergen</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Reaction</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Severity (Mild/Mod/Severe)</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Date First Noted</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_ROWS.map((row) => (
              <tr key={row} className="border-t border-border">
                <td className="px-4 py-3 text-text-secondary">-</td>
                <td className="px-4 py-3 text-text-secondary">-</td>
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
