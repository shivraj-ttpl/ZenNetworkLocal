import Input from "@/components/commonComponents/input/Input";

const FREQUENCY_SCALE = ["Almost never", "Sometimes", "Almost always"];

const SECTIONS = [
  {
    title: "Family & Friends",
    questions: [
      { key: "satisfiedRelationships", text: "1. I am satisfied with my relationships." },
      { key: "someoneToConfide", text: "2. I have someone I can confide in." },
    ],
  },
  {
    title: "Sleep, Stress and Relationships",
    questions: [
      { key: "qualitySleep", text: "1. I get 7–9 hours of quality sleep." },
      { key: "stressLevel", text: "2. How stressed have you felt in the past month?" },
      { key: "stressReduction", text: "3. I practice stress reduction and self-care." },
      { key: "mindfulness", text: "4. I take time for mindfulness or reflection." },
      { key: "feelSafe", text: "5. I feel safe in relationships." },
      { key: "satisfiedSexLife", text: "6. I am satisfied with my sex life." },
      { key: "safeSex", text: "7. I practice safe sex. (Monogamous, Condoms or barriers with partners who have not been tested)." },
    ],
  },
  {
    title: "Insight & Career",
    questions: [
      { key: "lifePurpose", text: "1. I feel my life has purpose." },
      { key: "workSatisfaction", text: "2. I find satisfaction in my work." },
      { key: "balanceWork", text: "3. I balance work, family, and personal time." },
    ],
  },
];

const LIFESTYLE_INPUTS = [
  { key: "height", label: "Height", half: true },
  { key: "weight", label: "Weight", half: true },
  { key: "bmi", label: "BMI (calculated)", half: true },
  { key: "idealWeight", label: "What is your ideal weight?", half: true },
  { key: "caffeineDrinks", label: "Average number of Caffeine drinks/day" },
  { key: "sleepHours", label: "Average number of hours of sleep each night" },
  { key: "waterIntake", label: "Average water intake (cups/day)" },
  { key: "alcoholDrinks", label: "Average number of drinks with alcohol a day" },
  { key: "fruitsVegetables", label: "Average fruits and vegetable servings a day" },
  { key: "sugarRefinedFlour", label: "Average servings of food or drinks with sugar or refined flour a day" },
  { key: "processedFoods", label: "Average servings of processed or fast foods a day" },
  { key: "proteinGrams", label: "Average number of grams of protein a day" },
  { key: "cardioMinutes", label: "Average number of minutes of cardiovascular exercise each week." },
  { key: "strengthMinutes", label: "Average number of minutes of strength training exercise each week" },
  { key: "screenTime", label: "Daily screen time (hrs)" },
  { key: "mainStress", label: "Main source of stress" },
];

const YES_NO_QUESTIONS = [
  { key: "interestedCoaching", text: "Interested in Lifestyle/wellness coaching/nutrition/exercise program?" },
  { key: "interestedCounseling", text: "Interested in stress reduction counseling?" },
];

export default function LifestyleAndSocialHabits({ values, handleChange, handleBlur }) {
  const ls = values?.lifestyleAndSocialHabits || {};

  return (
    <div className="flex flex-col gap-6">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-5">
          <p className="text-sm font-semibold text-text-primary list-item ml-4">{section.title}</p>
          {section.questions.map((q) => (
            <div key={q.key} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-text-primary">{q.text}</p>
              {FREQUENCY_SCALE.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`lifestyleAndSocialHabits.${q.key}`}
                    value={opt}
                    checked={ls[q.key] === opt}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* Lifestyle Questions */}
      <p className="text-sm font-semibold text-text-primary list-item ml-4">Lifestyle Questions</p>

      {(() => {
        const rows = [];
        let i = 0;
        while (i < LIFESTYLE_INPUTS.length) {
          const item = LIFESTYLE_INPUTS[i];
          if (item.half && i + 1 < LIFESTYLE_INPUTS.length && LIFESTYLE_INPUTS[i + 1].half) {
            const next = LIFESTYLE_INPUTS[i + 1];
            rows.push(
              <div key={item.key} className="grid grid-cols-2 gap-4">
                <Input
                  label={item.label}
                  name={`lifestyleAndSocialHabits.${item.key}`}
                  value={ls[item.key] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Input
                  label={next.label}
                  name={`lifestyleAndSocialHabits.${next.key}`}
                  value={ls[next.key] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            );
            i += 2;
          } else {
            rows.push(
              <Input
                key={item.key}
                label={item.label}
                name={`lifestyleAndSocialHabits.${item.key}`}
                value={ls[item.key] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            );
            i += 1;
          }
        }
        return rows;
      })()}

      {/* Yes/No Questions */}
      {YES_NO_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`lifestyleAndSocialHabits.${q.key}`}
                value={opt}
                checked={ls[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
