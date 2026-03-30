const SCREENINGS = [
  { key: "breast", name: "Breast (Mammogram)" },
  { key: "cervical", name: "Cervical (Pap/HPV)" },
  { key: "colorectal", name: "Colorectal (FIT/Colonoscopy)" },
  { key: "lung", name: "Lung (LDCT)" },
  { key: "prostate", name: "Prostate (PSA)" },
  { key: "skin", name: "Skin" },
  { key: "other", name: "Other" },
];

export default function CancerScreeningSummary({ values, setFieldValue }) {
  const cs = values?.cancerScreenings || {};

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-text-primary">Cancer Screening Summary</h3>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary w-8"></th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[200px]">Screening</th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[180px]">Date</th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[220px]">Result/Findings</th>
            </tr>
          </thead>
          <tbody>
            {SCREENINGS.map((screening, idx) => (
              <tr key={screening.key} className="border-t border-border">
                <td className="px-4 py-3 text-text-secondary">{idx + 1}.</td>
                <td className="px-4 py-3 text-text-primary font-medium">{screening.name}</td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={cs[screening.key]?.date || ""}
                    onChange={(e) =>
                      setFieldValue(`cancerScreenings.${screening.key}.date`, e.target.value)
                    }
                    className="h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 outline-none w-40"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="Enter"
                    value={cs[screening.key]?.findings || ""}
                    onChange={(e) =>
                      setFieldValue(`cancerScreenings.${screening.key}.findings`, e.target.value)
                    }
                    className="h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 placeholder-neutral-400 outline-none w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
