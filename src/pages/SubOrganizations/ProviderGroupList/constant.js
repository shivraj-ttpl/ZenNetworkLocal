export const FORM_FIELDS_NAMES = {
  PROVIDER_GROUP_NAME: "providerGroupName",
  EMAIL: "email",
  CONTACT_NUMBER: "contactNumber",
  SPECIALTIES: "specialties",
  WEBSITE: "website",
  TIMEZONE: "timezone",
  NOTES: "notes",
  ADDRESS_LINE_1: "addressLine1",
  ADDRESS_LINE_2: "addressLine2",
  STATE: "state",
  COUNTRY: "country",
  CITY: "city",
  ZIP_CODE: "zipCode",
  SAME_AS_PRIMARY: "sameAsPrimary",
  BILLING_ADDRESS_LINE_1: "billingAddressLine1",
  BILLING_ADDRESS_LINE_2: "billingAddressLine2",
  BILLING_STATE: "billingState",
  BILLING_COUNTRY: "billingCountry",
  BILLING_CITY: "billingCity",
  BILLING_ZIP_CODE: "billingZipCode",
};

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

export const TIMEZONE_OPTIONS = [
  { label: "Eastern (ET)", value: "America/New_York" },
  { label: "Central (CT)", value: "America/Chicago" },
  { label: "Mountain (MT)", value: "America/Denver" },
  { label: "Pacific (PT)", value: "America/Los_Angeles" },
  { label: "Alaska (AKT)", value: "America/Anchorage" },
  { label: "Hawaii (HT)", value: "America/Honolulu" },
];
