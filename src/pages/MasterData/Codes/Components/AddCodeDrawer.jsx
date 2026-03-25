import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import TextArea from '@/components/commonComponents/textArea';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { codesActions } from '@/pages/MasterData/Codes/codeSaga';
import { closeDrawer, componentKey } from '@/pages/MasterData/Codes/codesSlice';
import {
  CODE_TYPE_MAP,
  FORM_FIELDS_NAMES,
} from '@/pages/MasterData/Codes/constant';

const { createCode, updateCode } = codesActions;
const EMPTY_STATE = {};

const validationSchema = (codeLabel) =>
  Yup.object().shape({
    [FORM_FIELDS_NAMES.CODE]: Yup.string().required(
      `${codeLabel} Code is required`,
    ),
    [FORM_FIELDS_NAMES.DESCRIPTION]: Yup.string().required(
      'Description is required',
    ),
  });

export default function AddCodeDrawer() {
  const dispatch = useDispatch();
  const {
    drawerOpenFrom = '',
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isOpen = Boolean(drawerOpenFrom);
  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.CODES_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.CODES_PATCH_UPDATE);
  const isSubmitting = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const handleFormSubmit = (values) => {
    const type = CODE_TYPE_MAP[drawerOpenFrom];
    const data = {
      [FORM_FIELDS_NAMES.CODE]: values[FORM_FIELDS_NAMES.CODE],
      [FORM_FIELDS_NAMES.DESCRIPTION]: values[FORM_FIELDS_NAMES.DESCRIPTION],
    };

    if (isEdit) {
      dispatch(updateCode({ type, id: editData?.id, data }));
    } else {
      dispatch(createCode({ type, data }));
    }
  };

  const title = isEdit
    ? `Edit ${drawerOpenFrom} Code`
    : `Add ${drawerOpenFrom} Code`;
  const submitLabel = isEdit
    ? `Update ${drawerOpenFrom} Code`
    : `Add ${drawerOpenFrom} Code`;

  return (
    <Drawer
      title={title}
      open={isOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.CODE]: editData?.code ?? '',
          [FORM_FIELDS_NAMES.DESCRIPTION]: editData?.description ?? '',
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
                label={`${drawerOpenFrom} Code`}
                name={FORM_FIELDS_NAMES.CODE}
                placeholder="Enter Code"
                value={values[FORM_FIELDS_NAMES.CODE]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[FORM_FIELDS_NAMES.CODE]}
                touched={touched[FORM_FIELDS_NAMES.CODE]}
                required
              />
              <TextArea
                label="Description"
                name={FORM_FIELDS_NAMES.DESCRIPTION}
                placeholder="Write Description..."
                value={values[FORM_FIELDS_NAMES.DESCRIPTION]}
                onChangeCb={handleChange}
                isRequired
              />
            </div>

            <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
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
