import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import AsyncSelectDropdown from '@/components/commonComponents/selectDropdown/AsyncSelectDropdown';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import {
  buildPhoneValue,
  formatZipCode,
  toPascalCase,
} from '../../../../utils/GeneralUtils';
import { FORM_FIELDS_NAMES } from '../constant';
import { subOrgListActions } from '../subOrgListSaga';
import { componentKey, setDrawerOpen, setEditDrawer } from '../subOrgListSlice';

const { createSubOrganization, updateSubOrganization } = subOrgListActions;

const emptyContact = {
  [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: '',
  [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: '',
  [FORM_FIELDS_NAMES.ADMIN_EMAIL]: '',
  [FORM_FIELDS_NAMES.ADMIN_PHONE]: '',
};

const baseValidationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: Yup.string().required(
    'Sub-organization Name is required',
  ),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string().email('Invalid email'),
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

const defaultInitialValues = {
  [FORM_FIELDS_NAMES.SUB_ORG_NAME]: '',
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: '',
  [FORM_FIELDS_NAMES.EMAIL]: '',
  [FORM_FIELDS_NAMES.WEBSITE]: '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: '',
  [FORM_FIELDS_NAMES.STATE]: null,
  [FORM_FIELDS_NAMES.COUNTRY]: null,
  [FORM_FIELDS_NAMES.CITY]: '',
  [FORM_FIELDS_NAMES.ZIP_CODE]: '',
  [FORM_FIELDS_NAMES.COUNTY]: '',
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG]: null,
  [FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]: null,
  [FORM_FIELDS_NAMES.ADMIN_CONTACTS]: [{ ...emptyContact }],
};

function buildEditInitialValues(data) {
  const addr = data.address || {};
  const phone = buildPhoneValue(data.countryCode, data.contactNumber);

  const adminContacts =
    Array.isArray(data.admins) && data.admins.length
      ? data.admins.map((a) => ({
          id: a.id || null,
          [FORM_FIELDS_NAMES.ADMIN_FIRST_NAME]: a.firstName || '',
          [FORM_FIELDS_NAMES.ADMIN_LAST_NAME]: a.lastName || '',
          [FORM_FIELDS_NAMES.ADMIN_EMAIL]: a.email || '',
          [FORM_FIELDS_NAMES.ADMIN_PHONE]: buildPhoneValue(
            a.countryCode,
            a.contactNumber,
          ),
        }))
      : [{ ...emptyContact }];

  return {
    [FORM_FIELDS_NAMES.SUB_ORG_NAME]: data.name || '',
    [FORM_FIELDS_NAMES.CONTACT_NUMBER]: phone,
    [FORM_FIELDS_NAMES.EMAIL]: data.email || '',
    [FORM_FIELDS_NAMES.WEBSITE]: data.website || '',
    [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: addr.addressLine1 || '',
    [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: addr.addressLine2 || '',
    [FORM_FIELDS_NAMES.STATE]: addr.state ? { name: addr.state } : null,
    [FORM_FIELDS_NAMES.COUNTRY]: addr.country ? { name: addr.country } : null,
    [FORM_FIELDS_NAMES.CITY]: addr.city || '',
    [FORM_FIELDS_NAMES.ZIP_CODE]: formatZipCode(addr.zipCode),
    [FORM_FIELDS_NAMES.COUNTY]: addr.county || '',
    [FORM_FIELDS_NAMES.IMPORT_SUB_ORG]: null,
    [FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]: null,
    [FORM_FIELDS_NAMES.ADMIN_CONTACTS]: adminContacts,
  };
}

function buildPayload(values, showAdminSection) {
  const payload = {
    name: values[FORM_FIELDS_NAMES.SUB_ORG_NAME],
    address: {
      addressLine1: values[FORM_FIELDS_NAMES.ADDRESS_LINE_1],
      addressLine2: values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || '',
      city: values[FORM_FIELDS_NAMES.CITY],
      state: values[FORM_FIELDS_NAMES.STATE]?.name || '',
      zipCode: toPascalCase(values[FORM_FIELDS_NAMES.ZIP_CODE]),
      county: values[FORM_FIELDS_NAMES.COUNTY] || '',
      country: values[FORM_FIELDS_NAMES.COUNTRY]?.name,
    },
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
  if (values.profile) payload.profile = values.profile?.name;

  const importedAdmins = values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN];
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
        if (c.id) admin.id = c.id;
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

export default function AddSubOrgDrawer() {
  const dispatch = useDispatch();
  const [showAdminSection, setShowAdminSection] = useState(false);
  const drawerOpen = useSelector(
    (state) => state[componentKey]?.drawerOpen ?? false,
  );
  const editDrawer = useSelector(
    (state) => state[componentKey]?.editDrawer ?? { open: false, data: null },
  );

  const isEditMode = editDrawer.open && editDrawer.data;
  const isOpen = drawerOpen || editDrawer.open;
  const hasExistingAdmins =
    isEditMode &&
    Array.isArray(editDrawer.data?.admins) &&
    editDrawer.data.admins.length > 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hasExistingAdmins) setShowAdminSection(true);
  }, [hasExistingAdmins]);
  const isCreating = useLoadingKey(LOADING_KEYS.SUB_ORG_LIST_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.SUB_ORG_LIST_PATCH_UPDATE);
  const isSubmitting = isEditMode ? isUpdating : isCreating;

  const initialValues = useMemo(
    () =>
      isEditMode
        ? buildEditInitialValues(editDrawer.data)
        : defaultInitialValues,
    [isEditMode, editDrawer.data],
  );

  const handleClose = () => {
    setShowAdminSection(false);
    if (isEditMode) {
      dispatch(setEditDrawer({ open: false, data: null }));
    } else {
      dispatch(setDrawerOpen(false));
    }
  };

  const handleFormSubmit = (values) => {
    const data = buildPayload(values, showAdminSection);
    if (isEditMode) {
      dispatch(updateSubOrganization({ id: editDrawer.data.id, data }));
    } else {
      dispatch(createSubOrganization({ data }));
    }
  };

  return (
    <Drawer
      title={isEditMode ? 'Edit Sub-Organization' : 'Add Sub-Organization'}
      open={isOpen}
      close={handleClose}
      width="max-w-[90%] w-[90%]  lg:w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={initialValues}
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
            <div className="flex-1 overflow-y-auto  flex flex-col sm:flex-row gap-6">
              {/* Photo Upload */}
              <div className="shrink-0 w-full sm:w-50">
                <UploadPhoto
                  name="profile"
                  label="Upload a Photo"
                  maxFileSize={5}
                  onFileSelect={(file) => setFieldValue('profile', file)}
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-5">
                <h4 className="text-sm font-semibold text-text-primary">
                  Demographics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onChange={(val) =>
                      setFieldValue(FORM_FIELDS_NAMES.CONTACT_NUMBER, val || '')
                    }
                    onBlur={handleBlur}
                    defaultCountry="US"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    value={values[FORM_FIELDS_NAMES.STATE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.STATE, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.STATE]}
                    touched={touched[FORM_FIELDS_NAMES.STATE]}
                    required
                    valueKey="name"
                    labelKey="name"
                  />
                  <AsyncSelectDropdown
                    label="Country"
                    name={FORM_FIELDS_NAMES.COUNTRY}
                    placeholder="Select Country"
                    url="dropdown-apis/countries"
                    value={values[FORM_FIELDS_NAMES.COUNTRY]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.COUNTRY, selected)
                    }
                    valueKey="name"
                    labelKey="name"
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
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 5)
                        val = `${val.slice(0, 5)}-${val.slice(5, 9)}`;
                      setFieldValue(FORM_FIELDS_NAMES.ZIP_CODE, val);
                    }}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.ZIP_CODE]}
                    touched={touched[FORM_FIELDS_NAMES.ZIP_CODE]}
                    required
                  />
                </div>

                {/* Import + Admin Contact — wrapped in shared border */}
                <div className="flex flex-col gap-4 border border-border rounded-lg p-4">
                  {/* Import from Another Sub-Organization */}
                  <h4 className="text-sm font-semibold text-text-primary">
                    Import from Another Sub-Organization
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                      <AsyncSelectDropdown
                        label="Sub-Organization"
                        name={FORM_FIELDS_NAMES.IMPORT_SUB_ORG}
                        placeholder="Select Sub-Organization"
                        url="dropdown-apis/sub-organizations"
                        value={values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG]}
                        onChange={(selected) => {
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_SUB_ORG,
                            selected,
                          );
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN,
                            null,
                          );
                        }}
                        valueKey="id"
                        labelKey="name"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <AsyncSelectDropdown
                        key={
                          values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG]?.id ??
                          'no-suborg'
                        }
                        label="Sub-Organization Admin"
                        name={FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN}
                        placeholder="Search by Name/Email"
                        url={`dropdown-apis/sub-org/admins?subOrgId=${values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG]?.id}`}
                        value={values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN]}
                        onChange={(selected) =>
                          setFieldValue(
                            FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN,
                            selected,
                          )
                        }
                        disabled={!values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG]}
                        isMulti
                        valueKey="id"
                        labelKey="firstName"
                        labelKey2="lastName"
                        required
                      />
                    </div>
                  </div>

                  {/* Selected Sub-Organization Admin */}
                  {Array.isArray(
                    values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN],
                  ) &&
                    values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN].length >
                      0 && (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-text-primary">
                          Selected Sub-Organization Admin
                          <span className="text-error-500 ml-0.5">*</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {values[FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN].map(
                            (admin, i) => (
                              <span
                                key={admin.id ?? i}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium"
                              >
                                {admin.firstName} {admin.lastName}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = values[
                                      FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN
                                    ].filter((_, idx) => idx !== i);
                                    setFieldValue(
                                      FORM_FIELDS_NAMES.IMPORT_SUB_ORG_ADMIN,
                                      updated,
                                    );
                                  }}
                                  className="text-primary-400 hover:text-primary-700 cursor-pointer"
                                >
                                  <Icon name="X" size={12} />
                                </button>
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  <p className="text-xs text-text-secondary">
                    You can either import an existing Sub-Organization Admin or
                    create a new one by providing the details below
                  </p>

                  {/* OR Divider */}
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
                        Administrative Contact Details
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
                disabled={!(isValid && dirty) || isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Save Changes'
                    : 'Create Sub-Organization'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
