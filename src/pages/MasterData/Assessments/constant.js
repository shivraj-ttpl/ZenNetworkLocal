// ─── PRAPARE Assessment Steps ───
export const PRAPARE_STEPS = [
  { id: 1, label: "Personal Characteristics" },
  { id: 2, label: "Family & Home" },
  { id: 3, label: "Money & Resources" },
  { id: 4, label: "Social and Emotional Health" },
  { id: 5, label: "Optional Additional Questions" },
];

// ─── AHC HRSN Screening Steps ───
export const AHC_HRSN_STEPS = [
  { id: 1, label: "Living Situation" },
  { id: 2, label: "Food" },
  { id: 3, label: "Transportation" },
  { id: 4, label: "Utilities" },
  { id: 5, label: "Safety" },
  { id: 6, label: "Financial Strain" },
  { id: 7, label: "Employment" },
  { id: 8, label: "Family and Community Support" },
  { id: 9, label: "Education" },
  { id: 10, label: "Physical Activity" },
  { id: 11, label: "Substance Use" },
  { id: 12, label: "Mental Health" },
  { id: 13, label: "Disabilities" },
];

// ─── Family Medicine Intake Steps ───
export const FAMILY_MEDICINE_STEPS = [
  { id: 1, label: "Demographics" },
  { id: 2, label: "Reason for Visit & Health Goals" },
  { id: 3, label: "PROMIS GLOBAL Health, Please rate how you feel about your health." },
  { id: 4, label: "Medications" },
  { id: 5, label: "Medication Adherence & Access (ARMS-7)" },
  { id: 6, label: "Allergies" },
  { id: 7, label: "Past Medical History" },
  { id: 8, label: "Family History" },
  { id: 9, label: "Lifestyle and Social Habits (Modified FANTASTIC + Lifestyle Medicine)" },
  { id: 10, label: "Substance Use (NIDA Quick Screen)" },
  { id: 11, label: "Emotional and Mental Health (Validated)" },
  { id: 12, label: "Social Determinants of Health (PRAPARE)" },
  { id: 13, label: "Immunizations" },
  { id: 14, label: "Cancer Screening" },
  { id: 15, label: "Signatures" },
];

// ─── Step config map by assessment name ───
export const ASSESSMENT_STEPS_MAP = {
  PRAPARE: PRAPARE_STEPS,
  "AHC HRSN Screening": AHC_HRSN_STEPS,
  "Family Medicine Intake and Annual Form": FAMILY_MEDICINE_STEPS,
};

// ─── Shared option arrays ───
export const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "Chinese", value: "chinese" },
  { label: "French", value: "french" },
  { label: "Vietnamese", value: "vietnamese" },
  { label: "Other", value: "other" },
];

export const RACE_OPTIONS = [
  { label: "Asian", value: "asian" },
  { label: "Black/African American", value: "black" },
  { label: "Native Hawaiian", value: "nativeHawaiian" },
  { label: "White", value: "white" },
  { label: "American Indian/Alaska Native", value: "americanIndian" },
  { label: "Hispanic/Latino", value: "hispanicLatino" },
  { label: "Other", value: "other" },
];

export const ETHNICITY_OPTIONS = [
  { label: "Hispanic or Latino", value: "hispanicLatino" },
  { label: "Not Hispanic or Latino", value: "notHispanicLatino" },
  { label: "I choose not to answer this question", value: "chooseNotToAnswer" },
];

export const COUNTRY_OPTIONS = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Mexico", value: "MX" },
];

export const STATE_OPTIONS = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "New York", value: "NY" },
  { label: "Florida", value: "FL" },
];

export const INCOME_OPTIONS = [
  { label: "Less than $10,000", value: "lt10k" },
  { label: "$10,001 - $20,000", value: "10k-20k" },
  { label: "$20,001 - $40,000", value: "20k-40k" },
  { label: "$40,001 - $75,000", value: "40k-75k" },
  { label: "More than $75,000", value: "gt75k" },
  { label: "I choose not to answer this question", value: "chooseNotToAnswer" },
];
