import Checkbox from '@/components/commonComponents/checkbox/Checkbox';

const VACCINES = [
  { key: 'flu', name: 'Flu' },
  { key: 'covid', name: 'COVID' },
  { key: 'tdapTd', name: 'Tdap/Td' },
  { key: 'pneumococcal', name: 'Pneumococcal' },
  { key: 'shingles', name: 'Shingles' },
  { key: 'hpv', name: 'HPV' },
  { key: 'hepatitis', name: 'Hepatitis A/B' },
  { key: 'mmr', name: 'MMR' },
  { key: 'varicella', name: 'Varicella' },
  { key: 'rsv', name: 'RSV' },
];

export default function Immunizations({ values, setFieldValue }) {
  const imm = values?.immunizations || {};

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-text-primary">
        Adult Immunizations
      </h3>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary w-8"></th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[160px]">
                Vaccine
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary text-center w-24">
                Received
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[180px]">
                Date
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary min-w-[200px]">
                Do not want/Why
              </th>
            </tr>
          </thead>
          <tbody>
            {VACCINES.map((vaccine, idx) => (
              <tr key={vaccine.key} className="border-t border-border">
                <td className="px-4 py-3 text-text-secondary">{idx + 1}.</td>
                <td className="px-4 py-3 text-text-primary font-medium">
                  {vaccine.name}
                </td>
                <td className="px-4 py-3 text-center">
                  <Checkbox
                    checked={!!imm[vaccine.key]?.received}
                    onChange={() =>
                      setFieldValue(
                        `immunizations.${vaccine.key}.received`,
                        !imm[vaccine.key]?.received,
                      )
                    }
                    variant="blue"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={imm[vaccine.key]?.dateReceived || ''}
                    onChange={(e) =>
                      setFieldValue(
                        `immunizations.${vaccine.key}.dateReceived`,
                        e.target.value,
                      )
                    }
                    className="h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 outline-none w-40"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="Enter"
                    value={imm[vaccine.key]?.doNotWantReason || ''}
                    onChange={(e) =>
                      setFieldValue(
                        `immunizations.${vaccine.key}.doNotWantReason`,
                        e.target.value,
                      )
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
