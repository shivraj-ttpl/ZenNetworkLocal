import Input from "@/components/commonComponents/input/Input";

const QUESTIONS = [
  {
    key: "currentHousing",
    text: "1. Current housing",
    options: ["Have housing", "No housing", "Prefer not to answer"],
  },
  {
    key: "worriedHousing",
    text: "2. Worried about losing housing?",
    options: ["Yes", "No", "Prefer not to answer"],
  },
  {
    key: "lacked",
    text: "3. In past year, lacked",
    options: ["Food", "Utilities", "Clothing", "Childcare", "Medicine", "Phone", "Other", "None"],
    hasOtherInput: true,
    otherKey: "lackedOther",
  },
  {
    key: "transportation",
    text: "4. Transportation kept from work or healthcare?",
    options: ["Yes", "No", "Prefer not to answer"],
  },
  {
    key: "feelSafe",
    text: "5. Feel safe where you live?",
    options: ["Yes", "No", "Sometimes", "Prefer not to answer"],
  },
  {
    key: "talkToPeople",
    text: "6. How often do you talk to people you care about?",
    options: ["< 1/wk", "1-2x/wk", "3-5x/wk", "Nearly daily"],
  },
  {
    key: "workSituation",
    text: "7. Work situation",
    options: ["Full-time", "Part-time", "Unemployed (looking)", "Unemployed (not looking)", "Retired", "Unable to work"],
    subQuestion: {
      key: "workOutdoors",
      text: "Do you work outdoors?",
      options: ["Yes", "No"],
    },
  },
  {
    key: "education",
    text: "8. Education",
    options: ["< HS", "HS/GED", "Some college", "Bachelor's", "Graduate"],
  },
  {
    key: "householdIncome",
    text: "9. Household income",
    options: ["< $10k", "$10-19k", "$20-29k", "$30-49k", "≥ $50k", "Prefer not to answer"],
  },
  {
    key: "raceEthnicity",
    text: "10. Race/Ethnicity",
    options: ["Black", "White", "Hispanic", "Native American", "Asian", "Pacific Islander", "Other"],
  },
  {
    key: "language",
    text: "11. Language:",
    options: ["English", "Spanish", "Other"],
    hasOtherInput: true,
    otherKey: "languageOther",
  },
  {
    key: "urgentNeeds",
    text: "12. Urgent needs today?",
    options: ["Yes", "No"],
    hasConditionalInput: true,
    conditionalKey: "urgentNeedsDescribe",
    conditionalLabel: "If yes, describe",
    conditionalValue: "Yes",
  },
  {
    key: "internetAccess",
    text: "13. Do you have Internet access?",
    options: ["Yes", "No"],
  },
  {
    key: "smartPhone",
    text: "14. Do you have a Smart Phone?",
    options: ["Yes", "No"],
  },
  {
    key: "preferredContact",
    text: "15. Preferred Contact",
    options: ["Text Message", "Email Address", "Telephone Message"],
  },
  {
    key: "researchOpportunities",
    text: "16. If there are new programs or research opportunities to participate in would you like to hear about them?",
    options: ["Yes", "No"],
  },
  {
    key: "patientAdvisor",
    text: "17. Would you be interested in working part time as a patient advisor to help prioritize ideas to improve healthcare for your clinic and community?",
    options: ["Yes", "No"],
  },
  {
    key: "primaryCareProvider",
    text: "18. Do you have a regular Primary Care Provider you go to for care?",
    options: ["Yes", "No"],
    hasSubInputs: true,
  },
  {
    key: "wantHelp",
    text: "19. Want help meeting any of the above needs?",
    options: ["Yes", "No"],
  },
];

export default function SocialDeterminants({ values, handleChange, handleBlur }) {
  const sd = values?.socialDeterminants || {};

  return (
    <div className="flex flex-col gap-6">
      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">{q.text}</p>
          {q.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`socialDeterminants.${q.key}`}
                value={opt}
                checked={sd[q.key] === opt}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}

          {q.hasOtherInput && (
            <Input
              name={`socialDeterminants.${q.otherKey}`}
              value={sd[q.otherKey] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-[220px]"
            />
          )}

          {q.hasConditionalInput && sd[q.key] === q.conditionalValue && (
            <div className="flex flex-col gap-1 ml-4">
              <p className="text-sm text-text-secondary">{q.conditionalLabel}</p>
              <Input
                name={`socialDeterminants.${q.conditionalKey}`}
                value={sd[q.conditionalKey] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[220px]"
              />
            </div>
          )}

          {q.subQuestion && (
            <div className="flex flex-col gap-2 ml-4">
              <p className="text-sm font-medium text-text-primary">{q.subQuestion.text}</p>
              {q.subQuestion.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`socialDeterminants.${q.subQuestion.key}`}
                    value={opt}
                    checked={sd[q.subQuestion.key] === opt}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.hasSubInputs && (
            <div className="flex flex-col gap-4 ml-4 mt-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-text-primary">a. How long ago was your last Annual Wellness Visit</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="socialDeterminants.lastWellnessMonths"
                    placeholder="Months"
                    value={sd.lastWellnessMonths || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    name="socialDeterminants.lastWellnessYears"
                    placeholder="Years"
                    value={sd.lastWellnessYears || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <Input
                label="b. How many times have you been to the ER in the past year?"
                name="socialDeterminants.erVisits"
                value={sd.erVisits || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="c. How many times have you stayed overnight in the hospital in the past year"
                name="socialDeterminants.hospitalStays"
                value={sd.hospitalStays || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
