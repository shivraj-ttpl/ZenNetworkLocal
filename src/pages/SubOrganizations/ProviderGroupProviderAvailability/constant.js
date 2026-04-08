export const FORM_FIELDS_NAMES = {
  TIME_ZONE: 'timeZone',
  BOOKING_WINDOW: 'bookingWindow',
  START_DATE: 'startDate',
  DAY_SLOTS: 'daySlots',
  BLOCK_DAYS: 'blockDays',
};

export const TIME_ZONE_OPTIONS = [
  { label: 'Eastern Standard Time (EST)', value: 'America/New_York' },
  { label: 'Central Standard Time (CST)', value: 'America/Chicago' },
  { label: 'Mountain Standard Time (MST)', value: 'America/Denver' },
  { label: 'Pacific Standard Time (PST)', value: 'America/Los_Angeles' },
  { label: 'Alaska Standard Time (AKST)', value: 'America/Anchorage' },
  { label: 'Hawaii Standard Time (HST)', value: 'Pacific/Honolulu' },
];

export const BOOKING_WINDOW_OPTIONS = [
  { label: '1 Week', value: 1 },
  { label: '2 Weeks', value: 2 },
  { label: '4 Weeks', value: 4 },
  { label: '8 Weeks', value: 8 },
  { label: '12 Weeks', value: 12 },
];

export const APPOINTMENT_MODE_OPTIONS = [
  { label: 'In Person', value: 'IN_PERSON' },
  { label: 'Virtual', value: 'VIRTUAL' },
];

export const DAYS_OF_WEEK = [
  { label: 'Mon', value: 'MON' },
  { label: 'Tue', value: 'TUE' },
  { label: 'Wed', value: 'WED' },
  { label: 'Thu', value: 'THU' },
  { label: 'Fri', value: 'FRI' },
  { label: 'Sat', value: 'SAT' },
  { label: 'Sun', value: 'SUN' },
];

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
