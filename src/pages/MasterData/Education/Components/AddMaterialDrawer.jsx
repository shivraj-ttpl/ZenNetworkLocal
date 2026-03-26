import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import FileUpload from "@/components/commonComponents/upload/FileUpload";
import { componentKey, setCloseDrawer } from "../educationSlice";
import { FORM_FIELDS_NAMES, FILE_NAME_OPTIONS, SPECIALTY_OPTIONS } from "../constant";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FILE_NAME]: Yup.object().nullable().required("File Name is required"),
  [FORM_FIELDS_NAMES.FILE]: Yup.mixed().required("File is required"),
});

export default function AddMaterialDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen = false, drawerMode = "", editData = null } = useSelector((state) => state[componentKey] ?? {});
  const isEdit = drawerMode === "edit";

  const [fileError, setFileError] = useState("");

  const handleClose = () => {
    setFileError("");
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action for add/edit
    resetForm();
    handleClose();
  };

  const title = isEdit ? "Edit Material" : "Add Material";
  const submitLabel = isEdit ? "Update" : "Upload";

  const initialValues = {
    [FORM_FIELDS_NAMES.FILE_NAME]: isEdit && editData?.fileName
      ? FILE_NAME_OPTIONS.find((opt) => opt.value === editData.fileName) || null
      : null,
    [FORM_FIELDS_NAMES.SPECIALTY]: isEdit && editData?.specialty
      ? SPECIALTY_OPTIONS.find((opt) => opt.value === editData.specialty) || null
      : null,
    [FORM_FIELDS_NAMES.FILE]: null,
  };

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
      footerButton={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isValid, dirty, handleSubmit, setFieldValue, resetForm }) => (
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <SelectDropdown
                label="File Name"
                name={FORM_FIELDS_NAMES.FILE_NAME}
                placeholder="Enter File Name"
                options={FILE_NAME_OPTIONS}
                value={values[FORM_FIELDS_NAMES.FILE_NAME]}
                onChangeCb={(selected) => setFieldValue(FORM_FIELDS_NAMES.FILE_NAME, selected)}
                isRequired
              />

              <SelectDropdown
                label="Specialty"
                name={FORM_FIELDS_NAMES.SPECIALTY}
                placeholder="Select Specialty"
                options={SPECIALTY_OPTIONS}
                value={values[FORM_FIELDS_NAMES.SPECIALTY]}
                onChangeCb={(selected) => setFieldValue(FORM_FIELDS_NAMES.SPECIALTY, selected)}
              />

              <FileUpload
                label="Upload File"
                name={FORM_FIELDS_NAMES.FILE}
                isRequired
                allowedFileTypes={[".pdf", ".mp4", ".doc", ".docx", ".ppt", ".pptx", ".png", ".jpg"]}
                maxFileSize={5}
                description="pdf, mp4, doc, docx, ppt, pptx, png, jpg, up to 5MB."
                onFileSelect={(file, error) => {
                  setFieldValue(FORM_FIELDS_NAMES.FILE, file);
                  setFileError(error);
                }}
                error={fileError || (touched[FORM_FIELDS_NAMES.FILE] ? errors[FORM_FIELDS_NAMES.FILE] : "")}
                touched={touched[FORM_FIELDS_NAMES.FILE]}
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
                disabled={!(isValid && dirty) || Boolean(fileError)}
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
