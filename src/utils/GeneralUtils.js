import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Extract a user-friendly error message from an Axios error.
 */
export function formatErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data?.message)) return data.message.join(' | ');
  if (typeof data === 'string') return data;

  return error?.message || 'Something went wrong';
}

/**
 * Format a date string using dayjs.
 */
export function formatDate(date, format = 'MM/DD/YYYY') {
  return date ? dayjs(date).utc().format(format) : '';
}

/**
 * Format a date string with time — e.g. 10/27/2024 5:00:02 PM
 */
export function formatDateTime(date , format = 'MM/DD/YYYY h:mm:ss A') {
  return date ? dayjs(date).format(format) : '';
}

/**
 * Deep clone a plain object (no functions / special types).
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Get a nested value from an object by dot-separated path.
 * getNestedValue({ a: { b: 1 } }, "a.b") => 1
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
}

/**
 * Set a nested value on an object by dot-separated path (mutates).
 */
export function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Convert an array of objects to label/value pairs for dropdowns.
 */
export function toLabelValue(arr, labelKey = 'name', valueKey = 'id') {
  return (arr || []).map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
}

/**
 * Trigger a file download from an Axios blob response.
 * @param {*}      responseData - response.data (Blob / ArrayBuffer)
 * @param {string} fileName     - name for the downloaded file
 * @param {string} [mimeType]   - MIME type (default "application/octet-stream")
 */
export function downloadBlobFile(
  responseData,
  fileName,
  mimeType = 'application/octet-stream',
) {
  const blob = new Blob([responseData], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}


export function toPascalCaseWithSpaces (text = "") {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

export function buildPhoneValue(countryCode, contactNumber) {
  if (!contactNumber) return '';
  if (countryCode) return `${countryCode}${contactNumber}`;
  return contactNumber;
}

export function formatZipCode(zip) {
  if (!zip) return '';
  const digits = zip.replace(/\D/g, '');
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
  return digits;
}

/**
 * Truncate a string to a given character length.
 * Returns the original string if it's within the limit.
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength);
}

  export function toPascalCase (text = "") {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };