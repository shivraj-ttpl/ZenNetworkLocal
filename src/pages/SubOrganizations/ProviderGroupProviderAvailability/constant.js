export const FORM_FIELDS_NAMES = {
  TIME_ZONE: 'timeZone',
  BOOKING_WINDOW: 'bookingWindow',
  START_DATE: 'startDate',
  DAY_SLOTS: 'daySlots',
  BLOCK_DAYS: 'blockDays',
};

export const TIME_ZONE_OPTIONS = [
  { label: 'Mountain Standard Time (MST)', value: 'MST' },
  { label: 'Eastern Standard Time (EST)', value: 'EST' },
  { label: 'Central Standard Time (CST)', value: 'CST' },
  { label: 'Pacific Standard Time (PST)', value: 'PST' },
];

export const BOOKING_WINDOW_OPTIONS = [
  { label: '1 Week', value: '1_week' },
  { label: '2 Weeks', value: '2_weeks' },
  { label: '1 Month', value: '1_month' },
  { label: '3 Months', value: '3_months' },
];

export const APPOINTMENT_MODE_OPTIONS = [
  { label: 'In Person', value: 'in-person' },
  { label: 'Virtual', value: 'virtual' },
];

export const DAYS_OF_WEEK = [
  { label: 'Mon', value: 'mon' },
  { label: 'Tue', value: 'tue' },
  { label: 'Wed', value: 'wed' },
  { label: 'Thu', value: 'thu' },
  { label: 'Fri', value: 'fri' },
  { label: 'Sat', value: 'sat' },
  { label: 'Sun', value: 'sun' },
];
