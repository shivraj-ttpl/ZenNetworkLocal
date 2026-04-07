import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import TextArea from '@/components/commonComponents/textArea';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import {
  spcialitityOptions,
  timezoneOptions,
} from '@/constants/commonDropdownOptions';

import {
  COUNTRY_OPTIONS,
  FORM_FIELDS_NAMES,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  PROVIDER_TYPE_OPTIONS,
  ROLE_OPTIONS,
  STATE_OPTIONS,
} from '../constant';
import { setCloseDrawer } from '../providerGroupProvidersSlice';

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required(
    'First Name is required',
  ),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required('Last Name is required'),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required(
    'Address Line 1 is required',
  ),
});

const getInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.FIRST_NAME]: editData?.firstName || '',
  [FORM_FIELDS_NAMES.LAST_NAME]: editData?.lastName || '',
  [FORM_FIELDS_NAMES.GENDER]: editData?.genderOption || null,
  [FORM_FIELDS_NAMES.EMAIL]: editData?.email || '',
  [FORM_FIELDS_NAMES.LANGUAGE]: editData?.languageOption || null,
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contact || '',
  [FORM_FIELDS_NAMES.PROVIDER_TYPE]: editData?.providerTypeOption || null,
  [FORM_FIELDS_NAMES.SPECIALTIES]:
    editData?.specialties?.map((s) => ({ label: s, value: s })) || null,
  [FORM_FIELDS_NAMES.PRIMARY_ROLE]: editData?.primaryRoleOption || null,
  [FORM_FIELDS_NAMES.SECONDARY_ROLE]: editData?.secondaryRoleOption || null,
  [FORM_FIELDS_NAMES.NPI_NUMBER]: editData?.npiNumber || '',
  [FORM_FIELDS_NAMES.STATE_LICENSE]: editData?.stateLicense || '',
  [FORM_FIELDS_NAMES.YEARS_OF_EXPERIENCE]: editData?.yearsOfExperience || '',
  [FORM_FIELDS_NAMES.TIMEZONE]: editData?.timezoneOption || null,
  [FORM_FIELDS_NAMES.BIO]: editData?.bio || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.addressLine1 || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.addressLine2 || '',
  [FORM_FIELDS_NAMES.STATE]: editData?.stateOption || null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.countryOption || null,
  [FORM_FIELDS_NAMES.CITY]: editData?.city || '',
  [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.zipCode || '',
  photo: null,
});

export default function AddProviderDrawer({ open, drawerMode, editData }) {
  const dispatch = useDispatch();
  const isEdit = drawerMode === 'edit';

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };
  // eslint-disable-next-line no-console
  console.log('editData', editData);
  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    handleClose();
  };

  return (
    <Drawer
      title={isEdit ? 'Edit Provider' : 'Add Provider'}
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
            <div className="flex-1 overflow-y-auto  flex gap-6">
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="Language"
                    name={FORM_FIELDS_NAMES.LANGUAGE}
                    placeholder="Select Language"
                    options={LANGUAGE_OPTIONS}
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
                  <SelectDropdown
                    label="Primary Role"
                    name={FORM_FIELDS_NAMES.PRIMARY_ROLE}
                    placeholder="Select Primary Role"
                    options={ROLE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.PRIMARY_ROLE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.PRIMARY_ROLE, selected)
                    }
                  />
                  <SelectDropdown
                    label="Secondary Role"
                    name={FORM_FIELDS_NAMES.SECONDARY_ROLE}
                    placeholder="Select Secondary Role"
                    options={ROLE_OPTIONS}
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
                  <SelectDropdown
                    label="State"
                    name={FORM_FIELDS_NAMES.STATE}
                    placeholder="Select State"
                    options={STATE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.STATE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.STATE, selected)
                    }
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
                  />
                  <Input
                    label="ZIP CODE"
                    name={FORM_FIELDS_NAMES.ZIP_CODE}
                    placeholder="Enter Zip Code"
                    value={values[FORM_FIELDS_NAMES.ZIP_CODE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                disabled={!(isValid && dirty)}
              >
                {isEdit ? 'Save' : 'Create Provider'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
