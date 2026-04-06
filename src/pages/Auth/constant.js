export const FORM_FIELDS_NAMES = {
  EMAIL: 'email',
  PASSWORD: 'password',
  REMEMBER_ME: 'rememberMe',
  NEW_PASSWORD: 'newPassword',
  CONFIRM_PASSWORD: 'confirmPassword',
};

export const VALIDATION_REGEX = {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]+$/,
};
