import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import AsyncSelectDropdown from '@/components/commonComponents/selectDropdown/AsyncSelectDropdown';
import TextArea from '@/components/commonComponents/textArea';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { conditionsActions } from '../conditionsSaga';
import { componentKey, setCloseDrawer } from '../conditionsSlice';
import { FORM_FIELDS_NAMES } from '../constant';

const { createCondition, updateCondition } = conditionsActions;

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.CONDITION_NAME]: Yup.string().required(
    'Condition Name is required',
  ),
  [FORM_FIELDS_NAMES.ICD_CODE]: Yup.object()
    .nullable()
    .required('ICD Code is required'),
  [FORM_FIELDS_NAMES.CARE_PLAN]: Yup.object()
    .nullable()
    .required('Care Plan is required'),
});

const EMPTY_STATE = {};

export default function AddConditionDrawer() {
  const dispatch = useDispatch();
  const {
    drawerOpen = false,
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);
  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.CONDITIONS_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.CONDITIONS_PATCH_UPDATE);
  const isSaving = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = {
      name: values[FORM_FIELDS_NAMES.CONDITION_NAME],
      codeId: values[FORM_FIELDS_NAMES.ICD_CODE]?.id ?? '',
      linkedCarePlanId: values[FORM_FIELDS_NAMES.CARE_PLAN]?.id ?? '',
      description: values[FORM_FIELDS_NAMES.DESCRIPTION] || '',
    };

    if (isEdit) {
      dispatch(updateCondition({ id: editData?.id, data }));
    } else {
      dispatch(createCondition({ data }));
    }
  };

  const title = isEdit ? 'Edit Condition' : 'Add Condition';
  const submitLabel = isSaving
    ? 'Saving...'
    : isEdit
      ? 'Update Condition'
      : 'Add Condition';
  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.CONDITION_NAME]: editData?.name ?? '',
          [FORM_FIELDS_NAMES.ICD_CODE]: editData?.codeId
            ? {
                id: editData.codeId,
                code: editData.code,
                description: editData.codeDescription,
              }
            : null,
          [FORM_FIELDS_NAMES.ICD_DETAILS]: editData?.codeDescription ?? '',
          [FORM_FIELDS_NAMES.CARE_PLAN]: editData?.linkedCarePlanId
            ? {
                id: editData.linkedCarePlanId,
                name: editData.linkedCarePlanName,
              }
            : null,
          [FORM_FIELDS_NAMES.DESCRIPTION]: editData?.description ?? '',
        }}
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
            <div className="flex flex-col gap-4 flex-1">
              <Input
                label="Condition Name"
                name={FORM_FIELDS_NAMES.CONDITION_NAME}
                placeholder="Enter Condition Name"
                value={values[FORM_FIELDS_NAMES.CONDITION_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[FORM_FIELDS_NAMES.CONDITION_NAME]}
                touched={touched[FORM_FIELDS_NAMES.CONDITION_NAME]}
                required
              />

              <AsyncSelectDropdown
                label="ICD Code"
                name={FORM_FIELDS_NAMES.ICD_CODE}
                placeholder="Select Code"
                url="dropdown-apis/codes/icd"
                valueKey="id"
                labelKey="code"
                labelKey2="description"
                value={values[FORM_FIELDS_NAMES.ICD_CODE]}
                onChange={(selected) => {
                  setFieldValue(FORM_FIELDS_NAMES.ICD_CODE, selected);
                  setFieldValue(
                    FORM_FIELDS_NAMES.ICD_DETAILS,
                    selected?.description ?? '',
                  );
                }}
                error={errors[FORM_FIELDS_NAMES.ICD_CODE]}
                touched={touched[FORM_FIELDS_NAMES.ICD_CODE]}
                required
                onBlur={handleBlur}
              />

              <TextArea
                name={FORM_FIELDS_NAMES.ICD_DETAILS}
                placeholder="Code description will appear here"
                value={values[FORM_FIELDS_NAMES.ICD_DETAILS]}
                onChangeCb={handleChange}
                disabled
              />

              <AsyncSelectDropdown
                label="Care Plan"
                name={FORM_FIELDS_NAMES.CARE_PLAN}
                placeholder="Select Care Plan"
                url="dropdown-apis/careplan"
                valueKey="id"
                labelKey="name"
                value={values[FORM_FIELDS_NAMES.CARE_PLAN]}
                onChange={(selected) =>
                  setFieldValue(FORM_FIELDS_NAMES.CARE_PLAN, selected)
                }
                error={errors[FORM_FIELDS_NAMES.CARE_PLAN]}
                touched={touched[FORM_FIELDS_NAMES.CARE_PLAN]}
                required
                onBlur={handleBlur}
              />

              <TextArea
                label="Description"
                name={FORM_FIELDS_NAMES.DESCRIPTION}
                placeholder="Please Description For Condition ..."
                value={values[FORM_FIELDS_NAMES.DESCRIPTION]}
                onChangeCb={handleChange}
              />
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
