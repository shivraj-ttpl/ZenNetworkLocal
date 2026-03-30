import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import DatePicker from "@/components/commonComponents/datePicker/DatePicker";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import TextArea from "@/components/commonComponents/textArea";
import UploadPhoto from "@/components/commonComponents/upload/UploadPhoto";
import Button from "@/components/commonComponents/button/Button";

import {
  COUNTRY_OPTIONS,
  FORM_FIELDS_NAMES,
  ORGANIZATION_TYPE_OPTIONS,
  STATE_OPTIONS,
} from "../constant";

import { setCloseDrawer } from "../settingsProfileSlice";

const parseToYmd = (value) => {
  if (!value) return "";
  // Already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  // Expected: MM/DD/YYYY
  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";

  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
};

const extractZipCode = (address = "") => {
  const match = address.match(/\b\d{5}(?:-\d{4})?\b/);
  return match?.[0] ?? "";
};

const normalizeAddressParts = (address = "") =>
  String(address)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

const findStateOption = (address = "") => {
  const addr = String(address).toLowerCase();

  // Try full state name, then abbreviation match.
  return (
    STATE_OPTIONS.find(
      (opt) =>
        addr.includes(opt.label.toLowerCase()) ||
        new RegExp(`\\b${opt.value.toLowerCase()}\\b`).test(addr),
    ) ?? null
  );
};

const findCountryOption = (address = "") => {
  const addr = String(address).toLowerCase();
  return (
    COUNTRY_OPTIONS.find(
      (opt) =>
        addr.includes(opt.label.toLowerCase()) ||
        new RegExp(`\\b${opt.value.toLowerCase()}\\b`).test(addr),
    ) ?? null
  );
};

const findOrganizationTypeOption = (type = "") => {
  const t = String(type ?? "").trim();
  if (!t) return null;

  return (
    ORGANIZATION_TYPE_OPTIONS.find(
      (opt) => opt.label === t || opt.value === t,
    ) ?? null
  );
};

const extractCity = (address = "", stateOption = null) => {
  const parts = normalizeAddressParts(address);
  if (!parts.length) return "";

  // Case like: "Dallas Texas, United States, 75201"
  const stateNeedleLabel = stateOption?.label ?? "";
  const stateNeedleValue = stateOption?.value ?? "";

  const cityPart = parts.find((p) => {
    if (!stateNeedleLabel && !stateNeedleValue) return false;
    const lower = p.toLowerCase();
    return (
      (stateNeedleLabel && lower.includes(stateNeedleLabel.toLowerCase())) ||
      (stateNeedleValue && lower.includes(stateNeedleValue.toLowerCase()))
    );
  });

  if (cityPart) {
    let out = cityPart;
    if (stateNeedleLabel) out = out.replace(new RegExp(stateNeedleLabel, "i"), "");
    if (stateNeedleValue) out = out.replace(new RegExp(stateNeedleValue, "i"), "");
    const cleaned = out.replace(/\b\d{5}(?:-\d{4})?\b/g, "").trim();
    if (cleaned) return cleaned;

    // Example: "Chicago, IL 60601" => city is the segment before the state/zip segment.
    const idx = parts.indexOf(cityPart);
    if (idx > 0) return parts[idx - 1] || "";

    return "";
  }

  // Case like: "..., Chicago, IL 60601"
  if (parts.length >= 2) return parts[1] || "";
  return "";
};

const extractAddressLine1 = (address = "") => {
  const parts = normalizeAddressParts(address);
  return parts[0] ?? "";
};

const extractAddressLine2 = (address = "") => {
  const parts = normalizeAddressParts(address);
  const maybeLine2 = parts[1] ?? "";

  // Heuristic: only treat second segment as line2 if it looks like suite/unit/etc.
  if (/suite|ste\.?|unit|floor|apt|apartment/i.test(maybeLine2)) return maybeLine2;
  return "";
};

const getInitialValues = (editData) => {
  const address =
    editData?.contactInfo?.address ??
    editData?.organizationDetails?.address ??
    editData?.address ??
    "";

  const stateOption = findStateOption(address);
  const countryOption = findCountryOption(address);

  const primaryPhone =
    editData?.contactInfo?.contactNumber ??
    editData?.primaryContactNumber ??
    editData?.contactNumber ??
    "";

  const secondaryPhone =
    editData?.adminContacts?.[1]?.contactNumber ??
    editData?.secondaryContactNumber ??
    "";

  const createdOnRaw =
    editData?.organizationDetails?.createdOn ??
    editData?.organizationExtraDetails?.createdOn ??
    "";

  const organizationTypeRaw =
    editData?.organizationDetails?.organizationType ??
    editData?.organizationExtraDetails?.organizationType ??
    "";

  const descriptionRaw =
    editData?.organizationDetails?.description ??
    editData?.organizationExtraDetails?.description ??
    "";

  return {
    photo: null,
    [FORM_FIELDS_NAMES.ORGANIZATION_NAME]:
      editData?.name ??
      editData?.organizationDetails?.organizationName ??
      "",
    [FORM_FIELDS_NAMES.LEGAL_NAME]:
      editData?.legalName ??
      editData?.organizationDetails?.organizationLegalName ??
      "",
    [FORM_FIELDS_NAMES.LICENSE_NUMBER]:
      editData?.licenseNumber ?? editData?.license ?? "",
    [FORM_FIELDS_NAMES.TAX_ID]:
      editData?.taxId ?? editData?.organizationDetails?.taxId ?? "",
    [FORM_FIELDS_NAMES.ORGANIZATION_TYPE]:
      findOrganizationTypeOption(organizationTypeRaw),
    [FORM_FIELDS_NAMES.CREATED_ON]: parseToYmd(createdOnRaw),
    [FORM_FIELDS_NAMES.EMAIL_ADDRESS]:
      editData?.contactInfo?.emailAddress ?? editData?.email ?? "",
    [FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]: primaryPhone,
    [FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]: secondaryPhone,
    [FORM_FIELDS_NAMES.FAX_NUMBER]: editData?.contactInfo?.fax ?? "",
    [FORM_FIELDS_NAMES.WEBSITE_URL]: editData?.contactInfo?.website ?? "",
    [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: extractAddressLine1(address),
    [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: extractAddressLine2(address),
    [FORM_FIELDS_NAMES.STATE]: stateOption,
    [FORM_FIELDS_NAMES.COUNTRY]: countryOption,
    [FORM_FIELDS_NAMES.CITY]: extractCity(address, stateOption),
    [FORM_FIELDS_NAMES.ZIP_CODE]: extractZipCode(address),
    [FORM_FIELDS_NAMES.DESCRIPTION]: descriptionRaw ?? "",
  };
};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.ORGANIZATION_NAME]: Yup.string().required(
    "Organization Name is required",
  ),
  [FORM_FIELDS_NAMES.LEGAL_NAME]: Yup.string().required(
    "Legal Name is required",
  ),
  [FORM_FIELDS_NAMES.LICENSE_NUMBER]: Yup.string().required(
    "License Number is required",
  ),
  [FORM_FIELDS_NAMES.TAX_ID]: Yup.string().required("Tax ID is required"),
  [FORM_FIELDS_NAMES.ORGANIZATION_TYPE]: Yup.object()
    .nullable()
    .required("Organization Type is required"),
  [FORM_FIELDS_NAMES.CREATED_ON]: Yup.string().required("Created On is required"),
  [FORM_FIELDS_NAMES.EMAIL_ADDRESS]: Yup.string()
    .email("Invalid email")
    .required("Email Address is required"),
  [FORM_FIELDS_NAMES.PRIMARY_CONTACT_NUMBER]: Yup.string().required(
    "Primary Contact Number is required",
  ),
  [FORM_FIELDS_NAMES.FAX_NUMBER]: Yup.string().nullable(),
  [FORM_FIELDS_NAMES.WEBSITE_URL]: Yup.string()
    .nullable()
    .url("Invalid Website URL"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required(
    "Address Line 1 is required",
  ),
  [FORM_FIELDS_NAMES.STATE]: Yup.object().nullable().required("State is required"),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object().nullable().required("Country is required"),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required("City is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string()
    .required("ZIP CODE is required")
    .matches(/^\d{5}(?:-\d{4})?$/, "Invalid ZIP CODE"),
  [FORM_FIELDS_NAMES.DESCRIPTION]: Yup.string().nullable(),
});

export default function EditOrganizationProfileDrawer({
  open,
  drawerMode,
  editData,
}) {
  const dispatch = useDispatch();
  const isEdit = drawerMode === "edit";

  const handleClose = () => dispatch(setCloseDrawer());

  return (
    <Drawer
      title="Edit Organization Profile"
      open={open}
      close={handleClose}
      width="max-w-[85%] w-[900px]"
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
              <div className="flex gap-6 rounded-lg border border-border-light p-5">
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

                <div className="flex-1 space-y-5">
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
                        setFieldValue(
                          FORM_FIELDS_NAMES.ORGANIZATION_TYPE,
                          selected,
                        )
                      }
                      error={errors[FORM_FIELDS_NAMES.ORGANIZATION_TYPE]}
                      touched={touched[FORM_FIELDS_NAMES.ORGANIZATION_TYPE]}
                      required
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
                      required
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
                      required
                    />
                    <DatePicker
                      label="Created On"
                      name={FORM_FIELDS_NAMES.CREATED_ON}
                      isRequired
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
                      name={FORM_FIELDS_NAMES.EMAIL_ADDRESS}
                      placeholder="Enter Email Address"
                      value={values[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
                      touched={touched[FORM_FIELDS_NAMES.EMAIL_ADDRESS]}
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
                      required
                    />
                    <PhoneInput
                      label="Secondary Contact Number"
                      name={FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER}
                      value={values[FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER]}
                      onChange={(val) =>
                        setFieldValue(
                          FORM_FIELDS_NAMES.SECONDARY_CONTACT_NUMBER,
                          val || "",
                        )
                      }
                      onBlur={handleBlur}
                      defaultCountry="US"
                    />

                    <Input
                      label="Fax Number"
                      name={FORM_FIELDS_NAMES.FAX_NUMBER}
                      placeholder="Enter Fax Number"
                      value={values[FORM_FIELDS_NAMES.FAX_NUMBER]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors[FORM_FIELDS_NAMES.FAX_NUMBER]}
                      touched={touched[FORM_FIELDS_NAMES.FAX_NUMBER]}
                    />
                    <Input
                      label="Website URL"
                      name={FORM_FIELDS_NAMES.WEBSITE_URL}
                      placeholder="Enter Website URL"
                      value={values[FORM_FIELDS_NAMES.WEBSITE_URL]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors[FORM_FIELDS_NAMES.WEBSITE_URL]}
                      touched={touched[FORM_FIELDS_NAMES.WEBSITE_URL]}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-text-primary">
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

                    <TextArea
                      label="Description"
                      name={FORM_FIELDS_NAMES.DESCRIPTION}
                      placeholder="Enter Description"
                      value={values[FORM_FIELDS_NAMES.DESCRIPTION]}
                      onChangeCb={handleChange}
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between gap-2 border-t border-[#E9E9E9] pt-4">
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
                disabled={isEdit ? !(isValid && dirty) : !isValid}
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

