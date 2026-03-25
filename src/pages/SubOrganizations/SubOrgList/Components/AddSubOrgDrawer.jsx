import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import Icon from "@/components/icons/Icon";
import {
  FORM_FIELDS_NAMES,
  STATE_OPTIONS,
  COUNTRY_OPTIONS,
  SUB_ORG_OPTIONS,
  SUB_ORG_ADMIN_OPTIONS,
} from "../constant";
import UploadPhoto from "@/components/commonComponents/upload/UploadPhoto";

const emptyContact = {
  [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: "",
  [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: "",
  [FORM_FIELDS_NAMES.ADMIN_EMAIL]: "",
  [FORM_FIELDS_NAMES.ADMIN_PHONE]: "",
};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: Yup.string().required("Sub-organization Name is required"),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string().email("Invalid email").required("Email is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required("Zip Code is required"),
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG]: Yup.object().nullable().required("Sub-Organization is required"),
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]: Yup.object().nullable().required("Sub-Organization Admin is required"),
  [FORM_FIELDS_NAMES.ADMIN_CONTACTS]: Yup.array().of(
    Yup.object().shape({
      [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: Yup.string().required("First Name is required"),
      [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: Yup.string().required("Last Name is required"),
    })
  ),
});

const initialValues = {
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: "",
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: "",
  [FORM_FIELDS_NAMES.EMAIL]: "",
  [FORM_FIELDS_NAMES.WEBSITE]: "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: "",
  [FORM_FIELDS_NAMES.STATE]: null,
  [FORM_FIELDS_NAMES.COUNTRY]: null,
  [FORM_FIELDS_NAMES.CITY]: "",
  [FORM_FIELDS_NAMES.ZIP_CODE]: "",
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG]: null,
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]: null,
  [FORM_FIELDS_NAMES.ADMIN_CONTACTS]: [{ ...emptyContact }],
  photo: null,
};

export default function AddSubOrgDrawer({ open, onClose }) {
  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    onClose();
  };

  return (
    <Drawer
      title="Add Sub-Organization"
      open={open}
      close={onClose}
      width="max-w-[50%] w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
          <Form className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto zenera-scrollbar flex gap-6">
              {/* Photo Upload */}
              <div className="flex-shrink-0 w-[200px]">
                <UploadPhoto
                  name="photo"
                  label="Upload a Photo"
                  maxFileSize={5}
                  onFileSelect={(file) => setFieldValue("photo", file)}
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-5">
                {/* Demographics */}
                <h4 className="text-sm font-semibold text-text-primary">Demographics</h4>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Sub-organization Name"
                    name={FORM_FIELDS_NAMES.SUB_ORG_NAME}
                    placeholder="Enter sub-organization name"
                    value={values[FORM_FIELDS_NAMES.SUB_ORG_NAME]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.SUB_ORG_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.SUB_ORG_NAME]}
                    required
                  />
                  <PhoneInput
                    label="Contact Number"
                    name={FORM_FIELDS_NAMES.CONTACT_NUMBER}
                    value={values[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                    onChange={(val) => setFieldValue(FORM_FIELDS_NAMES.CONTACT_NUMBER, val || "")}
                    onBlur={handleBlur}
                    defaultCountry="US"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    name={FORM_FIELDS_NAMES.EMAIL}
                    placeholder="username@example.com"
                    type="email"
                    value={values[FORM_FIELDS_NAMES.EMAIL]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.EMAIL]}
                    touched={touched[FORM_FIELDS_NAMES.EMAIL]}
                    required
                  />
                  <Input
                    label="Website"
                    name={FORM_FIELDS_NAMES.WEBSITE}
                    placeholder="Enter Website"
                    value={values[FORM_FIELDS_NAMES.WEBSITE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Address Information */}
                <h4 className="text-sm font-semibold text-text-primary">Address Information</h4>

                <Input
                  label="Address Line 1"
                  name={FORM_FIELDS_NAMES.ADDRESS_LINE_1}
                  placeholder="e.g., 221B Baker Street, Andheri West"
                  value={values[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
                  touched={touched[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
                  required
                />

                <Input
                  label="Address Line 2"
                  name={FORM_FIELDS_NAMES.ADDRESS_LINE_2}
                  placeholder="Enter"
                  value={values[FORM_FIELDS_NAMES.ADDRESS_LINE_2]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="State"
                    name={FORM_FIELDS_NAMES.STATE}
                    placeholder="Select State"
                    options={STATE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.STATE]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.STATE, selected)}
                    required
                    error={errors[FORM_FIELDS_NAMES.STATE]}
                    touched={touched[FORM_FIELDS_NAMES.STATE]}
                  />
                  <SelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.COUNTRY}
                    placeholder="Select Country"
                    options={COUNTRY_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.COUNTRY]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.COUNTRY, selected)}
                    required
                    error={errors[FORM_FIELDS_NAMES.COUNTRY]}
                    touched={touched[FORM_FIELDS_NAMES.COUNTRY]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name={FORM_FIELDS_NAMES.CITY}
                    placeholder="Enter City"
                    value={values[FORM_FIELDS_NAMES.CITY]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.CITY]}
                    touched={touched[FORM_FIELDS_NAMES.CITY]}
                    required
                  />
                  <Input
                    label="ZIP CODE"
                    name={FORM_FIELDS_NAMES.ZIP_CODE}
                    placeholder="Enter Zip Code"
                    value={values[FORM_FIELDS_NAMES.ZIP_CODE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.ZIP_CODE]}
                    touched={touched[FORM_FIELDS_NAMES.ZIP_CODE]}
                    required
                  />
                </div>

                {/* Import from Another Sub-Organization */}
                <h4 className="text-sm font-semibold text-text-primary">Import from Another Sub-Organization</h4>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <SelectDropdown
                      label="Sub-Organization"
                      name={FORM_FIELDS_NAMES.IMPORT_SUB_ORG}
                      placeholder="Select Sub-..."
                      options={SUB_ORG_OPTIONS}
                      value={values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG]}
                      onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.IMPORT_SUB_ORG, selected)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <SelectDropdown
                      label="Sub-Organization Admin"
                      name={FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN}
                      placeholder="Search by Name/Email"
                      options={SUB_ORG_ADMIN_OPTIONS}
                      value={values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]}
                      onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN, selected)}
                      required
                      isSearchable
                    />
                  </div>
                  <Button variant="primaryTeal" size="sm" type="button">
                    Import
                  </Button>
                </div>

                <p className="text-xs text-text-secondary -mt-3">
                  You can either import an existing Sub-Organization Admin or create a new one by providing the details below
                </p>

                {/* Administrative Contact Details */}
                <h4 className="text-sm font-semibold text-text-primary">Administrative Contact Details</h4>

                <FieldArray name={FORM_FIELDS_NAMES.ADMIN_CONTACTS}>
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-5">
                      {values[FORM_FIELDS_NAMES.ADMIN_CONTACTS].map((contact, index) => {
                        const prefix = `${FORM_FIELDS_NAMES.ADMIN_CONTACTS}[${index}]`;
                        const contactErrors = errors?.[FORM_FIELDS_NAMES.ADMIN_CONTACTS]?.[index] || {};
                        const contactTouched = touched?.[FORM_FIELDS_NAMES.ADMIN_CONTACTS]?.[index] || {};

                        return (
                          <div key={index} className="flex flex-col gap-4 relative border border-border-light rounded-lg p-4">
                            {values[FORM_FIELDS_NAMES.ADMIN_CONTACTS].length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-error-500 cursor-pointer"
                              >
                                <Icon name="X" size={14} />
                              </button>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="First Name"
                                name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_FIRST_NAME}`}
                                placeholder="Enter First Name"
                                value={contact[FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={contactErrors[FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]}
                                touched={contactTouched[FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]}
                                required
                              />
                              <Input
                                label="Last Name"
                                name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_LAST_NAME}`}
                                placeholder="Enter Last Name"
                                value={contact[FORM_FIELDS_NAMES.ADMIN_LAST_NAME]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={contactErrors[FORM_FIELDS_NAMES.ADMIN_LAST_NAME]}
                                touched={contactTouched[FORM_FIELDS_NAMES.ADMIN_LAST_NAME]}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <PhoneInput
                                label="Contact Number"
                                name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_PHONE}`}
                                value={contact[FORM_FIELDS_NAMES.ADMIN_PHONE]}
                                onChange={(val) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.ADMIN_PHONE}`, val || "")}
                                onBlur={handleBlur}
                                defaultCountry="US"
                              />
                              <Input
                                label="Email Address"
                                name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_EMAIL}`}
                                placeholder="Enter Email Address"
                                type="email"
                                value={contact[FORM_FIELDS_NAMES.ADMIN_EMAIL]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => push({ ...emptyContact })}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer w-fit"
                      >
                        <Icon name="Plus" size={16} />
                        Add
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
              <Button
                variant="outlineTeal"
                size="sm"
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primaryTeal"
                size="sm"
                type="button"
                onClick={handleSubmit}
                disabled={!(isValid && dirty)}
              >
                Create Sub-Organization
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
