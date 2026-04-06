/**
 * Deep-trims all string values in request payloads.
 * Skips File, Blob, and FormData instances.
 */
export const deepTrimStrings = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }

  if (Array.isArray(input)) {
    return input.map(deepTrimStrings);
  }

  if (input !== null && typeof input === 'object') {
    if (
      input instanceof File ||
      input instanceof Blob ||
      input instanceof FormData
    ) {
      return input;
    }

    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        deepTrimStrings(value),
      ]),
    );
  }

  return input;
};

/**
 * Checks whether the axios config carries multipart or binary data
 * that should not be trimmed.
 */
export const isMultipartOrBinary = (config) => {
  return (
    config.data instanceof FormData ||
    config.data instanceof Blob ||
    config.data instanceof File ||
    (config.headers &&
      typeof config.headers['Content-Type'] === 'string' &&
      config.headers['Content-Type'].includes('multipart/form-data'))
  );
};
