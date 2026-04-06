// ─── PRAPARE Assessment Steps ───
export const PRAPARE_STEPS = [
  { id: 1, label: 'Personal Characteristics' },
  { id: 2, label: 'Family & Home' },
  { id: 3, label: 'Money & Resources' },
  { id: 4, label: 'Social and Emotional Health' },
  { id: 5, label: 'Optional Additional Questions' },
];

// ─── AHC HRSN Screening Steps ───
export const AHC_HRSN_STEPS = [
  { id: 1, label: 'Living Situation' },
  { id: 2, label: 'Food' },
  { id: 3, label: 'Transportation' },
  { id: 4, label: 'Utilities' },
  { id: 5, label: 'Safety' },
  { id: 6, label: 'Financial Strain' },
  { id: 7, label: 'Employment' },
  { id: 8, label: 'Family and Community Support' },
  { id: 9, label: 'Education' },
  { id: 10, label: 'Physical Activity' },
  { id: 11, label: 'Substance Use' },
  { id: 12, label: 'Mental Health' },
  { id: 13, label: 'Disabilities' },
];

// ─── Family Medicine Intake Steps (19 steps) ───
export const FAMILY_MEDICINE_STEPS = [
  { id: 1, label: 'Demographics and Contact Information' },
  { id: 2, label: 'Reason for Visit & Health Goals' },
  { id: 3, label: 'Health Care Access' },
  { id: 4, label: 'PROMIS GLOBAL Health' },
  { id: 5, label: 'Medications' },
  { id: 6, label: 'Medication Adherence & Access (ARMS-7)' },
  { id: 7, label: 'Allergies' },
  { id: 8, label: 'Past Medical History' },
  { id: 9, label: "Women's Health" },
  { id: 10, label: 'Family History' },
  { id: 11, label: 'Lifestyle and Social Habits' },
  { id: 12, label: 'Lifestyle Behavior Questions' },
  { id: 13, label: 'Substance Use' },
  { id: 14, label: 'Emotional and Mental Health' },
  { id: 15, label: 'Social Determinants of Health' },
  { id: 16, label: 'Adult Immunizations' },
  { id: 17, label: 'Cancer Screening Summary' },
  { id: 18, label: 'Annual Testing' },
  { id: 19, label: 'Signatures' },
];

// ─── Step config map by assessment name ───
export const ASSESSMENT_STEPS_MAP = {
  PRAPARE: PRAPARE_STEPS,
  'AHC HRSN Screening': AHC_HRSN_STEPS,
  'Family Medicine Intake and Annual Form': FAMILY_MEDICINE_STEPS,
};

// ─── Shared option arrays ───
export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'French', value: 'french' },
  { label: 'Vietnamese', value: 'vietnamese' },
  { label: 'Other', value: 'other' },
];

export const RACE_OPTIONS = [
  { label: 'Asian', value: 'asian' },
  { label: 'Black/African American', value: 'black' },
  { label: 'Native Hawaiian', value: 'nativeHawaiian' },
  { label: 'White', value: 'white' },
  { label: 'American Indian/Alaska Native', value: 'americanIndian' },
  { label: 'Hispanic/Latino', value: 'hispanicLatino' },
  { label: 'Other', value: 'other' },
];

export const ETHNICITY_OPTIONS = [
  { label: 'Hispanic or Latino', value: 'hispanicLatino' },
  { label: 'Not Hispanic or Latino', value: 'notHispanicLatino' },
  { label: 'I choose not to answer this question', value: 'chooseNotToAnswer' },
];

export const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Mexico', value: 'MX' },
];

export const STATE_OPTIONS = [
  { label: 'California', value: 'CA' },
  { label: 'Texas', value: 'TX' },
  { label: 'New York', value: 'NY' },
  { label: 'Florida', value: 'FL' },
];

export const INCOME_OPTIONS = [
  { label: 'Less than $10,000', value: 'lt10k' },
  { label: '$10,001 - $20,000', value: '10k-20k' },
  { label: '$20,001 - $40,000', value: '20k-40k' },
  { label: '$40,001 - $75,000', value: '40k-75k' },
  { label: 'More than $75,000', value: 'gt75k' },
  { label: 'I choose not to answer this question', value: 'chooseNotToAnswer' },
];

// ─── Family Medicine section options ───
export const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const ACCESS_BARRIER_OPTIONS = [
  { label: 'Cost / Affordability', value: 'cost' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'No insurance', value: 'noInsurance' },
  { label: 'Language barrier', value: 'languageBarrier' },
  { label: 'Long wait times', value: 'waitTimes' },
  { label: 'No regular provider', value: 'noProvider' },
  { label: 'Other', value: 'other' },
  { label: 'No barrier', value: 'none' },
];

export const CONTRACEPTION_OPTIONS = [
  { label: 'Birth control pills', value: 'pills' },
  { label: 'IUD', value: 'iud' },
  { label: 'Implant', value: 'implant' },
  { label: 'Condom', value: 'condom' },
  { label: 'Injection (Depo-Provera)', value: 'injection' },
  { label: 'Patch', value: 'patch' },
  { label: 'Natural family planning', value: 'natural' },
  { label: 'Sterilization', value: 'sterilization' },
  { label: 'Other', value: 'other' },
];

export const DAYS_PER_WEEK_OPTIONS = [
  { label: '0 days', value: '0' },
  { label: '1 day', value: '1' },
  { label: '2 days', value: '2' },
  { label: '3 days', value: '3' },
  { label: '4 days', value: '4' },
  { label: '5 days', value: '5' },
  { label: '6 days', value: '6' },
  { label: '7 days', value: '7' },
];

export const ACTIVITY_MINUTES_OPTIONS = [
  { label: 'Less than 10 minutes', value: 'lt10' },
  { label: '10–20 minutes', value: '10-20' },
  { label: '20–30 minutes', value: '20-30' },
  { label: '30–45 minutes', value: '30-45' },
  { label: '45–60 minutes', value: '45-60' },
  { label: 'More than 60 minutes', value: 'gt60' },
];

export const SERVINGS_OPTIONS = [
  { label: '0 servings', value: '0' },
  { label: '1 serving', value: '1' },
  { label: '2 servings', value: '2' },
  { label: '3 servings', value: '3' },
  { label: '4 or more servings', value: '4+' },
];

export const FREQUENCY_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Rarely (1–2 times/month)', value: 'rarely' },
  { label: 'Sometimes (1–2 times/week)', value: 'sometimes' },
  { label: 'Often (3–4 times/week)', value: 'often' },
  { label: 'Daily', value: 'daily' },
];

// ─── Demographics section options ───
export const SEX_AT_BIRTH_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Intersex', value: 'intersex' },
];

export const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
  { label: 'Other', value: 'other' },
];

export const IDENTIFIED_GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'nonBinary' },
  { label: 'Transgender Male', value: 'transMale' },
  { label: 'Transgender Female', value: 'transFemale' },
  { label: 'Other', value: 'other' },
  { label: 'Choose not to answer', value: 'chooseNotToAnswer' },
];

export const RACE_ETHNICITY_OPTIONS = [
  { label: 'Asian', value: 'asian' },
  { label: 'Black/African American', value: 'black' },
  { label: 'Native Hawaiian', value: 'nativeHawaiian' },
  { label: 'White', value: 'white' },
  { label: 'American Indian/Alaska Native', value: 'americanIndian' },
  { label: 'Hispanic/Latino', value: 'hispanicLatino' },
  { label: 'Other', value: 'other' },
];

export const PRONOUNS_OPTIONS = [
  { label: 'He/Him', value: 'heHim' },
  { label: 'She/Her', value: 'sheHer' },
  { label: 'They/Them', value: 'theyThem' },
  { label: 'Other', value: 'other' },
];

export const CONTACT_METHOD_OPTIONS = [
  { label: 'Text Message', value: 'textMessage' },
  { label: 'Email Address', value: 'email' },
  { label: 'Telephone Message', value: 'telephone' },
];

export const RELATIONSHIP_TO_INSURED_OPTIONS = [
  { label: 'Self', value: 'self' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Child', value: 'child' },
  { label: 'Parent', value: 'parent' },
  { label: 'Other', value: 'other' },
];

export const COUNTY_OPTIONS = [
  { label: 'Los Angeles', value: 'losAngeles' },
  { label: 'San Diego', value: 'sanDiego' },
  { label: 'Orange', value: 'orange' },
  { label: 'Riverside', value: 'riverside' },
  { label: 'San Bernardino', value: 'sanBernardino' },
];

export const CITY_OPTIONS = [
  { label: 'Los Angeles', value: 'losAngeles' },
  { label: 'San Diego', value: 'sanDiego' },
  { label: 'San Francisco', value: 'sanFrancisco' },
  { label: 'Houston', value: 'houston' },
  { label: 'New York', value: 'newYork' },
  { label: 'Phoenix', value: 'phoenix' },
  { label: 'Chicago', value: 'chicago' },
];

// ─── Health Care Access ───
export const DURATION_UNIT_OPTIONS = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' },
];

// ─── Medications ───
export const DOSAGE_UNIT_OPTIONS = [
  { label: 'mg', value: 'mg' },
  { label: 'mcg', value: 'mcg' },
  { label: 'g', value: 'g' },
  { label: 'mL', value: 'ml' },
  { label: 'units', value: 'units' },
  { label: 'tablets', value: 'tablets' },
  { label: 'capsules', value: 'capsules' },
];

export const MEDICATION_WHEN_OPTIONS = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Night', value: 'night' },
  { label: 'With meals', value: 'withMeals' },
  { label: 'Before meals', value: 'beforeMeals' },
  { label: 'After meals', value: 'afterMeals' },
  { label: 'As needed', value: 'asNeeded' },
];

export const MEDICATION_FREQUENCY_OPTIONS = [
  { label: 'Once daily', value: 'onceDaily' },
  { label: 'Twice daily', value: 'twiceDaily' },
  { label: 'Three times daily', value: 'threeTimesDaily' },
  { label: 'Four times daily', value: 'fourTimesDaily' },
  { label: 'Every other day', value: 'everyOtherDay' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'As needed', value: 'asNeeded' },
];

export const MEDICATION_ROUTE_OPTIONS = [
  { label: 'Oral', value: 'oral' },
  { label: 'Topical', value: 'topical' },
  { label: 'Intravenous', value: 'iv' },
  { label: 'Intramuscular', value: 'im' },
  { label: 'Subcutaneous', value: 'subcutaneous' },
  { label: 'Inhaled', value: 'inhaled' },
  { label: 'Sublingual', value: 'sublingual' },
];

export const MEDICATION_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Discontinued', value: 'discontinued' },
  { label: 'On Hold', value: 'onHold' },
];

export const MEDICATION_NAME_OPTIONS = [
  { label: 'Metformin', value: 'metformin' },
  { label: 'Lisinopril', value: 'lisinopril' },
  { label: 'Atorvastatin', value: 'atorvastatin' },
  { label: 'Amlodipine', value: 'amlodipine' },
  { label: 'Omeprazole', value: 'omeprazole' },
  { label: 'Levothyroxine', value: 'levothyroxine' },
  { label: 'Metoprolol', value: 'metoprolol' },
  { label: 'Aspirin', value: 'aspirin' },
  { label: 'Other', value: 'other' },
];

// ─── Allergies ───
export const ALLERGY_NAME_OPTIONS = [
  { label: 'Penicillin', value: 'penicillin' },
  { label: 'Sulfa drugs', value: 'sulfa' },
  { label: 'Aspirin', value: 'aspirin' },
  { label: 'NSAIDs', value: 'nsaids' },
  { label: 'Codeine', value: 'codeine' },
  { label: 'Latex', value: 'latex' },
  { label: 'Peanuts', value: 'peanuts' },
  { label: 'Shellfish', value: 'shellfish' },
  { label: 'Other', value: 'other' },
];

export const ALLERGY_SEVERITY_OPTIONS = [
  { label: 'Mild', value: 'mild' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Severe', value: 'severe' },
];
