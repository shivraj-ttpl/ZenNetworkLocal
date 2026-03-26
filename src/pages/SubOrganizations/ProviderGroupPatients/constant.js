export const PATIENT_STEPS = [
  { id: 1, label: "Patient Details" },
  { id: 2, label: "Insurance and Identifiers" },
];

export const FORM_FIELDS_NAMES = {
  // Demographics
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  MIDDLE_NAME: "middleName",
  SEX_AT_BIRTH: "sexAtBirth",
  DATE_OF_BIRTH: "dateOfBirth",
  MARITAL_STATUS: "maritalStatus",
  IDENTIFIED_GENDER: "identifiedGender",
  RACE: "race",
  ETHNICITY: "ethnicity",
  PREFERRED_LANGUAGE: "preferredLanguage",
  EMAIL: "email",
  PRIMARY_CONTACT: "primaryContact",
  SECONDARY_CONTACT: "secondaryContact",
  PREFERRED_METHOD_OF_CONTACT: "preferredMethodOfContact",

  // Address
  ADDRESS_LINE_1: "addressLine1",
  ADDRESS_LINE_2: "addressLine2",
  STATE: "state",
  TIMEZONE: "timezone",
  CITY: "city",
  ZIP_CODE: "zipCode",
  COUNTY: "county",
  COUNTRY: "country",

  // Family/Guardian Contact
  FAMILY_CONTACTS: "familyContacts",
  FC_EMERGENCY: "emergency",
  FC_FIRST_NAME: "firstName",
  FC_LAST_NAME: "lastName",
  FC_RELATIONSHIP: "relationshipType",
  FC_EMAIL: "email",
  FC_PRIMARY_CONTACT: "primaryContact",
  FC_SECONDARY_CONTACT: "secondaryContact",

  // Provider & Care Team
  REFERRING_PROVIDER: "referringProvider",
  PRIMARY_CARE_PROVIDER: "primaryCareProvider",
  PRIMARY_CARE_MANAGER: "primaryCareManager",
  SECONDARY_CARE_MANAGER: "secondaryCareManager",
  ADDITIONAL_CARE_TEAM_MEMBER: "additionalCareTeamMember",

  // Approval for Communication
  CONSENT_TO_MESSAGE: "consentToMessage",
  CONSENT_TO_CALL: "consentToCall",
  CONSENT_TO_EMAIL: "consentToEmail",
  ENABLE_CALL_RECORDING: "enableCallRecording",

  // Insurance
  INSURANCES: "insurances",
  INS_NO_INSURANCE: "noInsurance",
  INS_MARK_PRIMARY: "markAsPrimary",
  INS_TYPE: "insuranceType",
  INS_NAME: "insuranceName",
  INS_RELATIONSHIP: "relationshipToInsured",
  INS_POLICY_HOLDER: "policyHolderName",
  INS_EFFECTIVE_DATE: "insuranceEffectiveDate",
  INS_POLICY_NUMBER: "policyNumber",
  INS_GROUP_PLAN: "insuredGroupPlan",
  INS_EMPLOYER: "employerSchoolName",

  // Insured Address
  INS_SAME_AS_PRIMARY: "sameAsPrimaryAddress",
  INS_ADDRESS_LINE_1: "insAddressLine1",
  INS_ADDRESS_LINE_2: "insAddressLine2",
  INS_STATE: "insState",
  INS_CITY: "insCity",
  INS_ZIP_CODE: "insZipCode",
  INS_COUNTY: "insCounty",
  INS_COUNTRY: "insCountry",

  // Upload Insurance Card
  INS_CARD_FRONT: "insuranceCardFront",
  INS_CARD_BACK: "insuranceCardBack",

  // Identifiers
  SSN: "ssn",
  PROVIDER_MRN: "providerMrn",
  HOSPITAL_MRN: "hospitalMrn",
  COMMUNITY_MPI: "communityMpi",
  OTHER_IDENTIFIER_1: "otherIdentifier1",
  OTHER_IDENTIFIER_2: "otherIdentifier2",
};

export const SEX_AT_BIRTH_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Unknown", value: "unknown" },
];

export const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-Binary", value: "nonBinary" },
  { label: "Transgender Male", value: "transgenderMale" },
  { label: "Transgender Female", value: "transgenderFemale" },
  { label: "Prefer not to say", value: "preferNotToSay" },
];

export const RACE_OPTIONS = [
  { label: "White", value: "white" },
  { label: "Black or African American", value: "black" },
  { label: "Asian", value: "asian" },
  { label: "Native Hawaiian or Pacific Islander", value: "nativeHawaiian" },
  { label: "American Indian or Alaska Native", value: "americanIndian" },
  { label: "Other", value: "other" },
];

export const ETHNICITY_OPTIONS = [
  { label: "Hispanic or Latino", value: "hispanic" },
  { label: "Not Hispanic or Latino", value: "notHispanic" },
  { label: "Unknown", value: "unknown" },
];

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "Mandarin", value: "mandarin" },
  { label: "Hindi", value: "hindi" },
  { label: "Arabic", value: "arabic" },
];

export const CONTACT_METHOD_OPTIONS = [
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Text", value: "text" },
];

export const RELATIONSHIP_OPTIONS = [
  { label: "Spouse", value: "spouse" },
  { label: "Parent", value: "parent" },
  { label: "Child", value: "child" },
  { label: "Sibling", value: "sibling" },
  { label: "Guardian", value: "guardian" },
  { label: "Other", value: "other" },
];

export const PROVIDER_OPTIONS = [
  { label: "Dr. Jennifer Adams", value: "jenniferAdams" },
  { label: "Dr. Michael Chen", value: "michaelChen" },
  { label: "Dr. Sarah Wilson", value: "sarahWilson" },
];

export const CARE_MANAGER_OPTIONS = [
  { label: "Floyd Miles", value: "floydMiles" },
  { label: "Eleanor Pena", value: "eleanorPena" },
  { label: "Cameron Williamson", value: "cameronWilliamson" },
  { label: "Guy Hawkins", value: "guyHawkins" },
];

export const INSURANCE_TYPE_OPTIONS = [
  { label: "Private", value: "private" },
  { label: "Medicare", value: "medicare" },
  { label: "Medicaid", value: "medicaid" },
  { label: "Self-Pay", value: "selfPay" },
];

export const INSURANCE_NAME_OPTIONS = [
  { label: "Blue Cross Blue Shield", value: "bcbs" },
  { label: "Aetna", value: "aetna" },
  { label: "UnitedHealthcare", value: "uhc" },
  { label: "Cigna", value: "cigna" },
  { label: "Humana", value: "humana" },
];

export const RELATIONSHIP_TO_INSURED_OPTIONS = [
  { label: "Self", value: "self" },
  { label: "Spouse", value: "spouse" },
  { label: "Child", value: "child" },
  { label: "Other", value: "other" },
];

export const STATE_OPTIONS = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "New York", value: "NY" },
  { label: "Florida", value: "FL" },
  { label: "Illinois", value: "IL" },
  { label: "Ohio", value: "OH" },
];

export const TIMEZONE_OPTIONS = [
  { label: "Eastern (ET)", value: "America/New_York" },
  { label: "Central (CT)", value: "America/Chicago" },
  { label: "Mountain (MT)", value: "America/Denver" },
  { label: "Pacific (PT)", value: "America/Los_Angeles" },
];

export const COUNTY_OPTIONS = [
  { label: "Dallas County", value: "dallas" },
  { label: "Harris County", value: "harris" },
  { label: "Los Angeles County", value: "losAngeles" },
  { label: "Cook County", value: "cook" },
];

export const COUNTRY_OPTIONS = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Mexico", value: "MX" },
];
