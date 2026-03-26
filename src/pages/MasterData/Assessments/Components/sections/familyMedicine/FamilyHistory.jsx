import Checkbox from "@/components/commonComponents/checkbox/Checkbox";

const CONDITIONS = [
  "Heart Disease",
  "High Blood Pressure",
  "Diabetes",
  "Cancer (Type)",
  "Mental Illness",
  "Substance Use",
  "Stroke/TIA",
  "Other",
];

const FAMILY_MEMBERS = ["Mother", "Father", "Sibling(s)", "Child(ren)", "Other"];

export default function FamilyHistory({ values, setFieldValue }) {
  const fh = values?.familyHistory || {};

  const handleToggle = (condition, member) => {
    const key = `familyHistory.${condition}.${member}`;
    const current = fh[condition]?.[member] || false;
    setFieldValue(key, !current);
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="border border-border rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-3 py-2 font-medium text-text-secondary min-w-[160px]">Condition</th>
              {FAMILY_MEMBERS.map((member) => (
                <th key={member} className="px-3 py-2 font-medium text-text-secondary text-center">
                  {member}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONDITIONS.map((condition) => (
              <tr key={condition} className="border-t border-border">
                <td className="px-3 py-2 font-medium text-text-primary">{condition}</td>
                {FAMILY_MEMBERS.map((member) => (
                  <td key={member} className="px-3 py-2 text-center">
                    <Checkbox
                      checked={!!fh[condition]?.[member]}
                      onChange={() => handleToggle(condition, member)}
                      variant="blue"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
