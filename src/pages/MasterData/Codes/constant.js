export const PATH_TO_LABEL = {
  '/master-data/codes': 'ICD',
  '/master-data/codes/cpt': 'CPT',
  '/master-data/codes/lonic': 'LONIC',
  '/master-data/codes/snomed-ct': 'SNOMED CT',
  '/master-data/codes/hcpcs': 'HCPCS',
  '/master-data/codes/allergies': 'Allergy',
  '/master-data/codes/symptoms': 'Symptom',
  '/master-data/codes/medications': 'Medication',
};

export const CODE_TYPE_MAP = {
  ICD: 'icd',
  CPT: 'cpt',
  LONIC: 'loinc',
  'SNOMED CT': 'snomed',
  HCPCS: 'hcpcs',
  Allergy: 'allergies',
  Symptom: 'symptoms',
  Medication: 'medications',
};

// Types that use dedicated endpoints (not /codes/{type})
export const STANDALONE_CODE_TYPES = new Set([
  'allergies',
  'symptoms',
  'medications',
]);

export const FORM_FIELDS_NAMES = {
  CODE: 'code',
  DESCRIPTION: 'description',
};

export const SIMPLE_NAME_FORM_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
};

export const MEDICATION_FORM_FIELDS = {
  MEDICATION_NAME: 'medicationName',
  GENERIC_NAME: 'genericName',
  BRAND_NAME: 'brandName',
  STRENGTH: 'strength',
  FORM: 'form',
  DRUG_CLASS: 'drugClass',
  RXNORM_CODE: 'rxNormCode',
  ATC_CODE: 'atcCode',
};

export const DOSAGE_FORM_OPTIONS = [
  { label: 'Tablet', value: 'Tablet' },
  { label: 'Capsule', value: 'Capsule' },
  { label: 'Syrup', value: 'Syrup' },
  { label: 'Injection', value: 'Injection' },
  { label: 'Cream', value: 'Cream' },
  { label: 'Ointment', value: 'Ointment' },
  { label: 'Drops', value: 'Drops' },
  { label: 'Inhaler', value: 'Inhaler' },
  { label: 'Patch', value: 'Patch' },
  { label: 'Suppository', value: 'Suppository' },
];

export const DRUG_CLASS_OPTIONS = [
  { label: 'Antibiotic', value: 'Antibiotic' },
  { label: 'Analgesic', value: 'Analgesic' },
  { label: 'Antidiabetic', value: 'Antidiabetic' },
  { label: 'Antihypertensive', value: 'Antihypertensive' },
  { label: 'Antihyperlipidemic', value: 'Antihyperlipidemic' },
  { label: 'Antihistamine', value: 'Antihistamine' },
  { label: 'Antiviral', value: 'Antiviral' },
  { label: 'Antifungal', value: 'Antifungal' },
  { label: 'Anti-inflammatory', value: 'Anti-inflammatory' },
  { label: 'Anticoagulant', value: 'Anticoagulant' },
];
