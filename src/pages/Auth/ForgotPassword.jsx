import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { Icon } from "@/components/icons";
import AuthLayout from "./AuthLayout";
import Input from "@/components/commonComponents/input/Input";
import Button from "@/components/commonComponents/button/Button";
import { getValidationSchema } from "@/utils/formUtils";
import { FORM_FIELDS_NAMES } from "./constant";

const fields = [
  {
    fieldName: FORM_FIELDS_NAMES.EMAIL,
    isRequired: true,
    isEmail: true,
    customFieldName: "Email Address",
  },
];

const validationSchema = getValidationSchema(fields);

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    // Replace with actual API dispatch
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      
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

      {/* Form */}
      <Formik
        initialValues={{ [FORM_FIELDS_NAMES.EMAIL]: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="flex flex-col gap-5">
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
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Send Reset Link
            </Button>
          </Form>
        )}
      </Formik>

      {/* Divider */}
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
