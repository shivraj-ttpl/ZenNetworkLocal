import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import AuthLayout from "./AuthLayout";
import Input from "@/components/commonComponents/input/Input";
import Button from "@/components/commonComponents/button/Button";
import PasswordRules from "./PasswordRules";
import { getValidationSchema } from "@/utils/formUtils";
import { FORM_FIELDS_NAMES, VALIDATION_REGEX } from "./constant";

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
    customFieldName: "Confirm Password",
    customValidation: (value, parent) => {
      if (value && value !== parent[FORM_FIELDS_NAMES.PASSWORD]) {
        return "Passwords do not match";
      }
      return null;
    },
  },
];

const validationSchema = getValidationSchema(fields);

export default function SetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    // Replace with actual API dispatch
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <h1 className="text-2xl font-medium text-center text-text-primary mb-1">
        Set Your Password
      </h1>
      <p className="text-sm text-text-secondary text-center mb-8">
        Create a strong password to secure your account.
      </p>

      {/* Form */}
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.PASSWORD]: "",
          [FORM_FIELDS_NAMES.CONFIRM_PASSWORD]: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="flex flex-col gap-5">
            <input type="text" name="username" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} />
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
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Set Password
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
