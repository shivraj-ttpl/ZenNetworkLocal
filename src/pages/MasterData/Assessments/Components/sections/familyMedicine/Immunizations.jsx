import Checkbox from "@/components/commonComponents/checkbox/Checkbox";

const VACCINES = [
  { name: "Flu/COVID", criteria: "Annually" },
  { name: "COVID", criteria: "Annually" },
  { name: "Tdap/Td", criteria: "1 adult dose then q10 yrs" },
  { name: "COVID - 19", criteria: "All adults ≥12 yrs" },
  { name: "Pneumococcal", criteria: "≥65 yrs or 19–64 w/ chronic illness" },
  { name: "Shingles", criteria: "≥50 yrs or ≥19 immunocompromised" },
  { name: "HPV", criteria: "≤26 yrs or 27–45 shared" },
  { name: "Hepatitis A/B", criteria: "At-risk or ≤59 yrs (Hep B)" },
  { name: "MMR", criteria: "Born ≥1957 w/o immunity" },
  { name: "Varicella", criteria: "No prior infection/vaccine" },
  { name: "RSV", criteria: "≥60 yrs shared decision or pregnancy 32–36 wks" },
];

export default function Immunizations({ values, setFieldValue }) {
  const imm = values?.immunizations || {};

  const handleToggle = (vaccine, field) => {
    const key = `immunizations.${vaccine}.${field}`;
    const current = imm[vaccine]?.[field] || false;
    setFieldValue(key, !current);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[120px]">Vaccine</th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[200px]">Recommended Age/ Criteria</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-center">Received</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-center">Date Received</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-center">Do not want/Why?</th>
            </tr>
          </thead>
          <tbody>
            {VACCINES.map((vaccine) => (
              <tr key={vaccine.name} className="border-t border-border">
                <td className="px-4 py-3 text-text-primary font-medium">{vaccine.name}</td>
                <td className="px-4 py-3 text-text-primary">{vaccine.criteria}</td>
                <td className="px-4 py-3 text-center">
                  <Checkbox
                    checked={!!imm[vaccine.name]?.received}
                    onChange={() => handleToggle(vaccine.name, "received")}
                    variant="teal"
                  />
                </td>
                <td className="px-4 py-3 text-center text-text-secondary">-</td>
                <td className="px-4 py-3 text-center">
                  <Checkbox
                    checked={!!imm[vaccine.name]?.doNotWant}
                    onChange={() => handleToggle(vaccine.name, "doNotWant")}
                    variant="teal"
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
