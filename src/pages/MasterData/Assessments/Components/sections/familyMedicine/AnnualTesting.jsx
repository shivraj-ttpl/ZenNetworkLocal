const CORE_TESTS = [
  {
    key: 'bloodPressure',
    name: 'Blood pressure',
    frequency: 'Every visit or at least annually',
    purpose: 'Detects hypertension (heart and kidney risk)',
  },
  {
    key: 'bmiWaist',
    name: 'Body Mass Index (BMI) & waist circumference',
    frequency: 'Annually',
    purpose: 'Screens for obesity and metabolic risk',
  },
  {
    key: 'lipidPanel',
    name: 'Lipid panel (cholesterol, HDL, LDL, triglycerides)',
    frequency: 'Every 4–6 years for low-risk adults; annually if high-risk',
    purpose: 'Detects cardiovascular disease risk',
  },
  {
    key: 'fastingGlucose',
    name: 'Fasting glucose or A1c',
    frequency: 'Every 3 years starting at 35; annually if high-risk',
    purpose: 'Screens for diabetes or prediabetes',
  },
  {
    key: 'cmp',
    name: 'Comprehensive metabolic panel (CMP)',
    frequency: 'Annually or as indicated',
    purpose: 'Checks liver, kidney function, and electrolytes',
  },
  {
    key: 'cbc',
    name: 'Complete blood count (CBC)',
    frequency: 'Annually or as indicated',
    purpose: 'Detects anemia, infection, or blood disorders',
  },
  {
    key: 'tsh',
    name: 'Thyroid-stimulating hormone (TSH)',
    frequency: 'Every 3–5 years; more often if symptomatic',
    purpose: 'Screens for thyroid dysfunction',
  },
  {
    key: 'depression',
    name: 'Depression screening (PHQ-9)',
    frequency: 'Annually',
    purpose: 'Detects depression and suicidality',
  },
  {
    key: 'substanceUse',
    name: 'Alcohol, tobacco, and substance use screening',
    frequency: 'Annually',
    purpose: 'Supports behavioral counseling and risk reduction',
  },
  {
    key: 'immunizationReview',
    name: 'Immunization review',
    frequency: 'Annually',
    purpose: 'Ensures up-to-date vaccines (flu, COVID-19, Tdap, shingles, etc.)',
  },
  {
    key: 'hepatitisC',
    name: 'Hepatitis C',
    frequency: 'Once for all adults 18–79; repeat if risk',
    purpose: 'Detects chronic hepatitis C infection',
  },
  {
    key: 'hiv',
    name: 'HIV',
    frequency: 'At least once; more often if at risk',
    purpose: 'Detects HIV infection',
  },
  {
    key: 'stis',
    name: 'STIs (chlamydia, gonorrhea, syphilis)',
    frequency: 'Annually if sexually active with new/multiple partners',
    purpose: 'Detects sexually transmitted infections',
  },
  {
    key: 'skinExam',
    name: 'Skin exam',
    frequency: 'Annually',
    purpose: 'Screens for skin cancers',
  },
  {
    key: 'visionExam',
    name: 'Vision exam',
    frequency: 'Annually',
    purpose: 'Detects vision loss and eye disease',
  },
  {
    key: 'dentalExam',
    name: 'Dental exam',
    frequency: 'Annually',
    purpose: 'Prevents oral disease and detects early pathology',
  },
];

const SEX_SPECIFIC_TESTS = [
  {
    key: 'boneDensity',
    name: 'Women: Bone density (DEXA)',
    frequency: 'Starting at 65 or earlier if risk factors',
    purpose: 'Screens for osteoporosis',
  },
  {
    key: 'aaa',
    name: 'Men: Abdominal aortic aneurysm (AAA)',
    frequency: 'One-time screen (65–75 ever-smokers)',
    purpose: 'Detects aneurysm risk',
  },
  {
    key: 'mammogram',
    name: 'Women: Mammogram',
    frequency: 'Every 1–2 years starting at 40',
    purpose: 'Screens for breast cancer',
  },
  {
    key: 'cervicalCancer',
    name: 'Women: Cervical cancer screening (Pap/HPV)',
    frequency: 'Every 3–5 years starting at 21',
    purpose: 'Screens for cervical cancer',
  },
  {
    key: 'prostate',
    name: 'Men: Prostate cancer (PSA)',
    frequency: 'Discussion at 50+; earlier if high risk',
    purpose: 'Screens for prostate cancer',
  },
];

function TestRow({ testKey, name, frequency, purpose, value, onChange, index }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2.5 text-text-secondary text-sm w-8">{index}.</td>
      <td className="px-4 py-2.5 text-text-primary text-sm min-w-[200px]">{name}</td>
      <td className="px-4 py-2.5 text-text-secondary text-sm min-w-[180px]">{frequency}</td>
      <td className="px-4 py-2.5 text-text-secondary text-sm min-w-[180px]">{purpose}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-4">
          {['Yes', 'No', 'Today'].map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name={`annualTesting.tests.${testKey}`}
                value={opt.toLowerCase()}
                checked={value === opt.toLowerCase()}
                onChange={() => onChange(opt.toLowerCase())}
                className="accent-primary w-4 h-4 shrink-0"
              />
              <span className="text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
      </td>
    </tr>
  );
}

function SectionTable({ label, tests, values, onTestChange }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden mt-4">
      <div className="px-4 py-3 bg-white">
        <span className="text-sm font-medium text-primary">{label}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-50 text-left border-t border-border">
            <th className="px-4 py-2.5 w-8"></th>
            <th className="px-4 py-2.5 font-medium text-text-secondary">Test / Screening</th>
            <th className="px-4 py-2.5 font-medium text-text-secondary">Typical Frequency</th>
            <th className="px-4 py-2.5 font-medium text-text-secondary">Purpose column</th>
            <th className="px-4 py-2.5 font-medium text-text-secondary">Completed in Last year?</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, idx) => (
            <TestRow
              key={test.key}
              testKey={test.key}
              name={test.name}
              frequency={test.frequency}
              purpose={test.purpose}
              value={values?.tests?.[test.key] || ''}
              onChange={(val) => onTestChange(test.key, val)}
              index={idx + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AnnualTesting({ values, handleChange, handleBlur, setFieldValue }) {
  const a = values?.annualTesting || {};

  const handleTestChange = (key, val) => {
    setFieldValue(`annualTesting.tests.${key}`, val);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Q1 */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-text-primary">
          1. Have you had all the below recommended screening tests within the past year?
        </p>
        <div className="flex items-center gap-8">
          {['Yes', 'No'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="annualTesting.allScreeningsDone"
                value={opt.toLowerCase()}
                checked={a.allScreeningsDone === opt.toLowerCase()}
                onChange={() => setFieldValue('annualTesting.allScreeningsDone', opt.toLowerCase())}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
        <input
          type="date"
          name="annualTesting.allScreeningsDate"
          value={a.allScreeningsDate || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-10 px-4 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 outline-none max-w-xs"
        />
      </div>

      {/* Outer column labels */}
      <div className="grid grid-cols-3 px-1">
        <span className="text-sm font-medium text-text-secondary">Screening</span>
        <span className="text-sm font-medium text-text-secondary">Date</span>
        <span className="text-sm font-medium text-text-secondary">Result/Findings</span>
      </div>

      {/* Core section */}
      <SectionTable
        label="Core Annual Recommended Tests and Screenings (All Adults)"
        tests={CORE_TESTS}
        values={a}
        onTestChange={handleTestChange}
      />

      {/* Sex-Specific section */}
      <SectionTable
        label="Sex-Specific and Risk-Based Screenings"
        tests={SEX_SPECIFIC_TESTS}
        values={a}
        onTestChange={handleTestChange}
      />
    </div>
  );
}
