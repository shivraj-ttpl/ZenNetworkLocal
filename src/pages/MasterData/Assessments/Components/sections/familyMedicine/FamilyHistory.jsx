import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';

const CONDITIONS = [
  { key: 'heartDisease', label: 'Heart disease' },
  { key: 'highBloodPressure', label: 'High blood pressure' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'cancerType', label: 'Cancer (type)' },
  { key: 'mentalIllness', label: 'Mental illness' },
  { key: 'substanceUse', label: 'Substance use' },
  { key: 'stroke', label: 'Stroke' },
  { key: 'otherType', label: 'Other (type)' },
];

const CHECKBOX_MEMBERS = ['Mother', 'Father', 'Sibling(s)', 'Child(ren)'];

export default function FamilyHistory({ values, setFieldValue }) {
  const fh = values?.familyHistory || {};

  const handleToggle = (conditionKey, member) => {
    const current = fh[conditionKey]?.[member] || false;
    setFieldValue(`familyHistory.${conditionKey}.${member}`, !current);
  };

  return (
    <div className="flex flex-col gap-0">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Family History
      </h3>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-3 text-left font-medium text-text-secondary w-48">
                Condition
              </th>
              {CHECKBOX_MEMBERS.map((m) => (
                <th
                  key={m}
                  className="py-2 px-3 text-center font-medium text-text-secondary"
                >
                  {m}
                </th>
              ))}
              <th className="py-2 px-3 text-left font-medium text-text-secondary">
                Other
              </th>
            </tr>
          </thead>
          <tbody>
            {CONDITIONS.map((condition, idx) => (
              <tr key={condition.key} className="border-b border-border">
                <td className="py-3 px-3 text-text-primary">
                  <span className="text-text-secondary mr-2">{idx + 1}.</span>
                  {condition.label}
                </td>
                {CHECKBOX_MEMBERS.map((member) => (
                  <td key={member} className="py-3 px-3 text-center">
                    <Checkbox
                      checked={!!fh[condition.key]?.[member]}
                      onChange={() => handleToggle(condition.key, member)}
                      variant="blue"
                    />
                  </td>
                ))}
                <td className="py-3 px-3">
                  <Input
                    name={`familyHistory.${condition.key}.otherText`}
                    placeholder="Enter"
                    value={fh[condition.key]?.otherText || ''}
                    onChange={(e) =>
                      setFieldValue(
                        `familyHistory.${condition.key}.otherText`,
                        e.target.value,
                      )
                    }
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
