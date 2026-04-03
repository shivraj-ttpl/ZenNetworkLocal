import { useEffect, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { parsePhoneNumber } from 'react-phone-number-input';

import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import AsyncSelectDropdown from '@/components/commonComponents/selectDropdown/AsyncSelectDropdown';
import TextArea from '@/components/commonComponents/textArea';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Icon from '@/components/icons/Icon';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { formatZipCode } from '@/utils/GeneralUtils';

import { FORM_FIELDS_NAMES } from '../constant';
import { componentKey, setCloseDrawer } from '../providerGroupListSlice';
import { providerGroupListActions } from '../providerGroupListSaga';

const { createProviderGroup } = providerGroupListActions;

const emptyContact = {
  [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: '',
  [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: '',
  [FORM_FIELDS_NAMES.ADMIN_EMAIL]: '',
  [FORM_FIELDS_NAMES.ADMIN_PHONE]: '',
};

const baseValidationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]: Yup.string().required(
    'Provider Group Name is required',
  ),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required(
    'Address Line 1 is required',
  ),
  [FORM_FIELDS_NAMES.STATE]: Yup.object()
    .nullable()
    .required('State is required'),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required('City is required'),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string()
    .required('ZIP Code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Enter valid ZIP (12345 or 12345-6789)'),
});

const fullValidationSchema = baseValidationSchema.shape({
  [FORM_FIELDS_NAMES.ADMIN_CONTACTS]: Yup.array().of(
    Yup.object().shape({
      [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: Yup.string().required(
        'First Name is required',
      ),
      [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: Yup.string().required(
        'Last Name is required',
      ),
      [FORM_FIELDS_NAMES.ADMIN_EMAIL]: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    }),
  ),
});

const getInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME]: editData?.name ?? '',
  [FORM_FIELDS_NAMES.EMAIL]: editData?.email ?? '',
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]:
    editData?.countryCode && editData?.contactNumber
      ? `${editData.countryCode}${editData.contactNumber}`
      : editData?.contactNumber ?? '',
  [FORM_FIELDS_NAMES.SPECIALTIES]: editData?.specialties
    ? editData.specialties.map((s) => (typeof s === 'string' ? { id: s.id, name: s.name } : s))
    : null,
  [FORM_FIELDS_NAMES.WEBSITE]: editData?.website ?? '',
  [FORM_FIELDS_NAMES.TIMEZONE]: editData?.timezone
    ? { value: editData.timezone, label: editData.timezone }
    : null,
  [FORM_FIELDS_NAMES.NOTES]: editData?.notes ?? '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.primaryAddress?.addressLine1 ?? '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.primaryAddress?.addressLine2 ?? '',
  [FORM_FIELDS_NAMES.STATE]: editData?.primaryAddress?.state
    ? { name: editData.primaryAddress.state }
    : null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.primaryAddress?.country
    ? { name: editData.primaryAddress.country }
    : null,
  [FORM_FIELDS_NAMES.CITY]: editData?.primaryAddress?.city ?? '',
  [FORM_FIELDS_NAMES.ZIP_CODE]: formatZipCode(editData?.primaryAddress?.zipCode) ?? '',
  [FORM_FIELDS_NAMES.SAME_AS_PRIMARY]: editData?.billingAddressSameAsPrimary ?? false,
  [FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1]: editData?.billingAddress?.addressLine1 ?? '',
  [FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2]: editData?.billingAddress?.addressLine2 ?? '',
  [FORM_FIELDS_NAMES.BILLING_STATE]: editData?.billingAddress?.state
    ? { name: editData.billingAddress.state }
    : null,
  [FORM_FIELDS_NAMES.BILLING_COUNTRY]: editData?.billingAddress?.country
    ? { name: editData.billingAddress.country }
    : null,
  [FORM_FIELDS_NAMES.BILLING_CITY]: editData?.billingAddress?.city ?? '',
  [FORM_FIELDS_NAMES.BILLING_ZIP_CODE]: formatZipCode(editData?.billingAddress?.zipCode) ?? '',
  [FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP]: null,
  [FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN]: null,
  [FORM_FIELDS_NAMES.ADMIN_CONTACTS]:
    editData?.userProviderGroups?.length
      ? editData.userProviderGroups.map((u) => ({
          [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: u.firstName ?? '',
          [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: u.lastName ?? '',
          [FORM_FIELDS_NAMES.ADMIN_EMAIL]: u.email ?? '',
          [FORM_FIELDS_NAMES.ADMIN_PHONE]:
            u.countryCode && u.contactNumber
              ? `${u.countryCode}${u.contactNumber}`
              : u.contactNumber ?? '',
        }))
      : [{ ...emptyContact }],
  photo: null,
});

function buildPayload(values, showAdminSection) {
  const payload = {
    name: values[FORM_FIELDS_NAMES.PROVIDER_GROUP_NAME],
    address: {
      addressLine1: values[FORM_FIELDS_NAMES.ADDRESS_LINE_1],
      addressLine2: values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || undefined,
      city: values[FORM_FIELDS_NAMES.CITY],
      state: values[FORM_FIELDS_NAMES.STATE]?.name || values[FORM_FIELDS_NAMES.STATE]?.value || '',
      zipCode: values[FORM_FIELDS_NAMES.ZIP_CODE],
      country: values[FORM_FIELDS_NAMES.COUNTRY]?.name || values[FORM_FIELDS_NAMES.COUNTRY]?.value,
    },
    billingAddressSameAsPrimary: values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY],
  };

  if (values[FORM_FIELDS_NAMES.EMAIL])
    payload.email = values[FORM_FIELDS_NAMES.EMAIL];
  if (values[FORM_FIELDS_NAMES.CONTACT_NUMBER]) {
    const parsed = parsePhoneNumber(values[FORM_FIELDS_NAMES.CONTACT_NUMBER]);
    if (parsed?.countryCallingCode)
      payload.countryCode = `+${parsed.countryCallingCode}`;
    payload.contactNumber =
      parsed?.nationalNumber || values[FORM_FIELDS_NAMES.CONTACT_NUMBER];
  }
  if (values[FORM_FIELDS_NAMES.WEBSITE])
    payload.website = values[FORM_FIELDS_NAMES.WEBSITE];
  if (values[FORM_FIELDS_NAMES.TIMEZONE])
    payload.timezone = values[FORM_FIELDS_NAMES.TIMEZONE].value;
  if (values[FORM_FIELDS_NAMES.NOTES])
    payload.notes = values[FORM_FIELDS_NAMES.NOTES];
  if (values[FORM_FIELDS_NAMES.SPECIALTIES]) {
    payload.specialties = Array.isArray(values[FORM_FIELDS_NAMES.SPECIALTIES])
      ? values[FORM_FIELDS_NAMES.SPECIALTIES].map((s) => s.id)
      : [];
  }

  if (!values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]) {
    payload.billingAddress = {
      addressLine1: values[FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_1] || undefined,
      addressLine2: values[FORM_FIELDS_NAMES.BILLING_ADDRESS_LINE_2] || undefined,
      city: values[FORM_FIELDS_NAMES.BILLING_CITY] || undefined,
      state: values[FORM_FIELDS_NAMES.BILLING_STATE]?.name || values[FORM_FIELDS_NAMES.BILLING_STATE]?.value || undefined,
      zipCode: values[FORM_FIELDS_NAMES.BILLING_ZIP_CODE] || undefined,
      country: values[FORM_FIELDS_NAMES.BILLING_COUNTRY]?.name || values[FORM_FIELDS_NAMES.BILLING_COUNTRY]?.value || undefined,
    };
  }

  const importedAdmins = values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN];
  if (Array.isArray(importedAdmins) && importedAdmins.length) {
    payload.adminUserIds = importedAdmins.map((a) => a.id);
  }

  if (showAdminSection) {
    const adminUsers = values[FORM_FIELDS_NAMES.ADMIN_CONTACTS]
      .filter(
        (c) =>
          c[FORM_FIELDS_NAMES.ADMIN_FIRST_NAME] &&
          c[FORM_FIELDS_NAMES.ADMIN_LAST_NAME] &&
          c[FORM_FIELDS_NAMES.ADMIN_EMAIL],
      )
      .map((c) => {
        const admin = {
          firstName: c[FORM_FIELDS_NAMES.ADMIN_FIRST_NAME],
          lastName: c[FORM_FIELDS_NAMES.ADMIN_LAST_NAME],
          email: c[FORM_FIELDS_NAMES.ADMIN_EMAIL],
        };
        if (c[FORM_FIELDS_NAMES.ADMIN_PHONE]) {
          const parsed = parsePhoneNumber(c[FORM_FIELDS_NAMES.ADMIN_PHONE]);
          if (parsed?.countryCallingCode)
            admin.countryCode = `+${parsed.countryCallingCode}`;
          admin.contactNumber =
            parsed?.nationalNumber || c[FORM_FIELDS_NAMES.ADMIN_PHONE];
        }
        return admin;
      });
    if (adminUsers.length) payload.adminUsers = adminUsers;
  }

  return payload;
}

export default function AddProviderGroupDrawer({ subOrgId, drawerMode, editData }) {
  const dispatch = useDispatch();
  const [showAdminSection, setShowAdminSection] = useState(false);
  const drawerOpen = useSelector(
    (state) => state[componentKey]?.drawerOpen ?? false,
  );
  const isCreating = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_LIST_POST_CREATE);
  const isEdit = drawerMode === 'edit';

  useEffect(() => {
    if (isEdit && editData?.userProviderGroups?.length) {
      setShowAdminSection(true);
    }
  }, [isEdit, editData]);

  const handleClose = () => {
    setShowAdminSection(false);
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = buildPayload(values, showAdminSection);
    if (isEdit) {
      dispatch(providerGroupListActions.updateProviderGroup({ id: editData?.id, subOrgId, data }));
    } else {
      dispatch(createProviderGroup({ subOrgId, data }));
    }
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
      title={isEdit ? 'Edit Provider Group' : 'Add Provider Group'}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[90%] w-[90%] lg:w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(editData)}
        validationSchema={
          showAdminSection ? fullValidationSchema : baseValidationSchema
        }
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
          setErrors,
          resetForm,
        }) => (
          <Form className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto flex flex-col sm:flex-row gap-6">
              <div className="shrink-0 w-full sm:w-50">
                <UploadPhoto
                  name="photo"
                  label="Profile Photo"
                  maxFileSize={5}
                  onFileSelect={(file) => setFieldValue('photo', file)}
                />
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <h4 className="text-sm font-semibold text-text-primary">
                  Provider Group Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PhoneInput
                    label="Contact Number"
                    name={FORM_FIELDS_NAMES.CONTACT_NUMBER}
                    value={values[FORM_FIELDS_NAMES.CONTACT_NUMBER]}
                    onChange={(val) =>
                      setFieldValue(
                        FORM_FIELDS_NAMES.CONTACT_NUMBER,
                        val || '',
                      )
                    }
                    onBlur={handleBlur}
                    defaultCountry="US"
                  />
                  <AsyncSelectDropdown
                    label="Specialties"
                    name={FORM_FIELDS_NAMES.SPECIALTIES}
                    placeholder="Select Specialties"
                    url="dropdown-apis/specialties"
                    value={values[FORM_FIELDS_NAMES.SPECIALTIES]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.SPECIALTIES, selected)
                    }
                    isMulti
                    valueKey="id"
                    labelKey="name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    name={FORM_FIELDS_NAMES.WEBSITE}
                    placeholder="Enter Website"
                    value={values[FORM_FIELDS_NAMES.WEBSITE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <AsyncSelectDropdown
                    label="Timezone"
                    name={FORM_FIELDS_NAMES.TIMEZONE}
                    placeholder="Select Timezone"
                    url="dropdown-apis/timezones"
                    valueKey="value"
                    labelKey="label"
                    value={values[FORM_FIELDS_NAMES.TIMEZONE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.TIMEZONE, selected)
                    }
                  />
                </div>

                <TextArea
                  label="Notes"
                  name={FORM_FIELDS_NAMES.NOTES}
                  placeholder="Enter notes..."
                  value={values[FORM_FIELDS_NAMES.NOTES]}
                  onChangeCb={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                />

                <h4 className="text-sm font-semibold text-text-primary">
                  Address Information
                </h4>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AsyncSelectDropdown
                    label="State"
                    name={FORM_FIELDS_NAMES.STATE}
                    placeholder="Select State"
                    url="dropdown-apis/states"
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.STATE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.STATE, selected)
                    }
                    required
                    error={errors[FORM_FIELDS_NAMES.STATE]}
                    touched={touched[FORM_FIELDS_NAMES.STATE]}
                  />
                  <AsyncSelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.COUNTRY}
                    placeholder="Select Country"
                    url="dropdown-apis/countries"
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.COUNTRY]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.COUNTRY, selected)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      setFieldValue(FORM_FIELDS_NAMES.ZIP_CODE, formatZipCode(e.target.value))
                    }
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.ZIP_CODE]}
                    touched={touched[FORM_FIELDS_NAMES.ZIP_CODE]}
                    required
                  />
                </div>

                {/* Billing Address */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text-primary">
                    Billing Address
                  </h4>
                  <Checkbox
                    label="Same as Primary Address"
                    checked={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                    onChange={(e) =>
                      handleSameAsPrimary(
                        e.target.checked,
                        values,
                        setFieldValue,
                      )
                    }
                    variant="blue"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AsyncSelectDropdown
                    label="State"
                    name={FORM_FIELDS_NAMES.BILLING_STATE}
                    placeholder="Select State"
                    url="dropdown-apis/states"
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.BILLING_STATE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.BILLING_STATE, selected)
                    }
                    isDisabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                  <AsyncSelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.BILLING_COUNTRY}
                    placeholder="Select Country"
                    url="dropdown-apis/countries"
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.BILLING_COUNTRY]}
                    onChange={(selected) =>
                      setFieldValue(
                        FORM_FIELDS_NAMES.BILLING_COUNTRY,
                        selected,
                      )
                    }
                    isDisabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      setFieldValue(FORM_FIELDS_NAMES.BILLING_ZIP_CODE, formatZipCode(e.target.value))
                    }
                    onBlur={handleBlur}
                    disabled={values[FORM_FIELDS_NAMES.SAME_AS_PRIMARY]}
                  />
                </div>

                {/* Import + Admin Contact */}
                <div className="flex flex-col gap-4 border border-border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-text-primary">
                    Import from another Provider Group
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                      <AsyncSelectDropdown
                        label="Provider Group"
                        name={FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP}
                        placeholder="Select Provider Group"
                        url={`dropdown-apis/provider-groups?subOrgId=${subOrgId}`}
                        value={
                          values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP]
                        }
                        onChange={(selected) => {
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP,
                            selected,
                          );
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN,
                            null,
                          );
                        }}
                        valueKey="id"
                        labelKey="name"
                      />
                    </div>
                    <div className="flex-1">
                      <AsyncSelectDropdown
                        key={
                          values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP]?.id ??
                          'no-pg'
                        }
                        label="Provider Group Admin"
                        name={FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN}
                        placeholder="Search by Name/Email"
                        url={`dropdown-apis/provider-groups/admins?subOrgId=${subOrgId}`}
                        value={
                          values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN]
                        }
                        onChange={(selected) =>
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN,
                            selected,
                          )
                        }
                        disabled={
                          !values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP]
                        }
                        isMulti
                        valueKey="id"
                        labelKey="firstName"
                        labelKey2="lastName"
                      />
                    </div>
                  </div>

                  {/* Selected Provider Group Admin chips */}
                  {Array.isArray(
                    values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN],
                  ) &&
                    values[FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN]
                      .length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-text-primary">
                          Selected Provider Group Admin
                          <span className="text-error-500 ml-0.5">*</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {values[
                            FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN
                          ].map((admin, i) => (
                            <span
                              key={admin.id ?? i}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium"
                            >
                              {admin.firstName} {admin.lastName}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = values[
                                    FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN
                                  ].filter((_, idx) => idx !== i);
                                  setFieldValue(
                                    FORM_FIELDS_NAMES.IMPORT_PROVIDER_GROUP_ADMIN,
                                    updated,
                                  );
                                }}
                                className="text-primary-400 hover:text-primary-700 cursor-pointer"
                              >
                                <Icon name="X" size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <p className="text-xs text-text-secondary">
                    You can either import an existing Provider Group Admin or
                    create a new one by providing the details below
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs font-medium text-text-secondary px-1">
                      OR
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {!showAdminSection && (
                    <button
                      type="button"
                      onClick={() => setShowAdminSection(true)}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer w-fit"
                    >
                      <Icon name="Plus" size={16} />
                      Add Manually
                    </button>
                  )}

                  {showAdminSection && (
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-text-primary">
                        Provider Group Details
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminSection(false);
                          setFieldValue(
                            FORM_FIELDS_NAMES.ADMIN_CONTACTS,
                            [{ ...emptyContact }],
                            false,
                          );
                          const clearedErrors = { ...errors };
                          delete clearedErrors[
                            FORM_FIELDS_NAMES.ADMIN_CONTACTS
                          ];
                          setErrors(clearedErrors);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-error-500 cursor-pointer"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  )}

                  {showAdminSection && (
                    <FieldArray name={FORM_FIELDS_NAMES.ADMIN_CONTACTS}>
                      {({ push, remove }) => (
                        <div className="flex flex-col gap-5">
                          {values[FORM_FIELDS_NAMES.ADMIN_CONTACTS].map(
                            (contact, index) => {
                              const prefix = `${FORM_FIELDS_NAMES.ADMIN_CONTACTS}[${index}]`;
                              const contactErrors =
                                errors?.[FORM_FIELDS_NAMES.ADMIN_CONTACTS]?.[
                                  index
                                ] || {};
                              const contactTouched =
                                touched?.[FORM_FIELDS_NAMES.ADMIN_CONTACTS]?.[
                                  index
                                ] || {};

                              return (
                                <div
                                  key={index}
                                  className="flex flex-col gap-4 relative border border-border-light rounded-lg p-4"
                                >
                                  {values[FORM_FIELDS_NAMES.ADMIN_CONTACTS]
                                    .length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-error-500 cursor-pointer"
                                    >
                                      <Icon name="X" size={14} />
                                    </button>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                      label="First Name"
                                      name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_FIRST_NAME}`}
                                      placeholder="Enter First Name"
                                      value={
                                        contact[
                                          FORM_FIELDS_NAMES.ADMIN_FIRST_NAME
                                        ]
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        contactErrors[
                                          FORM_FIELDS_NAMES.ADMIN_FIRST_NAME
                                        ]
                                      }
                                      touched={
                                        contactTouched[
                                          FORM_FIELDS_NAMES.ADMIN_FIRST_NAME
                                        ]
                                      }
                                      required
                                    />
                                    <Input
                                      label="Last Name"
                                      name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_LAST_NAME}`}
                                      placeholder="Enter Last Name"
                                      value={
                                        contact[
                                          FORM_FIELDS_NAMES.ADMIN_LAST_NAME
                                        ]
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        contactErrors[
                                          FORM_FIELDS_NAMES.ADMIN_LAST_NAME
                                        ]
                                      }
                                      touched={
                                        contactTouched[
                                          FORM_FIELDS_NAMES.ADMIN_LAST_NAME
                                        ]
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PhoneInput
                                      label="Contact Number"
                                      name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_PHONE}`}
                                      value={
                                        contact[FORM_FIELDS_NAMES.ADMIN_PHONE]
                                      }
                                      onChange={(val) =>
                                        setFieldValue(
                                          `${prefix}.${FORM_FIELDS_NAMES.ADMIN_PHONE}`,
                                          val || '',
                                        )
                                      }
                                      onBlur={handleBlur}
                                      defaultCountry="US"
                                    />
                                    <Input
                                      label="Email Address"
                                      name={`${prefix}.${FORM_FIELDS_NAMES.ADMIN_EMAIL}`}
                                      placeholder="Enter Email Address"
                                      type="email"
                                      value={
                                        contact[FORM_FIELDS_NAMES.ADMIN_EMAIL]
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        contactErrors[
                                          FORM_FIELDS_NAMES.ADMIN_EMAIL
                                        ]
                                      }
                                      touched={
                                        contactTouched[
                                          FORM_FIELDS_NAMES.ADMIN_EMAIL
                                        ]
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              );
                            },
                          )}

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
                  )}
                </div>
              </div>
            </div>

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
                disabled={!(isValid && dirty) || isCreating}
              >
                {isCreating ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Provider Group')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
