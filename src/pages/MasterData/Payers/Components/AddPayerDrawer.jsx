import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import { componentKey, setCloseDrawer } from "../payersSlice";
import { FORM_FIELDS_NAMES, PAYER_TYPE_OPTIONS } from "../constant";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.PAYER_NAME]: Yup.string().required("Payer Name is required"),
  [FORM_FIELDS_NAMES.PAYER_TYPE]: Yup.object().nullable().required("Payer Type is required"),
});

export default function AddPayerDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen = false, drawerMode = "", editData = null } = useSelector(
    (state) => state[componentKey] ?? {}
  );
  const isEdit = drawerMode === "edit";

  const handleClose = () => {
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action for add/edit
    resetForm();
    handleClose();
  };

  const title = isEdit ? "Edit Payer" : "Add Payer";
  const submitLabel = isEdit ? "Update Payer" : "Add Payer";

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.PAYER_NAME]: editData?.name ?? "",
          [FORM_FIELDS_NAMES.PAYER_TYPE]: isEdit && editData?.type
            ? PAYER_TYPE_OPTIONS.find((opt) => opt.value === editData.type) || null
            : null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
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
                onChangeCb={(selected) => setFieldValue(FORM_FIELDS_NAMES.PAYER_TYPE, selected)}
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
