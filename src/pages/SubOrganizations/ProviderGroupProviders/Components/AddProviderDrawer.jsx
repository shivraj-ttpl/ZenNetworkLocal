import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import AsyncSelectDropdown from '@/components/commonComponents/selectDropdown/AsyncSelectDropdown';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import TextArea from '@/components/commonComponents/textArea';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import {
  GENDER_OPTIONS,
  PROVIDER_TYPE_OPTIONS,
  spcialitityOptions,
  timezoneOptions,
} from '@/constants/commonDropdownOptions';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { parsePhoneValue } from '@/utils/GeneralUtils';

import { FORM_FIELDS_NAMES } from '../constant';
import { providerGroupProvidersActions } from '../providerGroupProvidersSaga';
import { componentKey, setCloseDrawer } from '../providerGroupProvidersSlice';

const { createProvider, updateProvider } = providerGroupProvidersActions;
const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required(
    'First Name is required',
  ),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required('Last Name is required'),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required(
    'Address Line 1 is required',
  ),
  [FORM_FIELDS_NAMES.STATE]: Yup.object()
    .nullable()
    .required('State is required'),
  [FORM_FIELDS_NAMES.COUNTRY]: Yup.object()
    .nullable()
    .required('Country is required'),
  [FORM_FIELDS_NAMES.CITY]: Yup.string().required('City is required'),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required('ZIP Code is required'),
});

const getInitialValues = (editData) => ({
  photo: null,
  [FORM_FIELDS_NAMES.FIRST_NAME]: editData?.firstName || '',
  [FORM_FIELDS_NAMES.LAST_NAME]: editData?.lastName || '',
  [FORM_FIELDS_NAMES.GENDER]: editData?.gender
    ? GENDER_OPTIONS.find((o) => o.value === editData.gender) || null
    : null,
  [FORM_FIELDS_NAMES.EMAIL]: editData?.email || '',
  [FORM_FIELDS_NAMES.LANGUAGE]: editData?.language
    ? { name: editData.language }
    : null,
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contactNumber
    ? `${editData.countryCode || ''}${editData.contactNumber}`
    : '',
  [FORM_FIELDS_NAMES.PROVIDER_TYPE]: editData?.providerType
    ? PROVIDER_TYPE_OPTIONS.find((o) => o.value === editData.providerType) ||
      null
    : null,
  [FORM_FIELDS_NAMES.SPECIALTIES]:
    editData?.specialties?.map((s) => ({ label: s, value: s })) || null,
  [FORM_FIELDS_NAMES.PRIMARY_ROLE]: editData?.primaryRole
    ? { name: editData.primaryRole }
    : null,
  [FORM_FIELDS_NAMES.SECONDARY_ROLE]: editData?.secondaryRole
    ? { name: editData.secondaryRole }
    : null,
  [FORM_FIELDS_NAMES.NPI_NUMBER]: editData?.npiNumber || '',
  [FORM_FIELDS_NAMES.STATE_LICENSE]: editData?.stateLicense || '',
  [FORM_FIELDS_NAMES.YEARS_OF_EXPERIENCE]: editData?.yearsOfExperience || '',
  [FORM_FIELDS_NAMES.TIMEZONE]: editData?.timezone
    ? timezoneOptions.find((o) => o.value === editData.timezone) || null
    : null,
  [FORM_FIELDS_NAMES.BIO]: editData?.bio || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.address?.addressLine1 || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.address?.addressLine2 || '',
  [FORM_FIELDS_NAMES.STATE]: editData?.address?.state
    ? { name: editData.address.state }
    : null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.address?.country
    ? { name: editData.address.country }
    : null,
  [FORM_FIELDS_NAMES.CITY]: editData?.address?.city || '',
  [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.address?.zipCode || '',
});

export default function AddProviderDrawer() {
  const dispatch = useDispatch();
  const { subOrgId, providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();

  const {
    drawerOpen = false,
    drawerMode = '',
    editData = null,
    providerDetail = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isEdit = drawerMode === 'edit';
  const formData = isEdit ? providerDetail : null;
  const isCreating = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_POST_CREATE,
  );
  const isUpdating = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_PATCH_UPDATE,
  );
  const isSaving = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const { countryCode, nationalNumber: contactNumber } = parsePhoneValue(
      values[FORM_FIELDS_NAMES.CONTACT_NUMBER],
    );

    const data = {
      firstName: values[FORM_FIELDS_NAMES.FIRST_NAME],
      lastName: values[FORM_FIELDS_NAMES.LAST_NAME],
      gender: values[FORM_FIELDS_NAMES.GENDER]?.value || '',
      email: values[FORM_FIELDS_NAMES.EMAIL],
      language: values[FORM_FIELDS_NAMES.LANGUAGE]?.value || '',
      countryCode: countryCode || '',
      contactNumber: contactNumber || '',
      providerType: values[FORM_FIELDS_NAMES.PROVIDER_TYPE]?.value || '',
      specialties:
        values[FORM_FIELDS_NAMES.SPECIALTIES]?.map((s) => s.value) || [],
      primaryRoleTitle: values[FORM_FIELDS_NAMES.PRIMARY_ROLE]?.name || '',
      secondaryRoleTitle: values[FORM_FIELDS_NAMES.SECONDARY_ROLE]?.name || '',
      npiNumber: values[FORM_FIELDS_NAMES.NPI_NUMBER] || '',
      stateLicense: values[FORM_FIELDS_NAMES.STATE_LICENSE] || '',
      yearsOfExperience: values[FORM_FIELDS_NAMES.YEARS_OF_EXPERIENCE] || '',
      timezone: values[FORM_FIELDS_NAMES.TIMEZONE]?.value || '',
      bio: values[FORM_FIELDS_NAMES.BIO] || '',
      address: {
        addressLine1: values[FORM_FIELDS_NAMES.ADDRESS_LINE_1] || '',
        addressLine2: values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || '',
        city: values[FORM_FIELDS_NAMES.CITY] || '',
        state: values[FORM_FIELDS_NAMES.STATE]?.name || '',
        zipCode: values[FORM_FIELDS_NAMES.ZIP_CODE] || '',
        country: values[FORM_FIELDS_NAMES.COUNTRY]?.name || '',
      },
    };

    if (isEdit) {
      dispatch(updateProvider({ providerId: editData?.id, tenantName, data }));
    } else {
      dispatch(createProvider({ providerGroupId, tenantName, data }));
    }
  };

  const title = isEdit ? 'Edit Provider' : 'Add Provider';
  const submitLabel = isSaving
    ? 'Saving...'
    : isEdit
      ? 'Save'
      : 'Create Provider';

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[50%] w-[50%]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(formData)}
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
            <div className="flex-1 overflow-y-auto flex gap-6">
              {/* Photo Upload */}
              <div className="shrink-0 w-50">
                <UploadPhoto
                  name="photo"
                  label="Profile Photo"
                  maxFileSize={5}
                  onFileSelect={(file) => setFieldValue('photo', file)}
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-5">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="Gender"
                    name={FORM_FIELDS_NAMES.GENDER}
                    placeholder="Select Gender"
                    options={GENDER_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.GENDER]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.GENDER, selected)
                    }
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

                <div className="grid grid-cols-2 gap-4">
                  <AsyncSelectDropdown
                    label="Language"
                    name={FORM_FIELDS_NAMES.LANGUAGE}
                    placeholder="Select Language"
                    url="dropdown-apis/languages"
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.LANGUAGE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.LANGUAGE, selected)
                    }
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

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="Provider Type"
                    name={FORM_FIELDS_NAMES.PROVIDER_TYPE}
                    placeholder="Provider Type"
                    options={PROVIDER_TYPE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.PROVIDER_TYPE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.PROVIDER_TYPE, selected)
                    }
                  />
                  <SelectDropdown
                    label="Specialties"
                    name={FORM_FIELDS_NAMES.SPECIALTIES}
                    placeholder="Enter Specialty"
                    options={spcialitityOptions}
                    value={values[FORM_FIELDS_NAMES.SPECIALTIES]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.SPECIALTIES, selected)
                    }
                    isMulti
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AsyncSelectDropdown
                    label="Primary Role"
                    name={FORM_FIELDS_NAMES.PRIMARY_ROLE}
                    placeholder="Select Primary Role"
                    url={`dropdown-apis/roles/clinical?subOrgId=${subOrgId}`}
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.PRIMARY_ROLE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.PRIMARY_ROLE, selected)
                    }
                  />
                  <AsyncSelectDropdown
                    label="Secondary Role"
                    name={FORM_FIELDS_NAMES.SECONDARY_ROLE}
                    placeholder="Select Secondary Role"
                    url={`dropdown-apis/roles/clinical?subOrgId=${subOrgId}`}
                    valueKey="name"
                    labelKey="name"
                    value={values[FORM_FIELDS_NAMES.SECONDARY_ROLE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.SECONDARY_ROLE, selected)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="NPI Number"
                    name={FORM_FIELDS_NAMES.NPI_NUMBER}
                    placeholder="Enter NPI Number"
                    value={values[FORM_FIELDS_NAMES.NPI_NUMBER]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="State License"
                    name={FORM_FIELDS_NAMES.STATE_LICENSE}
                    placeholder="Enter State License"
                    value={values[FORM_FIELDS_NAMES.STATE_LICENSE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Years of Experience"
                    name={FORM_FIELDS_NAMES.YEARS_OF_EXPERIENCE}
                    placeholder="Enter Experience"
                    value={values[FORM_FIELDS_NAMES.YEARS_OF_EXPERIENCE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <SelectDropdown
                    label="Timezone"
                    name={FORM_FIELDS_NAMES.TIMEZONE}
                    placeholder="Select Time zone"
                    options={timezoneOptions}
                    value={values[FORM_FIELDS_NAMES.TIMEZONE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.TIMEZONE, selected)
                    }
                  />
                </div>

                <TextArea
                  label="Bio"
                  name={FORM_FIELDS_NAMES.BIO}
                  placeholder="Your message..."
                  value={values[FORM_FIELDS_NAMES.BIO]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                />

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
                    error={errors[FORM_FIELDS_NAMES.STATE]}
                    touched={touched[FORM_FIELDS_NAMES.STATE]}
                    onBlur={handleBlur}
                    required
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
                    error={errors[FORM_FIELDS_NAMES.COUNTRY]}
                    touched={touched[FORM_FIELDS_NAMES.COUNTRY]}
                    onBlur={handleBlur}
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
                disabled={!(isValid && dirty) || isSaving}
              >
                {submitLabel}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
