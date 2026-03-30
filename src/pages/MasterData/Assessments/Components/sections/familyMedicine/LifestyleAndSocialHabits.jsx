const SCALE = [
  { label: '0 Almost never', value: '0' },
  { label: '1 Sometimes', value: '1' },
  { label: '2 Almost always', value: '2' },
];

const SECTIONS = [
  {
    num: '1.',
    title: 'Family & Friends',
    questions: [
      { key: 'satisfiedRelationships', text: 'a) I am satisfied with my relationships.' },
      { key: 'someoneToConfide', text: 'b) I have someone I can confide in.' },
    ],
  },
  {
    num: '2.',
    title: 'Sleep, Stress and Relationships:',
    questions: [
      { key: 'qualitySleep', text: 'a) I get 7–9 hours of quality sleep.' },
      { key: 'stressLevel', text: 'b) How stressed have you felt in the past month?' },
      { key: 'stressReduction', text: 'c) I practice stress reduction and self-care.' },
      { key: 'mindfulness', text: 'd) I take time for mindfulness or reflection' },
      { key: 'feelSafe', text: 'e) I feel safe in relationships' },
      { key: 'satisfiedSexLife', text: 'f) I am satisfied with my sex life.' },
      {
        key: 'safeSex',
        text: 'g) I practice safe sex. (Monogamous, Condoms or barriers with partners who have not been tested)',
      },
    ],
  },
  {
    num: '3.',
    title: 'Insight & Career:',
    questions: [
      { key: 'lifePurpose', text: 'a) I feel my life has purpose.' },
      { key: 'workSatisfaction', text: 'b) I find satisfaction in my work' },
      { key: 'balanceWork', text: 'c) I balance work, family, and personal time' },
    ],
  },
];

export default function LifestyleAndSocialHabits({ values, setFieldValue }) {
  const ls = values?.lifestyleAndSocialHabits || {};

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-text-primary">
        Lifestyle and Social Habits (Modified FANTASTIC + Lifestyle Medicine)
      </h3>

      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-primary">
            {section.num} {section.title}
          </p>

          {section.questions.map((q) => (
            <div key={q.key} className="flex flex-col gap-2 pl-4">
              <p className="text-sm text-text-primary">{q.text}</p>
              <div className="grid grid-cols-3 gap-4">
                {SCALE.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name={`lifestyleAndSocialHabits.${q.key}`}
                      value={opt.value}
                      checked={ls[q.key] === opt.value}
                      onChange={() =>
                        setFieldValue(`lifestyleAndSocialHabits.${q.key}`, opt.value)
                      }
                      className="accent-primary w-4 h-4 shrink-0"
                    />
                    <span className="text-sm text-text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
