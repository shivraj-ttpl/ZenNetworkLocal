import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';

import { FORM_FIELDS_NAMES, ROLE_TYPE_OPTIONS } from '../constant';
import { subOrgRolesActions } from '../subOrgRolesPermissionsSaga';
import { setCloseCreateRoleModal } from '../subOrgRolesPermissionsSlice';
import ConfirmCreateRoleModal from './ConfirmCreateRoleModal';

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.ROLE_NAME]: Yup.string().required('Role Name is required'),
  [FORM_FIELDS_NAMES.ROLE_TYPE]: Yup.object()
    .nullable()
    .required('Role Type is required'),
});

const initialValues = {
  [FORM_FIELDS_NAMES.ROLE_NAME]: '',
  [FORM_FIELDS_NAMES.ROLE_TYPE]: null,
};

export default function CreateRoleModal({ open, subOrgId }) {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const formikRef = useRef(null);

  const handleClose = () => {
    setShowConfirm(false);
    setPendingValues(null);
    dispatch(setCloseCreateRoleModal());
  };

  const handleFormSubmit = (values) => {
    setPendingValues(values);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!pendingValues) return;

    const payload = {
      name: pendingValues[FORM_FIELDS_NAMES.ROLE_NAME],
      roleType: pendingValues[FORM_FIELDS_NAMES.ROLE_TYPE]?.value,
    };

    dispatch(
      subOrgRolesActions.createRole({
        payload,
        onSuccess: () => {
          formikRef.current?.resetForm();
          setShowConfirm(false);
          setPendingValues(null);
          handleClose();
          dispatch(
            subOrgRolesActions.fetchRoles({
              page: 1,
              limit: 20,
              subOrgId,
            }),
          );
        },
      }),
    );
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingValues(null);
  };

  return (
    <>
      <ModalComponent
        title="Add New Role"
        open={open}
        close={handleClose}
        customClasses="w-[95%] sm:w-[450px]"
        footerButton={null}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form className="flex flex-col gap-5">
              <Input
                label="Role Name"
                name={FORM_FIELDS_NAMES.ROLE_NAME}
                placeholder="Enter Role Name"
                value={values[FORM_FIELDS_NAMES.ROLE_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[FORM_FIELDS_NAMES.ROLE_NAME]}
                touched={touched[FORM_FIELDS_NAMES.ROLE_NAME]}
                required
              />
              <SelectDropdown
                label="Role Type"
                name={FORM_FIELDS_NAMES.ROLE_TYPE}
                placeholder="Select Role Type"
                options={ROLE_TYPE_OPTIONS}
                value={values[FORM_FIELDS_NAMES.ROLE_TYPE]}
                onChange={(selected) =>
                  setFieldValue(FORM_FIELDS_NAMES.ROLE_TYPE, selected)
                }
                error={errors[FORM_FIELDS_NAMES.ROLE_TYPE]}
                touched={touched[FORM_FIELDS_NAMES.ROLE_TYPE]}
                required
              />

              <div className="flex justify-end pt-2 border-t border-[#E9E9E9]">
                <Button
                  variant="primaryBlue"
                  size="sm"
                  type="button"
                  onClick={handleSubmit}
                >
                  Create
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalComponent>

      <ConfirmCreateRoleModal
        open={showConfirm}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirm}
        roleName={pendingValues?.[FORM_FIELDS_NAMES.ROLE_NAME] || ''}
        roleType={pendingValues?.[FORM_FIELDS_NAMES.ROLE_TYPE]?.label || ''}
      />
    </>
  );
}
