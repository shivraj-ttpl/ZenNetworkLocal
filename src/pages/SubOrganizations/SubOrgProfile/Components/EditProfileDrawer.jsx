import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import UploadPhoto from "@/components/commonComponents/upload/UploadPhoto";
import {
  FORM_FIELDS_NAMES,
  STATE_OPTIONS,
  COUNTRY_OPTIONS,
} from "../constant";
import { setCloseDrawer } from "../subOrgProfileSlice";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: Yup.string().required("Sub-organization Name is required"),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string().email("Invalid email").required("Email is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required("Zip Code is required"),
});

const buildInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: editData?.name || "",
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contactInfo?.contactNumber || "",
  [FORM_FIELDS_NAMES.EMAIL]: editData?.contactInfo?.emailAddress || "",
  [FORM_FIELDS_NAMES.WEBSITE]: editData?.contactInfo?.website || "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.addressLine1 || "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.addressLine2 || "",
  [FORM_FIELDS_NAMES.STATE]: editData?.stateOption || null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.countryOption || null,
  [FORM_FIELDS_NAMES.CITY]: editData?.city || "",
  [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.zipCode || "",
  photo: null,
});

export default function EditProfileDrawer({ open, editData }) {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    handleClose();
  };

  return (
    <Drawer
      title="Edit Profile"
      open={open}
      close={handleClose}
      width="max-w-[50%] w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={buildInitialValues(editData)}
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
                  label="Profile Photo"
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
                    label="Sub-Organization Name"
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
                  handleClose();
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
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
