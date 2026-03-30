import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import AuthLayout from "./AuthLayout";
import Input from "@/components/commonComponents/input/Input";
import Button from "@/components/commonComponents/button/Button";
import PasswordRules from "./PasswordRules";
import { getValidationSchema } from "@/utils/formUtils";
import { FORM_FIELDS_NAMES, VALIDATION_REGEX } from "./constant";
import { authActions } from "./authSaga";
import { useLoadingKey } from "@/hooks/useLoadingKey";
import { LOADING_KEYS } from "@/constants/loadingKeys";
import { showToast } from "@/utils/toastUtils";
import { TOASTER_VARIANT } from "@/core/store/notificationSlice";

const fields = [
  {
    fieldName: FORM_FIELDS_NAMES.NEW_PASSWORD,
    isRequired: true,
    isPassword: true,
    regexPattern: VALIDATION_REGEX.PASSWORD_REGEX,
    customFieldName: "New Password",
  },
  {
    fieldName: FORM_FIELDS_NAMES.CONFIRM_PASSWORD,
    isRequired: true,
    customFieldName: "Confirm Password",
    customValidation: (value, parent) => {
      if (value && value !== parent[FORM_FIELDS_NAMES.NEW_PASSWORD]) {
        return "Passwords do not match";
      }
      return null;
    },
  },
];

const validationSchema = getValidationSchema(fields);

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { postResetPassword } = authActions;
  const isLoading = useLoadingKey(LOADING_KEYS.AUTH_POST_RESET_PASSWORD);

  const handleSubmit = (values) => {
    dispatch(
      postResetPassword({
        payload: {
          token,
          newPassword: values[FORM_FIELDS_NAMES.NEW_PASSWORD],
          confirmPassword: values[FORM_FIELDS_NAMES.CONFIRM_PASSWORD],
        },
        onSuccessCb: (res) => {
          showToast(res?.data?.data?.message, TOASTER_VARIANT.SUCCESS);
          navigate("/login");
        },
      }),
    );
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-medium text-center text-text-primary mb-1">
        Set Your New Password
      </h1>
      <p className="text-sm text-text-secondary text-center mb-8">
        Create a strong password to secure your account.
      </p>

      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.NEW_PASSWORD]: "",
          [FORM_FIELDS_NAMES.CONFIRM_PASSWORD]: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit: formikSubmit }) => (
          <form onSubmit={formikSubmit} className="flex flex-col gap-5">
            <input type="text" name="username" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} />
            <Input
              label="New Password"
              name={FORM_FIELDS_NAMES.NEW_PASSWORD}
              type="password"
              placeholder="Enter New Password"
              value={values[FORM_FIELDS_NAMES.NEW_PASSWORD]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.NEW_PASSWORD]}
              touched={touched[FORM_FIELDS_NAMES.NEW_PASSWORD]}
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

            <PasswordRules password={values[FORM_FIELDS_NAMES.NEW_PASSWORD]} />

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
