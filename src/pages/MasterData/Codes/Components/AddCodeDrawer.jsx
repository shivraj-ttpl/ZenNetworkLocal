import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import TextArea from "@/components/commonComponents/textArea";
import { componentKey, closeDrawer } from "@/pages/MasterData/Codes/codesSlice";

const validationSchema = (codeLabel) =>
  Yup.object().shape({
    code: Yup.string().required(`${codeLabel} Code is required`),
    description: Yup.string().required("Description is required"),
  });

export default function AddCodeDrawer() {
  const dispatch = useDispatch();
  const drawerOpenFrom = useSelector((state) => state[componentKey]?.drawerOpenFrom ?? "");
  const drawerMode = useSelector((state) => state[componentKey]?.drawerMode ?? "");
  const editData = useSelector((state) => state[componentKey]?.editData ?? null);
  const isOpen = Boolean(drawerOpenFrom);
  const isEdit = drawerMode === "edit";

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action for add/edit
    resetForm();
    handleClose();
  };

  const title = isEdit ? `Edit ${drawerOpenFrom} Code` : `Add ${drawerOpenFrom} Code`;
  const submitLabel = isEdit ? `Update ${drawerOpenFrom} Code` : `Add ${drawerOpenFrom} Code`;

  return (
    <Drawer
      title={title}
      open={isOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
    >
      <Formik
        initialValues={{
          code: editData?.code ?? "",
          description: editData?.description ?? "",
        }}
        validationSchema={validationSchema(drawerOpenFrom)}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, resetForm }) => (
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Input
                label={`${drawerOpenFrom} Code`}
                name="code"
                placeholder="Enter Code"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.code}
                touched={touched.code}
                required
              />
              <TextArea
                label="Description"
                name="description"
                placeholder="Write Description..."
                value={values.description}
                onChangeCb={handleChange}
                isRequired
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
