const SCREENINGS = [
  { name: "Breast (Mammogram)", criteria: "Women 40-74 q2y" },
  { name: "Cervical (Pap/HPV)", criteria: "Women 21-65 per" },
  { name: "Colorectal (FIT/Colonoscopy)", criteria: "Adults 45-75" },
  { name: "Lung (LDCT)", criteria: "50-80 ≥20 pack-yrs quit &15 y..." },
  { name: "Prostate (PSA)", criteria: "Men 50–69 shared decision" },
  { name: "Skin", criteria: "All adults visual exam/counseli..." },
  { name: "Other", criteria: "As indicated" },
];

export default function CancerScreeningSummary() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[180px]">Screening</th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[200px]">Criteria</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Last Received</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Result/Findings</th>
            </tr>
          </thead>
          <tbody>
            {SCREENINGS.map((screening) => (
              <tr key={screening.name} className="border-t border-border">
                <td className="px-4 py-3 text-text-primary font-medium">{screening.name}</td>
                <td className="px-4 py-3 text-text-primary">{screening.criteria}</td>
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
