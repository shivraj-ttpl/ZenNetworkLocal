export const FORM_FIELDS_NAMES = {
  CONDITION_NAME: 'conditionName',
  ICD_CODE: 'icdCode',
  ICD_DETAILS: 'icdDetails',
  CARE_PLAN: 'carePlan',
  DESCRIPTION: 'description',
};

export const ICD_CODE_OPTIONS = [
  { label: 'A00 - Cholera', value: 'A00' },
  { label: 'A01 - Typhoid and paratyphoid fevers', value: 'A01' },
  { label: 'A02 - Other salmonella infections', value: 'A02' },
  { label: 'A09 - Infectious gastroenteritis', value: 'A09' },
  { label: 'J06 - Upper respiratory infections', value: 'J06' },
  { label: 'E11 - Type 2 diabetes mellitus', value: 'E11' },
  { label: 'I10 - Essential hypertension', value: 'I10' },
];

export const CARE_PLAN_OPTIONS = [
  { label: 'Diabetes Management Plan', value: 'diabetes_management' },
  { label: 'Hypertension Care Plan', value: 'hypertension_care' },
  { label: 'Respiratory Care Plan', value: 'respiratory_care' },
  { label: 'Infection Control Plan', value: 'infection_control' },
  { label: 'General Wellness Plan', value: 'general_wellness' },
];
