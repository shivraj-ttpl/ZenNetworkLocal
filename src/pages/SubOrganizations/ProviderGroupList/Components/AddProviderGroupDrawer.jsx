import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import TextArea from "@/components/commonComponents/textArea";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import UploadPhoto from "@/components/commonComponents/upload/UploadPhoto";
import {
  FORM_FIELDS_NAMES,
  STATE_OPTIONS,
  COUNTRY_OPTIONS,
  SPECIALTIES_OPTIONS,
  TIMEZONE_OPTIONS,
} from "../constant";
import { setCloseDrawer } from "../providerGroupListSlice";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]: Yup.string().required("Provider Group Name is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required("Zip Code is required"),
});

const getInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]: editData?.name || "",
  [FORM_FIELDS_NAMES.EMAIL]: editData?.email || "",
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contact || "",
  [FORM_FIELDS_NAMES.SPECIALTIES]: editData?.specialties?.map((s) => ({ label: s, value: s })) || null,
  [FORM_FIELDS_NAMES.WEBSITE]: editData?.website || "",
  [FORM_FIELDS_NAMES.TIMEZONE]: editData?.timezoneOption || null,
  [FORM_FIELDS_NAMES.NOTES]: editData?.notes || "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.addressLine1 || "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.addressLine2 || "",
  [FORM_FIELDS_NAMES.STATE]: editData?.stateOption || null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.countryOption || null,
  [FORM_FIELDS_NAMES.CITY]: editData?.city || "",
  [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.zipCode || "",
  [FORM_FIELDS_NAMES.SAME_AS_PRIMARY]: false,
  [FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1]: editData?.billingAddressLine1 || "",
  [FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2]: editData?.billingAddressLine2 || "",
  [FORM_FIELDS_NAMES.BILLING_STATE]: editData?.billingStateOption || null,
  [FORM_FIELDS_NAMES.BILLING_COUNTRY]: editData?.billingCountryOption || null,
  [FORM_FIELDS_NAMES.BILLING_CITY]: editData?.billingCity || "",
  [FORM_FIELDS_NAMES.BILLING_ZIP_CODE]: editData?.billingZipCode || "",
  photo: null,
});

export default function AddProviderGroupDrawer({ open, drawerMode, editData }) {
  const isEdit = drawerMode === "edit";
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    handleClose();
  };

  const handleSameAsPrimary = (checked, values, setFieldValue) => {
    setFieldValue(FORM_FIELDS_NAMES.SAME_AS_PRIMARY, checked);
    if (checked) {
      setFieldValue(FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1, values[FORM_FIELDS_NAMES.ADDRESS_LINE_1]);
      setFieldValue(FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2, values[FORM_FIELDS_NAMES.ADDRESS_LINE_2]);
      setFieldValue(FORM_FIELDS_NAMES.BILLING_STATE, values[FORM_FIELDS_NAMES.STATE]);
      setFieldValue(FORM_FIELDS_NAMES.BILLING_COUNTRY, values[FORM_FIELDS_NAMES.COUNTRY]);
      setFieldValue(FORM_FIELDS_NAMES.BILLING_CITY, values[FORM_FIELDS_NAMES.CITY]);
      setFieldValue(FORM_FIELDS_NAMES.BILLING_ZIP_CODE, values[FORM_FIELDS_NAMES.ZIP_CODE]);
    }
  };

  return (
    <Drawer
      title={isEdit ? "Edit Provider Group" : "Add Provider Group"}
      open={open}
      close={handleClose}
      width="max-w-[50%] w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(editData)}
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
                {/* Provider Group Details */}
                <h4 className="text-sm font-semibold text-text-primary">Provider Group Details</h4>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Provider Group Name"
                    name={FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME}
                    placeholder="Enter provider group name"
                    value={values[FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]}
                    required
                  />
                  <Input
                    label="Email Address"
                    name={FORM_FIELDS_NAMES.EMAIL}
                    placeholder="username@example.com"
                    type="email"
                    value={values[FORM_FIELDS_NAMES.EMAIL]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <PhoneInput
                    label="Contact Number"
                    name={FORM_FIELDS_NAMES.CONTACT_NUMBER}
                    value={values[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                    onChange={(val) => setFieldValue(FORM_FIELDS_NAMES.CONTACT_NUMBER, val || "")}
                    onBlur={handleBlur}
                    defaultCountry="US"
                  />
                  <SelectDropdown
                    label="Specialties"
                    name={FORM_FIELDS_NAMES.SPECIALTIES}
                    placeholder="Select Specialties"
                    options={SPECIALTIES_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.SPECIALTIES]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.SPECIALTIES, selected)}
                    isMulti
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    name={FORM_FIELDS_NAMES.WEBSITE}
                    placeholder="Enter Website"
                    value={values[FORM_FIELDS_NAMES.WEBSITE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <SelectDropdown
                    label="Timezone"
                    name={FORM_FIELDS_NAMES.TIMEZONE}
                    placeholder="Select Timezone"
                    options={TIMEZONE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.TIMEZONE]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.TIMEZONE, selected)}
                  />
                </div>

                <TextArea
                  label="Notes"
                  name={FORM_FIELDS_NAMES.NOTES}
                  placeholder="Enter notes..."
                  value={values[FORM_FIELDS_NAMES.NOTES]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                />

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

                {/* Billing Address */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text-primary">Billing Address</h4>
                  <Checkbox
                    label="Same as Primary Address"
                    checked={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                    onChange={(e) => handleSameAsPrimary(e.target.checked, values, setFieldValue)}
                    variant="teal"
                    size="sm"
                  />
                </div>

                <Input
                  label="Address Line 1"
                  name={FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1}
                  placeholder="e.g., 221B Baker Street, Andheri West"
                  value={values[FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                />

                <Input
                  label="Address Line 2"
                  name={FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2}
                  placeholder="Enter"
                  value={values[FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="State"
                    name={FORM_FIELDS_NAMES.BILLING_STATE}
                    placeholder="Select State"
                    options={STATE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.BILLING_STATE]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.BILLING_STATE, selected)}
                    isDisabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                  <SelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.BILLING_COUNTRY}
                    placeholder="Select Country"
                    options={COUNTRY_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.BILLING_COUNTRY]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.BILLING_COUNTRY, selected)}
                    isDisabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name={FORM_FIELDS_NAMES.BILLING_CITY}
                    placeholder="Enter City"
                    value={values[FORM_FIELDS_NAMES.BILLING_CITY]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                  <Input
                    label="ZIP CODE"
                    name={FORM_FIELDS_NAMES.BILLING_ZIP_CODE}
                    placeholder="Enter Zip Code"
                    value={values[FORM_FIELDS_NAMES.BILLING_ZIP_CODE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
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
                {isEdit ? "Save" : "Create Provider Group"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
