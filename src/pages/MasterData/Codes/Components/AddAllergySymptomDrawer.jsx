import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import TextArea from '@/components/commonComponents/textArea';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { codesActions } from '../codeSaga';
import { closeDrawer, componentKey } from '../codesSlice';
import { CODE_TYPE_MAP, SIMPLE_NAME_FORM_FIELDS } from '../constant';

const { createStandalone, updateStandalone } = codesActions;

const ALLERGY_SYMPTOM_LABELS = new Set(['Allergy', 'Symptom']);
const EMPTY_STATE = {};

const validationSchema = (codeLabel) =>
  Yup.object().shape({
    [SIMPLE_NAME_FORM_FIELDS.NAME]: Yup.string().required(
      `${codeLabel} Name is required`,
    ),
    [SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]: Yup.string().required(
      'Description is required',
    ),
  });

function getLoadingKey(type) {
  if (type === 'allergies') {
    return {
      create: LOADING_KEYS.ALLERGIES_POST_CREATE,
      update: LOADING_KEYS.ALLERGIES_PATCH_UPDATE,
    };
  }
  return {
    create: LOADING_KEYS.SYMPTOMS_POST_CREATE,
    update: LOADING_KEYS.SYMPTOMS_PATCH_UPDATE,
  };
}

export default function AddAllergySymptomDrawer() {
  const dispatch = useDispatch();
  const {
    drawerOpenFrom = '',
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isOpen = ALLERGY_SYMPTOM_LABELS.has(drawerOpenFrom);
  const isEdit = drawerMode === 'edit';
  const codeType = CODE_TYPE_MAP[drawerOpenFrom] ?? 'allergies';
  const { create: createKey, update: updateKey } = getLoadingKey(codeType);

  const isCreating = useLoadingKey(createKey);
  const isUpdating = useLoadingKey(updateKey);
  const isSubmitting = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = {
      [SIMPLE_NAME_FORM_FIELDS.NAME]: values[SIMPLE_NAME_FORM_FIELDS.NAME],
      [SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]:
        values[SIMPLE_NAME_FORM_FIELDS.DESCRIPTION],
    };

    if (isEdit) {
      dispatch(updateStandalone({ type: codeType, id: editData?.id, data }));
    } else {
      dispatch(createStandalone({ type: codeType, data }));
    }
  };

  const title = isEdit ? `Edit ${drawerOpenFrom}` : `Add ${drawerOpenFrom}`;
  const submitLabel = isEdit
    ? `Update ${drawerOpenFrom}`
    : `Add ${drawerOpenFrom}`;

  return (
    <Drawer
      title={title}
      open={isOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [SIMPLE_NAME_FORM_FIELDS.NAME]: editData?.name ?? '',
          [SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]: editData?.description ?? '',
        }}
        validationSchema={validationSchema(drawerOpenFrom)}
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
          resetForm,
        }) => (
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Input
                label={`${drawerOpenFrom} Name`}
                name={SIMPLE_NAME_FORM_FIELDS.NAME}
                placeholder={`Enter ${drawerOpenFrom} Name`}
                value={values[SIMPLE_NAME_FORM_FIELDS.NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[SIMPLE_NAME_FORM_FIELDS.NAME]}
                touched={touched[SIMPLE_NAME_FORM_FIELDS.NAME]}
                required
              />
              <TextArea
                label="Description"
                name={SIMPLE_NAME_FORM_FIELDS.DESCRIPTION}
                placeholder="Write Description..."
                value={values[SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]}
                onChangeCb={handleChange}
                isRequired
                error={errors[SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]}
                touched={touched[SIMPLE_NAME_FORM_FIELDS.DESCRIPTION]}
                onBlur={handleBlur}
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
                disabled={!(isValid && dirty) || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
