import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { TOASTER_VARIANT } from '@/core/store/notificationSlice';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { getValidationSchema } from '@/utils/formUtils';
import { showToast } from '@/utils/toastUtils';

import AuthLayout from './AuthLayout';
import { authActions } from './authSaga';
import { FORM_FIELDS_NAMES, VALIDATION_REGEX } from './constant';
import PasswordRules from './PasswordRules';

const fields = [
  {
    fieldName: FORM_FIELDS_NAMES.PASSWORD,
    isRequired: true,
    isPassword: true,
    regexPattern: VALIDATION_REGEX.PASSWORD_REGEX,
  },
  {
    fieldName: FORM_FIELDS_NAMES.CONFIRM_PASSWORD,
    isRequired: true,
    customFieldName: 'Confirm Password',
    customValidation: (value, parent) => {
      if (value && value !== parent[FORM_FIELDS_NAMES.PASSWORD]) {
        return 'Passwords do not match';
      }
      return null;
    },
  },
];

const validationSchema = getValidationSchema(fields);

export default function SetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { postSetPassword } = authActions;
  const isLoading = useLoadingKey(LOADING_KEYS.AUTH_POST_SET_PASSWORD);

  const handleSubmit = (values) => {
    dispatch(
      postSetPassword({
        payload: {
          token,
          password: values[FORM_FIELDS_NAMES.PASSWORD],
          confirmPassword: values[FORM_FIELDS_NAMES.CONFIRM_PASSWORD],
        },
        onSuccessCb: (res) => {
          showToast(res?.data?.data?.message, TOASTER_VARIANT.SUCCESS);
          navigate('/login');
        },
      }),
    );
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-medium text-center text-text-primary mb-1">
        Set Your Password
      </h1>
      <p className="text-sm text-text-secondary text-center mb-8">
        Create a strong password to secure your account.
      </p>

      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.PASSWORD]: '',
          [FORM_FIELDS_NAMES.CONFIRM_PASSWORD]: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit: formikSubmit,
        }) => (
          <form onSubmit={formikSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="username"
              autoComplete="username"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            <Input
              label="Password"
              name={FORM_FIELDS_NAMES.PASSWORD}
              type="password"
              placeholder="Enter Password"
              value={values[FORM_FIELDS_NAMES.PASSWORD]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.PASSWORD]}
              touched={touched[FORM_FIELDS_NAMES.PASSWORD]}
              required
            />

            <Input
              label="Confirm Password"
              name={FORM_FIELDS_NAMES.CONFIRM_PASSWORD}
              type="password"
              placeholder="Enter Confirm Password"
              value={values[FORM_FIELDS_NAMES.CONFIRM_PASSWORD]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.CONFIRM_PASSWORD]}
              touched={touched[FORM_FIELDS_NAMES.CONFIRM_PASSWORD]}
              required
            />

            <PasswordRules password={values[FORM_FIELDS_NAMES.PASSWORD]} />

            <Button
              type="submit"
              variant="primaryBlue"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Set Password
            </Button>
          </form>
        )}
      </Formik>
    </AuthLayout>
  );
}
