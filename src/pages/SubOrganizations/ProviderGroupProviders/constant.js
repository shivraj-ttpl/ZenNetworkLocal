export const FORM_FIELDS_NAMES = {
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  GENDER: "gender",
  EMAIL: "email",
  LANGUAGE: "language",
  CONTACT_NUMBER: "contactNumber",
  PROVIDER_TYPE: "providerType",
  SPECIALTIES: "specialties",
  PRIMARY_ROLE: "primaryRole",
  SECONDARY_ROLE: "secondaryRole",
  NPI_NUMBER: "npiNumber",
  STATE_LICENSE: "stateLicense",
  YEARS_OF_EXPERIENCE: "yearsOfExperience",
  TIMEZONE: "timezone",
  BIO: "bio",
  ADDRESS_LINE_1: "addressLine1",
  ADDRESS_LINE_2: "addressLine2",
  STATE: "state",
  COUNTRY: "country",
  CITY: "city",
  ZIP_CODE: "zipCode",
};

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-Binary", value: "nonBinary" },
  { label: "Prefer not to say", value: "preferNotToSay" },
];

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "Mandarin", value: "mandarin" },
  { label: "Hindi", value: "hindi" },
  { label: "Arabic", value: "arabic" },
];

export const PROVIDER_TYPE_OPTIONS = [
  { label: "Physician", value: "physician" },
  { label: "Nurse Practitioner", value: "nursePractitioner" },
  { label: "Physician Assistant", value: "physicianAssistant" },
  { label: "Registered Nurse", value: "registeredNurse" },
  { label: "Therapist", value: "therapist" },
];

export const SPECIALTIES_OPTIONS = [
  { label: "Family Medicine", value: "familyMedicine" },
  { label: "Internal Medicine", value: "internalMedicine" },
  { label: "Pediatrics", value: "pediatrics" },
  { label: "Cardiology", value: "cardiology" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "Dermatology", value: "dermatology" },
  { label: "Neurology", value: "neurology" },
  { label: "Oncology", value: "oncology" },
];

export const ROLE_OPTIONS = [
  { label: "Primary Care Physician", value: "primaryCarePhysician" },
  { label: "Specialist", value: "specialist" },
  { label: "Surgeon", value: "surgeon" },
  { label: "Consultant", value: "consultant" },
  { label: "Attending Physician", value: "attendingPhysician" },
];

export const TIMEZONE_OPTIONS = [
  { label: "Eastern (ET)", value: "America/New_York" },
  { label: "Central (CT)", value: "America/Chicago" },
  { label: "Mountain (MT)", value: "America/Denver" },
  { label: "Pacific (PT)", value: "America/Los_Angeles" },
  { label: "Alaska (AKT)", value: "America/Anchorage" },
  { label: "Hawaii (HT)", value: "America/Honolulu" },
];

export const STATE_OPTIONS = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "New York", value: "NY" },
  { label: "Florida", value: "FL" },
  { label: "Illinois", value: "IL" },
  { label: "Ohio", value: "OH" },
  { label: "Colorado", value: "CO" },
  { label: "Massachusetts", value: "MA" },
  { label: "Washington", value: "WA" },
  { label: "Oregon", value: "OR" },
];

export const COUNTRY_OPTIONS = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Mexico", value: "MX" },
];
