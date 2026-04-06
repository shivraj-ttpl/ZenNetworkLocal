import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { parsePhoneValue } from '@/utils/GeneralUtils';

import {
  FORM_FIELDS_NAMES,
  ROLE_OPTIONS,
  STATE_OPTIONS,
  COUNTRY_OPTIONS,
} from '../constant';
import { componentKey, setCloseDrawer } from '../providerGroupUsersSlice';
import { providerGroupUsersActions } from '../providerGroupUsersSaga';

const { createUser, updateUser } = providerGroupUsersActions;
const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FULL_NAME]: Yup.string().required(
    'Full Name is required',
  ),
  [FORM_FIELDS_NAMES.EMAIL]: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  [FORM_FIELDS_NAMES.ROLE]: Yup.object()
    .nullable()
    .required('Role is required'),
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
  [FORM_FIELDS_NAMES.FULL_NAME]:
    editData
      ? `${editData.firstName || ''} ${editData.lastName || ''}`.trim()
      : '',
  [FORM_FIELDS_NAMES.EMAIL]: editData?.email || '',
  [FORM_FIELDS_NAMES.ROLE]: editData?.providerGroups?.[0]?.roleTitle
    ? ROLE_OPTIONS.find(
        (o) => o.value === editData.providerGroups[0].roleTitle,
      ) || { label: editData.providerGroups[0].roleTitle, value: editData.providerGroups[0].roleTitle }
    : null,
  [FORM_FIELDS_NAMES.CONTACT_NUMBER]: editData?.contactNumber
    ? `${editData.countryCode || ''}${editData.contactNumber}`
    : '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: editData?.address?.addressLine1 || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: editData?.address?.addressLine2 || '',
  [FORM_FIELDS_NAMES.STATE]: editData?.address?.state
    ? STATE_OPTIONS.find((o) => o.value === editData.address.state) || {
        label: editData.address.state,
        value: editData.address.state,
      }
    : null,
  [FORM_FIELDS_NAMES.COUNTRY]: editData?.address?.country
    ? COUNTRY_OPTIONS.find((o) => o.value === editData.address.country) || {
        label: editData.address.country,
        value: editData.address.country,
      }
    : null,
  [FORM_FIELDS_NAMES.CITY]: editData?.address?.city || '',
  [FORM_FIELDS_NAMES.ZIP_CODE]: editData?.address?.zipCode || '',
});

export default function AddUserDrawer() {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();

  const {
    drawerOpen = false,
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_USERS_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_USERS_PATCH_UPDATE);
  const isSaving = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const fullName = values[FORM_FIELDS_NAMES.FULL_NAME].trim();
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { countryCode, nationalNumber: contactNumber } = parsePhoneValue(
      values[FORM_FIELDS_NAMES.CONTACT_NUMBER],
    );

    const data = {
      firstName,
      lastName,
      email: values[FORM_FIELDS_NAMES.EMAIL],
      providerGroupRoleTitle: values[FORM_FIELDS_NAMES.ROLE]?.value || '',
      countryCode: countryCode || '',
      contactNumber: contactNumber || '',
      address: {
        addressLine1: values[FORM_FIELDS_NAMES.ADDRESS_LINE_1] || '',
        addressLine2: values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || '',
        city: values[FORM_FIELDS_NAMES.CITY] || '',
        state: values[FORM_FIELDS_NAMES.STATE]?.value || '',
        zipCode: values[FORM_FIELDS_NAMES.ZIP_CODE] || '',
        country: values[FORM_FIELDS_NAMES.COUNTRY]?.value || '',
      },
    };

    if (isEdit) {
      dispatch(updateUser({ id: editData?.id, data }));
    } else {
      dispatch(createUser({ providerGroupId, data }));
    }
  };

  const title = isEdit ? 'Edit User' : 'Add User';
  const submitLabel = isSaving ? 'Saving...' : isEdit ? 'Save' : 'Add User';

  return (
    <Drawer
      title={title}
      open={drawerOpen}
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
            <div className="flex-1 overflow-y-auto flex gap-6">
              <div className="shrink-0 w-50">
                <UploadPhoto
                  name="photo"
                  label="Profile Photo"
                  maxFileSize={5}
                  onFileSelect={(file) => setFieldValue('photo', file)}
                />
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    name={FORM_FIELDS_NAMES.FULL_NAME}
                    placeholder="Enter Full Name"
                    value={values[FORM_FIELDS_NAMES.FULL_NAME]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.FULL_NAME]}
                    touched={touched[FORM_FIELDS_NAMES.FULL_NAME]}
                    required
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

                  <SelectDropdown
                    label="Role"
                    name={FORM_FIELDS_NAMES.ROLE}
                    placeholder="Select Role"
                    options={ROLE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.ROLE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.ROLE, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.ROLE]}
                    touched={touched[FORM_FIELDS_NAMES.ROLE]}
                    isRequired
                  />

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
                </div>

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
                    isRequired
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
                    isRequired
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
