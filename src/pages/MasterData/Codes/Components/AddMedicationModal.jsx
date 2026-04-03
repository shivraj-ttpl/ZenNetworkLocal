import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { codesActions } from '../codeSaga';
import { closeDrawer, componentKey } from '../codesSlice';
import {
  DOSAGE_FORM_OPTIONS,
  DRUG_CLASS_OPTIONS,
  MEDICATION_FORM_FIELDS,
} from '../constant';

const { createStandalone, updateStandalone } = codesActions;

const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [MEDICATION_FORM_FIELDS.MEDICATION_NAME]: Yup.string().required(
    'Medication Name is required',
  ),
  [MEDICATION_FORM_FIELDS.GENERIC_NAME]: Yup.string().required(
    'Generic Name is required',
  ),
  [MEDICATION_FORM_FIELDS.BRAND_NAME]: Yup.string().required(
    'Brand Name is required',
  ),
  [MEDICATION_FORM_FIELDS.STRENGTH]: Yup.string().required(
    'Strength is required',
  ),
  [MEDICATION_FORM_FIELDS.FORM]: Yup.object()
    .nullable()
    .required('Dosage Form is required'),
  [MEDICATION_FORM_FIELDS.DRUG_CLASS]: Yup.object()
    .nullable()
    .required('Drug Class is required'),
});

export default function AddMedicationModal() {
  const dispatch = useDispatch();
  const {
    drawerOpenFrom = '',
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isOpen = drawerOpenFrom === 'Medication';
  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.MEDICATIONS_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.MEDICATIONS_PATCH_UPDATE);
  const isSubmitting = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = {
      [MEDICATION_FORM_FIELDS.MEDICATION_NAME]:
        values[MEDICATION_FORM_FIELDS.MEDICATION_NAME],
      [MEDICATION_FORM_FIELDS.GENERIC_NAME]:
        values[MEDICATION_FORM_FIELDS.GENERIC_NAME],
      [MEDICATION_FORM_FIELDS.BRAND_NAME]:
        values[MEDICATION_FORM_FIELDS.BRAND_NAME],
      [MEDICATION_FORM_FIELDS.STRENGTH]:
        values[MEDICATION_FORM_FIELDS.STRENGTH],
      [MEDICATION_FORM_FIELDS.FORM]:
        values[MEDICATION_FORM_FIELDS.FORM]?.value || "",
      [MEDICATION_FORM_FIELDS.DRUG_CLASS]:
        values[MEDICATION_FORM_FIELDS.DRUG_CLASS]?.value || "",
      [MEDICATION_FORM_FIELDS.RXNORM_CODE]:
        values[MEDICATION_FORM_FIELDS.RXNORM_CODE] || "",
      [MEDICATION_FORM_FIELDS.ATC_CODE]:
        values[MEDICATION_FORM_FIELDS.ATC_CODE] || "",
    };

    if (isEdit) {
      dispatch(
        updateStandalone({ type: 'medications', id: editData?.id, data }),
      );
    } else {
      dispatch(createStandalone({ type: 'medications', data }));
    }
  };

  const title = isEdit ? 'Edit Medication' : 'Add Medication';
  const submitLabel = isEdit ? 'Update Medication' : 'Add Medication';

  return (
    <Drawer
      title={title}
      open={isOpen}
      close={handleClose}
      width="max-w-[600px] w-[600px]"
    >
      <Formik
        initialValues={{
          [MEDICATION_FORM_FIELDS.MEDICATION_NAME]:
            editData?.medicationName ?? '',
          [MEDICATION_FORM_FIELDS.GENERIC_NAME]: editData?.genericName ?? '',
          [MEDICATION_FORM_FIELDS.BRAND_NAME]: editData?.brandName ?? '',
          [MEDICATION_FORM_FIELDS.STRENGTH]: editData?.strength ?? '',
          [MEDICATION_FORM_FIELDS.FORM]: editData?.form
            ? (DOSAGE_FORM_OPTIONS.find((o) => o.value === editData.form) ??
              null)
            : null,
          [MEDICATION_FORM_FIELDS.DRUG_CLASS]: editData?.drugClass
            ? (DRUG_CLASS_OPTIONS.find((o) => o.value === editData.drugClass) ??
              null)
            : null,
          [MEDICATION_FORM_FIELDS.RXNORM_CODE]: editData?.rxNormCode ?? '',
          [MEDICATION_FORM_FIELDS.ATC_CODE]: editData?.atcCode ?? '',
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
          resetForm,
          setFieldValue,
        }) => (
          <Form className="flex flex-col h-full">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Medication Name"
                name={MEDICATION_FORM_FIELDS.MEDICATION_NAME}
                placeholder="Enter Medication Name"
                value={values[MEDICATION_FORM_FIELDS.MEDICATION_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[MEDICATION_FORM_FIELDS.MEDICATION_NAME]}
                touched={touched[MEDICATION_FORM_FIELDS.MEDICATION_NAME]}
                required
              />
              <Input
                label="Generic Name"
                name={MEDICATION_FORM_FIELDS.GENERIC_NAME}
                placeholder="Enter Generic Name"
                value={values[MEDICATION_FORM_FIELDS.GENERIC_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[MEDICATION_FORM_FIELDS.GENERIC_NAME]}
                touched={touched[MEDICATION_FORM_FIELDS.GENERIC_NAME]}
                required
              />
              <Input
                label="Brand Name"
                name={MEDICATION_FORM_FIELDS.BRAND_NAME}
                placeholder="Enter Brand Name"
                value={values[MEDICATION_FORM_FIELDS.BRAND_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[MEDICATION_FORM_FIELDS.BRAND_NAME]}
                touched={touched[MEDICATION_FORM_FIELDS.BRAND_NAME]}
                required
              />
              <Input
                label="Strength"
                name={MEDICATION_FORM_FIELDS.STRENGTH}
                placeholder="Enter Strength"
                value={values[MEDICATION_FORM_FIELDS.STRENGTH]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[MEDICATION_FORM_FIELDS.STRENGTH]}
                touched={touched[MEDICATION_FORM_FIELDS.STRENGTH]}
                required
              />
              <SelectDropdown
                label="Dosage Form"
                name={MEDICATION_FORM_FIELDS.FORM}
                placeholder="Select Dosage Form"
                options={DOSAGE_FORM_OPTIONS}
                value={values[MEDICATION_FORM_FIELDS.FORM]}
                onChange={(val) =>
                  setFieldValue(MEDICATION_FORM_FIELDS.FORM, val)
                }
                error={errors[MEDICATION_FORM_FIELDS.FORM]}
                touched={touched[MEDICATION_FORM_FIELDS.FORM]}
                isRequired
              />
              <SelectDropdown
                label="Drug Class"
                name={MEDICATION_FORM_FIELDS.DRUG_CLASS}
                placeholder="Select Drug Class"
                options={DRUG_CLASS_OPTIONS}
                value={values[MEDICATION_FORM_FIELDS.DRUG_CLASS]}
                onChange={(val) =>
                  setFieldValue(MEDICATION_FORM_FIELDS.DRUG_CLASS, val)
                }
                error={errors[MEDICATION_FORM_FIELDS.DRUG_CLASS]}
                touched={touched[MEDICATION_FORM_FIELDS.DRUG_CLASS]}
                isRequired
              />
              <Input
                label="RxNorm Code"
                name={MEDICATION_FORM_FIELDS.RXNORM_CODE}
                placeholder="Enter RxNorm Code"
                value={values[MEDICATION_FORM_FIELDS.RXNORM_CODE]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="ATC Code"
                name={MEDICATION_FORM_FIELDS.ATC_CODE}
                placeholder="Enter ATC Code"
                value={values[MEDICATION_FORM_FIELDS.ATC_CODE]}
                onChange={handleChange}
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
