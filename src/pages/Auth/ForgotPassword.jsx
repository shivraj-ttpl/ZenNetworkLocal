import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import { Icon } from '@/components/icons';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { TOASTER_VARIANT } from '@/core/store/notificationSlice';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { getValidationSchema } from '@/utils/formUtils';
import { showToast } from '@/utils/toastUtils';

import AuthLayout from './AuthLayout';
import { authActions } from './authSaga';
import { FORM_FIELDS_NAMES } from './constant';

const fields = [
  {
    fieldName: FORM_FIELDS_NAMES.EMAIL,
    isRequired: true,
    isEmail: true,
    customFieldName: 'Email Address',
  },
];

const validationSchema = getValidationSchema(fields);

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { postForgotPassword } = authActions;
  const isLoading = useLoadingKey(LOADING_KEYS.AUTH_POST_FORGOT_PASSWORD);

  const handleSubmit = (values) => {
    dispatch(
      postForgotPassword({
        payload: values,
        onSuccessCb: (res) => {
          showToast(res?.data?.data?.message, TOASTER_VARIANT.SUCCESS);
        },
      }),
    );
  };

  return (
    <AuthLayout
      footer={
        <p className="text-sm text-neutral-400 flex flex-col">
          <span>Do you need help? Contact our support team</span>
          <span>
            Email :{' '}
            <a className="text-primary-500" href="mailto:support@oneteam.com">
              support@oneteam.com
            </a>
          </span>
          <span>9:00 AM - 5:00 PM, Monday to Friday EST</span>
          <span>(Eastern Standard Time)</span>
        </p>
      }
    >
      {/* Heading */}
      <h1 className="text-2xl font-medium text-center text-text-primary mb-2">
        Forgot Your Password
      </h1>
      <p className="text-sm text-text-secondary text-center mb-8">
        Enter your registered Email Address to receive the password
        <br />
        reset link.
      </p>

      <Formik
        initialValues={{ [FORM_FIELDS_NAMES.EMAIL]: '' }}
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
            <Input
              label="Email Address"
              name={FORM_FIELDS_NAMES.EMAIL}
              type="email"
              placeholder="Enter Email Address"
              value={values[FORM_FIELDS_NAMES.EMAIL]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.EMAIL]}
              touched={touched[FORM_FIELDS_NAMES.EMAIL]}
            />

            <Button
              type="submit"
              variant="primaryBlue"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>
        )}
      </Formik>

      <div className="border-t border-border-light mt-6 pt-5">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          Back to Login Page
        </Link>
      </div>
    </AuthLayout>
  );
}
