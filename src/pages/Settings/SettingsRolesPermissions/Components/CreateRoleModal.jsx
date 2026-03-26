import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Button from "@/components/commonComponents/button/Button";
import Input from "@/components/commonComponents/input/Input";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";

import { FORM_FIELDS_NAMES, ROLE_TYPE_OPTIONS } from "../constant";
import { setCloseCreateRoleModal } from "../settingsRolesPermissionsSlice";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.ROLE_NAME]: Yup.string().required("Role Name is required"),
  [FORM_FIELDS_NAMES.ROLE_TYPE]: Yup.object()
    .nullable()
    .required("Role Type is required"),
});

const initialValues = {
  [FORM_FIELDS_NAMES.ROLE_NAME]: "",
  [FORM_FIELDS_NAMES.ROLE_TYPE]: null,
};

export default function CreateRoleModal({ open }) {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setCloseCreateRoleModal());

  const handleFormSubmit = (_, { resetForm }) => {
    resetForm();
    handleClose();
  };

  return (
    <ModalComponent
      title="Add New Role"
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[450px]"
      footerButton={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form className="flex flex-col gap-5">
            <Input
              label="Role Name"
              name={FORM_FIELDS_NAMES.ROLE_NAME}
              placeholder="Enter Role Name"
              value={values[FORM_FIELDS_NAMES.ROLE_NAME]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[FORM_FIELDS_NAMES.ROLE_NAME]}
              touched={touched[FORM_FIELDS_NAMES.ROLE_NAME]}
            />
            <SelectDropdown
              label="Role Type"
              name={FORM_FIELDS_NAMES.ROLE_TYPE}
              placeholder="Select Role Type"
              options={ROLE_TYPE_OPTIONS}
              value={values[FORM_FIELDS_NAMES.ROLE_TYPE]}
              onChange={(selected) =>
                setFieldValue(FORM_FIELDS_NAMES.ROLE_TYPE, selected)
              }
              error={errors[FORM_FIELDS_NAMES.ROLE_TYPE]}
              touched={touched[FORM_FIELDS_NAMES.ROLE_TYPE]}
            />

            <div className="flex justify-end pt-2 border-t border-[#E9E9E9]">
              <Button
                variant="primaryBlue"
                size="sm"
                type="button"
                onClick={handleSubmit}
              >
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalComponent>
  );
}
