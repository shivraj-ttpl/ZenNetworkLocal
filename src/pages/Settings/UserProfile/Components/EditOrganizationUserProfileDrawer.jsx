import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import DatePicker from "@/components/commonComponents/datePicker/DatePicker";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import UploadPhoto from "@/components/commonComponents/upload/UploadPhoto";
import Button from "@/components/commonComponents/button/Button";

import {
  COUNTRY_OPTIONS,
  FORM_FIELDS_NAMES,
  ORGANIZATION_TYPE_OPTIONS,
  ROLE_OPTIONS,
  STATE_OPTIONS,
} from "../constant";

import { setCloseDrawer } from "../userProfileSlice";

const getInitialValues = (editData) => {
  const stateOption =
    STATE_OPTIONS.find(
      (opt) =>
        opt.value === editData?.state || opt.label === editData?.state,
    ) ?? null;

  const countryOption =
    COUNTRY_OPTIONS.find(
      (opt) =>
        opt.value === editData?.country || opt.label === editData?.country,
    ) ?? null;

  const roleOption =
    ROLE_OPTIONS.find(
      (opt) =>
        opt.value === editData?.roleName || opt.label === editData?.roleName,
    ) ?? null;

  const orgTypeOption =
    ORGANIZATION_TYPE_OPTIONS.find(
      (opt) =>
        opt.value === editData?.organizationType ||
        opt.label === editData?.organizationType,
    ) ?? null;

  return {
    [FORM_FIELDS_NAMES.PHOTO]: null,
    [FORM_FIELDS_NAMES.FIRST_NAME]: editData?.firstName ?? "",
    [FORM_FIELDS_NAMES.LAST_NAME]: editData?.lastName ?? "",
    [FORM_FIELDS_NAMES.EMAIL_ADDRESS]: editData?.emailAddress ?? editData?.email ?? "",
    [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contactNumber ?? editData?.phone ?? "",
    [FORM_FIELDS_NAMES.ROLE_NAME]: roleOption,
    [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.addressLine1 ?? "",
    [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.addressLine2 ?? "",
    [FORM_FIELDS_NAMES.STATE]: stateOption,
    [FORM_FIELDS_NAMES.COUNTRY]: countryOption,
    [FORM_FIELDS_NAMES.CITY]: editData?.city ?? "",
    [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.zipCode ?? "",
    [FORM_FIELDS_NAMES.ORGANIZATION_NAME]: editData?.organizationName ?? "",
    [FORM_FIELDS_NAMES.ORGANIZATION_TYPE]: orgTypeOption,
    [FORM_FIELDS_NAMES.LEGAL_NAME]: editData?.legalName ?? "",
    [FORM_FIELDS_NAMES.LICENSE_NUMBER]: editData?.licenseNumber ?? "",
    [FORM_FIELDS_NAMES.TAX_ID]: editData?.taxId ?? "",
    [FORM_FIELDS_NAMES.CREATED_ON]: editData?.createdOn ?? "",
    [FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS]: editData?.orgEmailAddress ?? "",
    [FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]: editData?.primaryContactNumber ?? "",
    [FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]: editData?.secondaryContactNumber ?? "",
  };
};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required("First Name is required"),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required("Last Name is required"),
  [FORM_FIELDS_NAMES.EMAIL_ADDRESS]: Yup.string()
    .email("Invalid email")
    .required("Email Address is required"),
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.ROLE_NAME]: Yup.object().nullable().required("Role Name is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string()
    .required("ZIP Code is required")
    .matches(/^\d{5}(?:-\d{4})?$/, "Invalid ZIP Code"),
  [FORM_FIELDS_NAMES.ORGANIZATION_NAME]: Yup.string().required("Organization Name is required"),
  [FORM_FIELDS_NAMES.ORGANIZATION_TYPE]: Yup.object().nullable(),
  [FORM_FIELDS_NAMES.LEGAL_NAME]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.LICENSE_NUMBER]: Yup.string().required("License Number is required"),
  [FORM_FIELDS_NAMES.TAX_ID]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.CREATED_ON]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS]: Yup.string()
    .email("Invalid email")
    .required("Email Address is required"),
  [FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]: Yup.string().nullable(),
});

export default function EditOrganizationUserProfileDrawer({
  open,
  drawerMode,
  editData,
}) {
  const dispatch = useDispatch();
  const isEdit = drawerMode === "edit";

  const handleClose = () => dispatch(setCloseDrawer());

  return (
    <Drawer
      title="Edit Profile"
      open={open}
      close={handleClose}
      width="w-full lg:w-[800px]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(editData)}
        validationSchema={validationSchema}
        onSubmit={(_, { resetForm }) => {
          resetForm();
          handleClose();
        }}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
          setFieldValue,
        }) => (
          <Form className="flex h-full flex-col">
            <div className=" flex-1 overflow-y-auto p-1">
              {/* User Info + Photo */}
              <div className="flex gap-6">
                <div className="w-[200px] flex-shrink-0">
                  <UploadPhoto
                    name={FORM_FIELDS_NAMES.PHOTO}
                    label="Profile Photo"
                    maxFileSize={5}
                    onFileSelect={(file) =>
                      setFieldValue(FORM_FIELDS_NAMES.PHOTO, file)
                    }
                  />
                </div>

                <div className="flex-1 space-y-4">
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
                    <Input
                      label="Email Address"
                      name={FORM_FIELDS_NAMES.EMAIL_ADDRESS}
                      placeholder="Enter Email Address"
                      value={values[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
                      touched={touched[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
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
                  </div>
                  <SelectDropdown
                    label="Role Name"
                    name={FORM_FIELDS_NAMES.ROLE_NAME}
                    placeholder="Select Role"
                    options={ROLE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.ROLE_NAME]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.ROLE_NAME, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.ROLE_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.ROLE_NAME]}
                    required
                    className="max-w-[calc(50%-8px)]"
                  />

                  {/* Address Information */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-base font-semibold text-text-primary">
                      Address Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
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
                        className="col-span-2"
                      />
                      <Input
                        label="Address Line 2"
                        name={FORM_FIELDS_NAMES.ADDRESS_LINE_2}
                        placeholder="Enter Address Line 2"
                        value={values[FORM_FIELDS_NAMES.ADDRESS_LINE_2]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.ADDRESS_LINE_2]}
                        touched={touched[FORM_FIELDS_NAMES.ADDRESS_LINE_2]}
                        className="col-span-2"
                      />
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

                  {/* Organization Details */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-base font-semibold text-text-primary">
                      Organization Details
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Organization Name"
                        name={FORM_FIELDS_NAMES.ORGANIZATION_NAME}
                        placeholder="Enter Organization Name"
                        value={values[FORM_FIELDS_NAMES.ORGANIZATION_NAME]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.ORGANIZATION_NAME]}
                        touched={touched[FORM_FIELDS_NAMES.ORGANIZATION_NAME]}
                        required
                      />
                      <SelectDropdown
                        label="Organization Type"
                        name={FORM_FIELDS_NAMES.ORGANIZATION_TYPE}
                        placeholder="Select Organization Type"
                        options={ORGANIZATION_TYPE_OPTIONS}
                        value={values[FORM_FIELDS_NAMES.ORGANIZATION_TYPE]}
                        onChange={(selected) =>
                          setFieldValue(FORM_FIELDS_NAMES.ORGANIZATION_TYPE, selected)
                        }
                        error={errors[FORM_FIELDS_NAMES.ORGANIZATION_TYPE]}
                        touched={touched[FORM_FIELDS_NAMES.ORGANIZATION_TYPE]}
                      />
                      <Input
                        label="Legal Name"
                        name={FORM_FIELDS_NAMES.LEGAL_NAME}
                        placeholder="Enter Legal Name"
                        value={values[FORM_FIELDS_NAMES.LEGAL_NAME]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.LEGAL_NAME]}
                        touched={touched[FORM_FIELDS_NAMES.LEGAL_NAME]}
                      />
                      <Input
                        label="License Number"
                        name={FORM_FIELDS_NAMES.LICENSE_NUMBER}
                        placeholder="Enter License Number"
                        value={values[FORM_FIELDS_NAMES.LICENSE_NUMBER]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.LICENSE_NUMBER]}
                        touched={touched[FORM_FIELDS_NAMES.LICENSE_NUMBER]}
                        required
                      />
                      <Input
                        label="Tax ID"
                        name={FORM_FIELDS_NAMES.TAX_ID}
                        placeholder="Enter Tax ID"
                        value={values[FORM_FIELDS_NAMES.TAX_ID]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.TAX_ID]}
                        touched={touched[FORM_FIELDS_NAMES.TAX_ID]}
                      />
                      <DatePicker
                        label="Created On"
                        name={FORM_FIELDS_NAMES.CREATED_ON}
                        value={values[FORM_FIELDS_NAMES.CREATED_ON]}
                        placeholder="Select Date"
                        onChangeCb={(val) =>
                          setFieldValue(FORM_FIELDS_NAMES.CREATED_ON, val)
                        }
                        error={errors[FORM_FIELDS_NAMES.CREATED_ON]}
                        touched={touched[FORM_FIELDS_NAMES.CREATED_ON]}
                        showMonthDropdown
                        showYearDropdown
                      />
                      <Input
                        label="Email Address"
                        name={FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS}
                        placeholder="Enter Email Address"
                        value={values[FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS]}
                        touched={touched[FORM_FIELDS_NAMES.ORG_EMAIL_ADDRESS]}
                        required
                        className="col-span-2"
                      />
                      <PhoneInput
                        label="Primary Contact Number"
                        name={FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER}
                        value={values[FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]}
                        onChange={(val) =>
                          setFieldValue(FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER, val || "")
                        }
                        onBlur={handleBlur}
                        defaultCountry="US"
                        error={errors[FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]}
                        touched={touched[FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]}
                      />
                      <PhoneInput
                        label="Secondary Contact Number"
                        name={FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER}
                        value={values[FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]}
                        onChange={(val) =>
                          setFieldValue(FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER, val || "")
                        }
                        onBlur={handleBlur}
                        defaultCountry="US"
                        error={errors[FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]}
                        touched={touched[FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between gap-2 border-t border-[#E9E9E9] pt-4">
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
                Create User
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
