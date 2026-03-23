import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import TextArea from "@/components/commonComponents/textArea";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import { componentKey, setCloseDrawer } from "../conditionsSlice";
import { FORM_FIELDS_NAMES, ICD_CODE_OPTIONS, CARE_PLAN_OPTIONS } from "../constant";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.CONDITION_NAME]: Yup.string().required("Condition Name is required"),
  [FORM_FIELDS_NAMES.ICD_CODE]: Yup.object().nullable().required("ICD Code is required"),
  [FORM_FIELDS_NAMES.CARE_PLAN]: Yup.object().nullable().required("Care Plan is required"),
});

export default function AddConditionDrawer() {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state) => state[componentKey]?.drawerOpen ?? false);
  const drawerMode = useSelector((state) => state[componentKey]?.drawerMode ?? "");
  const editData = useSelector((state) => state[componentKey]?.editData ?? null);
  const isEdit = drawerMode === "edit";

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action for add/edit
    resetForm();
    handleClose();
  };

  const title = isEdit ? "Edit Condition" : "Add Condition";
  const submitLabel = isEdit ? "Update Condition" : "Add Condition";

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.CONDITION_NAME]: editData?.name ?? "",
          [FORM_FIELDS_NAMES.ICD_CODE]: editData?.icdCodeOption ?? null,
          [FORM_FIELDS_NAMES.ICD_DETAILS]: editData?.icdDetails ?? "",
          [FORM_FIELDS_NAMES.CARE_PLAN]: editData?.carePlanOption ?? null,
          [FORM_FIELDS_NAMES.DESCRIPTION]: editData?.description ?? "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
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

              <SelectDropdown
                label="ICD Code"
                name={FORM_FIELDS_NAMES.ICD_CODE}
                placeholder="Select Code"
                options={ICD_CODE_OPTIONS}
                value={values[FORM_FIELDS_NAMES.ICD_CODE]}
                onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.ICD_CODE, selected)}
                required
              />

              <TextArea
                name={FORM_FIELDS_NAMES.ICD_DETAILS}
                placeholder="Enter Details"
                value={values[FORM_FIELDS_NAMES.ICD_DETAILS]}
                onChangeCb={handleChange}
              />

              <SelectDropdown
                label="Care Plan"
                name={FORM_FIELDS_NAMES.CARE_PLAN}
                placeholder="Select Code"
                options={CARE_PLAN_OPTIONS}
                value={values[FORM_FIELDS_NAMES.CARE_PLAN]}
                onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.CARE_PLAN, selected)}
                required
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
                variant="outline"
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
                disabled={!(isValid && dirty)}
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
