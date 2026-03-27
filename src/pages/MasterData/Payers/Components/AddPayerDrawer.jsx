import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { FORM_FIELDS_NAMES, PAYER_TYPE_OPTIONS } from '../constant';
import { payersActions } from '../payersSaga';
import { componentKey, setCloseDrawer } from '../payersSlice';

const { createPayer, updatePayer } = payersActions;
const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PAYER_NAME]: Yup.string().required(
    'Payer Name is required',
  ),
  [FORM_FIELDS_NAMES.PAYER_TYPE]: Yup.object()
    .nullable()
    .required('Payer Type is required'),
});

export default function AddPayerDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen = false, drawerMode = '', editData = null } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );
  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.PAYERS_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.PAYERS_PATCH_UPDATE);
  const isSaving = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = {
      name: values[FORM_FIELDS_NAMES.PAYER_NAME],
      payerType: values[FORM_FIELDS_NAMES.PAYER_TYPE]?.value || undefined,
    };

    if (isEdit) {
      dispatch(updatePayer({ id: editData?.id, data }));
    } else {
      dispatch(createPayer({ data }));
    }
  };

  const title = isEdit ? 'Edit Payer' : 'Add Payer';
  const submitLabel = isSaving
    ? 'Saving...'
    : isEdit
      ? 'Update Payer'
      : 'Add Payer';

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.PAYER_NAME]: editData?.name ?? '',
          [FORM_FIELDS_NAMES.PAYER_TYPE]:
            isEdit && editData?.payerType
              ? PAYER_TYPE_OPTIONS.find(
                  (opt) => opt.value === editData.payerType,
                ) || null
              : null,
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
                label="Payer Name"
                name={FORM_FIELDS_NAMES.PAYER_NAME}
                placeholder="Enter Payer Name"
                value={values[FORM_FIELDS_NAMES.PAYER_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[FORM_FIELDS_NAMES.PAYER_NAME]}
                touched={touched[FORM_FIELDS_NAMES.PAYER_NAME]}
                required
              />

              <SelectDropdown
                label="Payer Type"
                name={FORM_FIELDS_NAMES.PAYER_TYPE}
                placeholder="Select Payer Type"
                options={PAYER_TYPE_OPTIONS}
                value={values[FORM_FIELDS_NAMES.PAYER_TYPE]}
                onChange={(selected) =>
                  setFieldValue(FORM_FIELDS_NAMES.PAYER_TYPE, selected)
                }
                isRequired
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
