import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import DatePicker from "@/components/commonComponents/datePicker/DatePicker";
import {
  FORM_FIELDS_NAMES,
  PROGRAM_OPTIONS,
  CPT_CODE_OPTIONS,
} from "../constant";
import { setCloseDrawer } from "../providerGroupFeeScheduleSlice";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PROGRAM]: Yup.object().nullable().required("Program is required"),
  [FORM_FIELDS_NAMES.CPT_CODE]: Yup.object().nullable().required("CPT Code is required"),
  [FORM_FIELDS_NAMES.DATE_RANGE]: Yup.string().nullable().required("Date Range is required"),
  [FORM_FIELDS_NAMES.RATE]: Yup.string().required("Rate is required"),
});

const getInitialValues = (editData) => ({
  [FORM_FIELDS_NAMES.PROGRAM]: editData?.programOption || null,
  [FORM_FIELDS_NAMES.CPT_CODE]: editData?.cptCodeOption || null,
  [FORM_FIELDS_NAMES.DATE_RANGE]: editData?.dateRange || null,
  [FORM_FIELDS_NAMES.RATE]: editData?.rate || "",
});

export default function AddFeeScheduleDrawer({ open, drawerMode, editData }) {
  const dispatch = useDispatch();
  const isEdit = drawerMode === "edit";

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    handleClose();
  };

  return (
    <Drawer
      title={isEdit ? "Edit Fee Schedule" : "Add Fee Schedule"}
      open={open}
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
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
          <Form className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto zenera-scrollbar">
              <div className="border border-border-light rounded-lg p-5">
                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label="Program"
                    name={FORM_FIELDS_NAMES.PROGRAM}
                    placeholder="Enter Program"
                    options={PROGRAM_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.PROGRAM]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.PROGRAM, selected)}
                  />
                  <SelectDropdown
                    label="CPT Code"
                    name={FORM_FIELDS_NAMES.CPT_CODE}
                    placeholder="Enter CPT Code"
                    options={CPT_CODE_OPTIONS}
                    value={values[FORM_FIELDS_NAMES.CPT_CODE]}
                    onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.CPT_CODE, selected)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DatePicker
                    label="Select Date Range"
                    name={FORM_FIELDS_NAMES.DATE_RANGE}
                    placeholder="Select Date"
                    value={values[FORM_FIELDS_NAMES.DATE_RANGE]}
                    onChangeCb={(date) => setFieldValue(FORM_FIELDS_NAMES.DATE_RANGE, date)}
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
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
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
              >
                {isEdit ? "Save" : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
