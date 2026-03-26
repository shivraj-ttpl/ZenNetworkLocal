import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import PatientStepBar from "./PatientStepBar";
import { PATIENT_STEPS, FORM_FIELDS_NAMES } from "../constant";
import { setCloseDrawer } from "../providerGroupPatientsSlice";
import PatientDetails, { emptyFamilyContact } from "./steps/PatientDetails";
import InsuranceAndIdentifiers, { emptyInsurance } from "./steps/InsuranceAndIdentifiers";

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required("First Name is required"),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required("Last Name is required"),
  [FORM_FIELDS_NAMES.DATE_OF_BIRTH]: Yup.string().required("Date of Birth is required"),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required("Address Line 1 is required"),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required("Zip Code is required"),
});

const getInitialValues = (editData) => ({
  photo: null,
  [FORM_FIELDS_NAMES.FIRST_NAME]: editData?.firstName || "",
  [FORM_FIELDS_NAMES.LAST_NAME]: editData?.lastName || "",
  [FORM_FIELDS_NAMES.MIDDLE_NAME]: "",
  [FORM_FIELDS_NAMES.SEX_AT_BIRTH]: null,
  [FORM_FIELDS_NAMES.DATE_OF_BIRTH]: editData?.dob || "",
  [FORM_FIELDS_NAMES.MARITAL_STATUS]: null,
  [FORM_FIELDS_NAMES.IDENTIFIED_GENDER]: null,
  [FORM_FIELDS_NAMES.RACE]: null,
  [FORM_FIELDS_NAMES.ETHNICITY]: null,
  [FORM_FIELDS_NAMES.PREFERRED_LANGUAGE]: null,
  [FORM_FIELDS_NAMES.EMAIL]: "",
  [FORM_FIELDS_NAMES.PRIMARY_CONTACT]: "",
  [FORM_FIELDS_NAMES.SECONDARY_CONTACT]: "",
  [FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT]: null,
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: "",
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: "",
  [FORM_FIELDS_NAMES.STATE]: null,
  [FORM_FIELDS_NAMES.TIMEZONE]: null,
  [FORM_FIELDS_NAMES.CITY]: null,
  [FORM_FIELDS_NAMES.ZIP_CODE]: "",
  [FORM_FIELDS_NAMES.COUNTY]: null,
  [FORM_FIELDS_NAMES.COUNTRY]: null,
  [FORM_FIELDS_NAMES.FAMILY_CONTACTS]: [{ ...emptyFamilyContact }],
  [FORM_FIELDS_NAMES.REFERRING_PROVIDER]: null,
  [FORM_FIELDS_NAMES.PRIMARY_CARE_PROVIDER]: null,
  [FORM_FIELDS_NAMES.PRIMARY_CARE_MANAGER]: null,
  [FORM_FIELDS_NAMES.SECONDARY_CARE_MANAGER]: null,
  [FORM_FIELDS_NAMES.ADDITIONAL_CARE_TEAM_MEMBER]: null,
  [FORM_FIELDS_NAMES.CONSENT_TO_MESSAGE]: false,
  [FORM_FIELDS_NAMES.CONSENT_TO_CALL]: false,
  [FORM_FIELDS_NAMES.CONSENT_TO_EMAIL]: false,
  [FORM_FIELDS_NAMES.ENABLE_CALL_RECORDING]: false,
  [FORM_FIELDS_NAMES.INSURANCES]: [{ ...emptyInsurance }],
  [FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]: false,
  [FORM_FIELDS_NAMES.INS_ADDRESS_LINE_1]: "",
  [FORM_FIELDS_NAMES.INS_ADDRESS_LINE_2]: "",
  [FORM_FIELDS_NAMES.INS_STATE]: null,
  [FORM_FIELDS_NAMES.INS_CITY]: null,
  [FORM_FIELDS_NAMES.INS_ZIP_CODE]: "",
  [FORM_FIELDS_NAMES.INS_COUNTY]: null,
  [FORM_FIELDS_NAMES.INS_COUNTRY]: null,
  [FORM_FIELDS_NAMES.INS_CARD_FRONT]: null,
  [FORM_FIELDS_NAMES.INS_CARD_BACK]: null,
  [FORM_FIELDS_NAMES.SSN]: "",
  [FORM_FIELDS_NAMES.PROVIDER_MRN]: "",
  [FORM_FIELDS_NAMES.HOSPITAL_MRN]: "",
  [FORM_FIELDS_NAMES.COMMUNITY_MPI]: "",
  [FORM_FIELDS_NAMES.OTHER_IDENTIFIER_1]: "",
  [FORM_FIELDS_NAMES.OTHER_IDENTIFIER_2]: "",
});

export default function EditPatientDrawer({ open, editData }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleClose = () => {
    setActiveStep(1);
    setCompletedSteps(new Set());
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values, { resetForm }) => {
    // TODO: dispatch saga action
    resetForm();
    handleClose();
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    setActiveStep(2);
  };

  const handleBack = () => {
    setActiveStep(1);
  };

  return (
    <Drawer
      title="Edit Profile"
      open={open}
      close={handleClose}
      width="max-w-[85%] w-[85%]"
      footerButton={null}
    >
      <Formik
        initialValues={getInitialValues(editData)}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
          <Form className="flex flex-col h-full border border-border-light rounded-lg">
            <PatientStepBar
              steps={PATIENT_STEPS}
              activeStep={activeStep}
              completedSteps={completedSteps}
              onStepClick={setActiveStep}
            />

            <div className="flex-1 overflow-y-auto zenera-scrollbar p-5">
              {activeStep === 1 && (
                <PatientDetails
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              )}

              {activeStep === 2 && (
                <InsuranceAndIdentifiers
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E9E9E9] px-5">
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
              {activeStep === 1 ? (
                <Button variant="primaryTeal" size="sm" type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="primaryTeal" size="sm" type="button" onClick={handleSubmit}>
                  Update
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
