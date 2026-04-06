import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import {
  FORM_FIELDS_NAMES,
  PROGRAM_OPTIONS,
  CPT_CODE_OPTIONS,
} from '../constant';
import { componentKey, setCloseDrawer } from '../providerGroupFeeScheduleSlice';
import { feeScheduleActions } from '../providerGroupFeeScheduleSaga';

const { createFeeSchedule, updateFeeSchedule } = feeScheduleActions;
const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PROGRAM]: Yup.object()
    .nullable()
    .required('Program is required'),
  [FORM_FIELDS_NAMES.CPT_CODE]: Yup.object()
    .nullable()
    .required('CPT Code is required'),
  [FORM_FIELDS_NAMES.DATE_RANGE]: Yup.string()
    .nullable()
    .required('Date Range is required'),
  [FORM_FIELDS_NAMES.RATE]: Yup.string().required('Rate is required'),
});

const getInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.PROGRAM]: editData?.program
    ? PROGRAM_OPTIONS.find((o) => o.value === editData.program) || null
    : null,
  [FORM_FIELDS_NAMES.CPT_CODE]: editData?.cptCodeId
    ? { label: editData.cptCode, value: editData.cptCodeId }
    : null,
  [FORM_FIELDS_NAMES.DATE_RANGE]: editData?.startDate || null,
  [FORM_FIELDS_NAMES.RATE]: editData?.rate ?? '',
});

export default function AddFeeScheduleDrawer() {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();

  const {
    drawerOpen = false,
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.FEE_SCHEDULE_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.FEE_SCHEDULE_PATCH_UPDATE);
  const isSaving = isCreating || isUpdating;

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const data = {
      program: values[FORM_FIELDS_NAMES.PROGRAM]?.value || '',
      cptCodeId: values[FORM_FIELDS_NAMES.CPT_CODE]?.value || '',
      startDate: values[FORM_FIELDS_NAMES.DATE_RANGE] || '',
      endDate: values[FORM_FIELDS_NAMES.DATE_RANGE] || '',
      rate: Number(values[FORM_FIELDS_NAMES.RATE]) || 0,
    };

    if (isEdit) {
      dispatch(updateFeeSchedule({ id: editData?.id, data }));
    } else {
      dispatch(createFeeSchedule({ providerGroupId, data }));
    }
  };

  const title = isEdit ? 'Edit Fee Schedule' : 'Add Fee Schedule';
  const submitLabel = isSaving ? 'Saving...' : 'Save';

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[85%] w-[600px]"
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
            <div className="flex-1 overflow-y-auto">
              <div className="border border-border-light rounded-lg p-5">
                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="Program"
                    name={FORM_FIELDS_NAMES.PROGRAM}
                    placeholder="Enter Program"
                    options={PROGRAM_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.PROGRAM]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.PROGRAM, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.PROGRAM]}
                    touched={touched[FORM_FIELDS_NAMES.PROGRAM]}
                    isRequired
                  />
                  <SelectDropdown
                    label="CPT Code"
                    name={FORM_FIELDS_NAMES.CPT_CODE}
                    placeholder="Enter CPT Code"
                    options={CPT_CODE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.CPT_CODE]}
                    onChange={(selected) =>
                      setFieldValue(FORM_FIELDS_NAMES.CPT_CODE, selected)
                    }
                    error={errors[FORM_FIELDS_NAMES.CPT_CODE]}
                    touched={touched[FORM_FIELDS_NAMES.CPT_CODE]}
                    isRequired
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DatePicker
                    label="Select Date Range"
                    name={FORM_FIELDS_NAMES.DATE_RANGE}
                    placeholder="Select Date"
                    value={values[FORM_FIELDS_NAMES.DATE_RANGE]}
                    onChangeCb={(date) =>
                      setFieldValue(FORM_FIELDS_NAMES.DATE_RANGE, date)
                    }
                    error={errors[FORM_FIELDS_NAMES.DATE_RANGE]}
                    touched={touched[FORM_FIELDS_NAMES.DATE_RANGE]}
                  />
                  <Input
                    label="Rate ($)"
                    name={FORM_FIELDS_NAMES.RATE}
                    placeholder="Enter Rate"
                    value={values[FORM_FIELDS_NAMES.RATE]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[FORM_FIELDS_NAMES.RATE]}
                    touched={touched[FORM_FIELDS_NAMES.RATE]}
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
