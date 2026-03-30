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
import { setCloseDrawer } from "../settingsUsersSlice";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required("First Name is required"),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required("Last Name is required"),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string().email("Invalid email").required("Email is required"),
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required("ZIP Code is required"),
});

const getInitialValues = (editData) => {
  const stateOption =
    STATE_OPTIONS.find(
      (opt) => opt.value === editData?.state || opt.label === editData?.state,
    ) ?? null;

  const countryOption =
    COUNTRY_OPTIONS.find(
      (opt) => opt.value === editData?.country || opt.label === editData?.country,
    ) ?? null;

  return {
    photo: null,
    [FORM_FIELDS_NAMES.FIRST_NAME]: editData?.firstName ?? "",
    [FORM_FIELDS_NAMES.LAST_NAME]: editData?.lastName ?? "",
    [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contactNumber ?? "",
    [FORM_FIELDS_NAMES.EMAIL]: editData?.email ?? "",
    [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.addressLine1 ?? "",
    [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.addressLine2 ?? "",
    [FORM_FIELDS_NAMES.STATE]: stateOption,
    [FORM_FIELDS_NAMES.COUNTRY]: countryOption,
    [FORM_FIELDS_NAMES.CITY]: editData?.city ?? "",
    [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.zipCode ?? "",
  };
};

export default function AddUserDrawer({ open, drawerMode, editData }) {
  const dispatch = useDispatch();
  const isEdit = drawerMode === "edit";

  const handleClose = () => dispatch(setCloseDrawer());

  const handleFormSubmit = (_, { resetForm }) => {
    resetForm();
    handleClose();
  };

  return (
    <Drawer
      title={isEdit ? "Edit User" : "Add User"}
      open={open}
      close={handleClose}
      width="w-full lg:w-[700px]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(editData)}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <Form className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto  flex gap-5">
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
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name={FORM_FIELDS_NAMES.FIRST_NAME}
                    placeholder="Enter First Name"
                    value={values[FORM_FIELDS_NAMES.FIRST_NAME]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.FIRST_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.FIRST_NAME]}
                    required
                  />
                  <Input
                    label="Last Name"
                    name={FORM_FIELDS_NAMES.LAST_NAME}
                    placeholder="Enter Last Name"
                    value={values[FORM_FIELDS_NAMES.LAST_NAME]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.LAST_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.LAST_NAME]}
                    required
                  />
                  <PhoneInput
                    label="Contact Number"
                    name={FORM_FIELDS_NAMES.CONTACT_NUMBER}
                    value={values[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                    onChange={(val) =>
                      setFieldValue(FORM_FIELDS_NAMES.CONTACT_NUMBER, val || "")
                    }
                    onBlur={handleBlur}
                    defaultCountry="US"
                    error={errors[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                    touched={touched[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                  />
                  <Input
                    label="Email Address"
                    name={FORM_FIELDS_NAMES.EMAIL}
                    placeholder="Enter Email Address"
                    type="email"
                    value={values[FORM_FIELDS_NAMES.EMAIL]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.EMAIL]}
                    touched={touched[FORM_FIELDS_NAMES.EMAIL]}
                    required
                  />
                </div>

                {/* Address Information */}
                <h4 className="text-sm font-semibold text-text-primary">
                  Address Information
                </h4>

                <Input
                  label="Address Line 1"
                  name={FORM_FIELDS_NAMES.ADDRESS_LINE_1}
                  placeholder="Enter Address Line 1"
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
                  placeholder="Enter Address Line 2"
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
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.STATE, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.STATE]}
                    touched={touched[FORM_FIELDS_NAMES.STATE]}
                    required
                  />
                  <SelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.COUNTRY}
                    placeholder="Select Country"
                    options={COUNTRY_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.COUNTRY]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.COUNTRY, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.COUNTRY]}
                    touched={touched[FORM_FIELDS_NAMES.COUNTRY]}
                    required
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
                    placeholder="Enter ZIP Code"
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
                variant="outlineBlue"
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
                variant="primaryBlue"
                size="sm"
                type="button"
                onClick={handleSubmit}
                disabled={isEdit ? !(isValid && dirty) : !isValid}
              >
                {isEdit ? "Save" : "Create User"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
