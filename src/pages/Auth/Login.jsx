import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import AuthLayout from "./AuthLayout";
import Input from "@/components/commonComponents/input/Input";
import Button from "@/components/commonComponents/button/Button";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import { getValidationSchema } from "@/utils/formUtils";
import { FORM_FIELDS_NAMES, VALIDATION_REGEX } from "./constant";

const fields = [
  {
    fieldName: FORM_FIELDS_NAMES.EMAIL,
    isRequired: true,
    isEmail: true,
    customFieldName: "Email Address",
  },
  {
    fieldName: FORM_FIELDS_NAMES.PASSWORD,
    isRequired: true,
    isPassword: true,
    regexPattern: VALIDATION_REGEX.PASSWORD_REGEX,
  },
];

const validationSchema = getValidationSchema(fields);

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    // Replace with actual login dispatch
    setTimeout(() => {
      localStorage.setItem("token", "demo-token");
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <AuthLayout
      footer={
        <>
          <p className="text-xs text-neutral-400">
            &copy; 2026 One Team. All right reserved
          </p>
          <p className="text-xs text-neutral-400">
            HIPPAA-compliant secure platform
          </p>
        </>
      }
    >
      {/* Heading */}
      <h1 className="text-2xl font-medium text-center text-text-primary">
        Welcome to <span className="text-secondary-accent">OneTeam</span>
      </h1>
      <p className="text-sm text-text-secondary text-center mt-1 mb-8">
        Secure access to your care coordination workspace
      </p>

      {/* Form */}
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.EMAIL]: "",
          [FORM_FIELDS_NAMES.PASSWORD]: "",
          [FORM_FIELDS_NAMES.REMEMBER_ME]: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
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
              required
            />

            <Input
              label="Password"
              name={FORM_FIELDS_NAMES.PASSWORD}
              type="password"
              placeholder="Enter your Password"
              value={values[FORM_FIELDS_NAMES.PASSWORD]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.PASSWORD]}
              touched={touched[FORM_FIELDS_NAMES.PASSWORD]}
              required
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember this device"
                name={FORM_FIELDS_NAMES.REMEMBER_ME}
                variant={"secondary"}
                checked={values[FORM_FIELDS_NAMES.REMEMBER_ME]}
                onChange={(e) =>
                  setFieldValue(FORM_FIELDS_NAMES.REMEMBER_ME, e.target.checked)
                }
              />
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-secondary-link hover:text-secondary-link-hover transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
