import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { FORM_FIELDS_NAMES, PATIENT_STEPS } from '../constant';
import { patientActions } from '../providerGroupPatientsSaga';
import { componentKey, setCloseDrawer } from '../providerGroupPatientsSlice';
import PatientStepBar from './PatientStepBar';
import InsuranceAndIdentifiers, {
  emptyInsurance,
} from './steps/InsuranceAndIdentifiers';
import PatientDetails, { emptyFamilyContact } from './steps/PatientDetails';

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FIRST_NAME]: Yup.string().required(
    'First Name is required',
  ),
  [FORM_FIELDS_NAMES.LAST_NAME]: Yup.string().required('Last Name is required'),
  [FORM_FIELDS_NAMES.DATE_OF_BIRTH]: Yup.string().required(
    'Date of Birth is required',
  ),
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: Yup.string().required(
    'Address Line 1 is required',
  ),
  [FORM_FIELDS_NAMES.ZIP_CODE]: Yup.string().required('Zip Code is required'),
});

const getInitialValues = (detail) => ({
  photo: null,
  [FORM_FIELDS_NAMES.FIRST_NAME]: detail?.firstName || '',
  [FORM_FIELDS_NAMES.LAST_NAME]: detail?.lastName || '',
  [FORM_FIELDS_NAMES.MIDDLE_NAME]: detail?.middleName || '',
  [FORM_FIELDS_NAMES.SEX_AT_BIRTH]: detail?.sexAtBirth
    ? { label: detail.sexAtBirth, value: detail.sexAtBirth }
    : null,
  [FORM_FIELDS_NAMES.DATE_OF_BIRTH]: detail?.dateOfBirth || '',
  [FORM_FIELDS_NAMES.MARITAL_STATUS]: detail?.maritalStatus
    ? { label: detail.maritalStatus, value: detail.maritalStatus }
    : null,
  [FORM_FIELDS_NAMES.IDENTIFIED_GENDER]: detail?.identifiedGender
    ? { label: detail.identifiedGender, value: detail.identifiedGender }
    : null,
  [FORM_FIELDS_NAMES.RACE]: detail?.race
    ? { label: detail.race, value: detail.race }
    : null,
  [FORM_FIELDS_NAMES.ETHNICITY]: detail?.ethnicity
    ? { label: detail.ethnicity, value: detail.ethnicity }
    : null,
  [FORM_FIELDS_NAMES.PREFERRED_LANGUAGE]: detail?.preferredLanguage
    ? { label: detail.preferredLanguage, value: detail.preferredLanguage }
    : null,
  [FORM_FIELDS_NAMES.EMAIL]: detail?.email || '',
  [FORM_FIELDS_NAMES.PRIMARY_CONTACT]: detail?.primaryContactNumber || '',
  [FORM_FIELDS_NAMES.SECONDARY_CONTACT]: detail?.secondaryContactNumber || '',
  [FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT]:
    detail?.preferredContactMethod
      ? {
          label: detail.preferredContactMethod,
          value: detail.preferredContactMethod,
        }
      : null,
  [FORM_FIELDS_NAMES.ADDRESS_LINE_1]: detail?.address?.addressLine1 || '',
  [FORM_FIELDS_NAMES.ADDRESS_LINE_2]: detail?.address?.addressLine2 || '',
  [FORM_FIELDS_NAMES.STATE]: detail?.address?.state
    ? { label: detail.address.state, value: detail.address.state }
    : null,
  [FORM_FIELDS_NAMES.TIMEZONE]: null,
  [FORM_FIELDS_NAMES.CITY]: detail?.address?.city
    ? { label: detail.address.city, value: detail.address.city }
    : null,
  [FORM_FIELDS_NAMES.ZIP_CODE]: detail?.address?.zipCode || '',
  [FORM_FIELDS_NAMES.COUNTY]: detail?.address?.county
    ? { label: detail.address.county, value: detail.address.county }
    : null,
  [FORM_FIELDS_NAMES.COUNTRY]: detail?.address?.country
    ? { label: detail.address.country, value: detail.address.country }
    : null,
  [FORM_FIELDS_NAMES.FAMILY_CONTACTS]:
    detail?.guardianContacts?.length > 0
      ? detail.guardianContacts.map((c) => ({
          [FORM_FIELDS_NAMES.FC_EMERGENCY]: c.isEmergencyContact || false,
          [FORM_FIELDS_NAMES.FC_FIRST_NAME]: c.firstName || '',
          [FORM_FIELDS_NAMES.FC_LAST_NAME]: c.lastName || '',
          [FORM_FIELDS_NAMES.FC_RELATIONSHIP]: c.relationshipType
            ? { label: c.relationshipType, value: c.relationshipType }
            : null,
          [FORM_FIELDS_NAMES.FC_EMAIL]: c.email || '',
          [FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT]: c.primaryContactNumber || '',
          [FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT]:
            c.secondaryContactNumber || '',
        }))
      : [{ ...emptyFamilyContact }],
  [FORM_FIELDS_NAMES.REFERRING_PROVIDER]: null,
  [FORM_FIELDS_NAMES.PRIMARY_CARE_PROVIDER]: null,
  [FORM_FIELDS_NAMES.PRIMARY_CARE_MANAGER]: null,
  [FORM_FIELDS_NAMES.SECONDARY_CARE_MANAGER]: null,
  [FORM_FIELDS_NAMES.ADDITIONAL_CARE_TEAM_MEMBER]: null,
  [FORM_FIELDS_NAMES.CONSENT_TO_MESSAGE]: detail?.consentToMessage ?? false,
  [FORM_FIELDS_NAMES.CONSENT_TO_CALL]: detail?.consentToCall ?? false,
  [FORM_FIELDS_NAMES.CONSENT_TO_EMAIL]: detail?.consentToEmail ?? false,
  [FORM_FIELDS_NAMES.ENABLE_CALL_RECORDING]:
    detail?.enableCallRecording ?? false,
  [FORM_FIELDS_NAMES.INSURANCES]:
    detail?.insurances?.length > 0
      ? detail.insurances.map((ins) => ({
          id: ins.id || undefined,
          [FORM_FIELDS_NAMES.INS_NO_INSURANCE]: false,
          [FORM_FIELDS_NAMES.INS_MARK_PRIMARY]: false,
          [FORM_FIELDS_NAMES.INS_TYPE]: ins.insuranceType
            ? { label: ins.insuranceType, value: ins.insuranceType }
            : null,
          [FORM_FIELDS_NAMES.INS_NAME]: ins.insuranceName
            ? { label: ins.insuranceName, value: ins.insuranceName }
            : null,
          [FORM_FIELDS_NAMES.INS_RELATIONSHIP]: ins.relationshipToInsured
            ? {
                label: ins.relationshipToInsured,
                value: ins.relationshipToInsured,
              }
            : null,
          [FORM_FIELDS_NAMES.INS_POLICY_HOLDER]: ins.policyHolderName || '',
          [FORM_FIELDS_NAMES.INS_EFFECTIVE_DATE]: ins.effectiveDate || '',
          [FORM_FIELDS_NAMES.INS_POLICY_NUMBER]: ins.policyNumber || '',
          [FORM_FIELDS_NAMES.INS_GROUP_PLAN]: ins.groupPlan || '',
          [FORM_FIELDS_NAMES.INS_EMPLOYER]: ins.employerSchoolName || '',
        }))
      : [{ ...emptyInsurance }],
  [FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]: false,
  [FORM_FIELDS_NAMES.INS_ADDRESS_LINE_1]: '',
  [FORM_FIELDS_NAMES.INS_ADDRESS_LINE_2]: '',
  [FORM_FIELDS_NAMES.INS_STATE]: null,
  [FORM_FIELDS_NAMES.INS_CITY]: null,
  [FORM_FIELDS_NAMES.INS_ZIP_CODE]: '',
  [FORM_FIELDS_NAMES.INS_COUNTY]: null,
  [FORM_FIELDS_NAMES.INS_COUNTRY]: null,
  [FORM_FIELDS_NAMES.INS_CARD_FRONT]: null,
  [FORM_FIELDS_NAMES.INS_CARD_BACK]: null,
  [FORM_FIELDS_NAMES.SSN]: detail?.ssn || '',
  [FORM_FIELDS_NAMES.PROVIDER_MRN]: detail?.providerMrn || '',
  [FORM_FIELDS_NAMES.HOSPITAL_MRN]: detail?.hospitalMrn || '',
  [FORM_FIELDS_NAMES.COMMUNITY_MPI]: detail?.communityMpi || '',
  [FORM_FIELDS_NAMES.OTHER_IDENTIFIER_1]: detail?.otherIdentifier1 || '',
  [FORM_FIELDS_NAMES.OTHER_IDENTIFIER_2]: detail?.otherIdentifier2 || '',
});

const EMPTY_STATE = {};

export default function EditPatientDrawer({ open, editData }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const state = useSelector((s) => s[componentKey] ?? EMPTY_STATE);
  const isLoadingDetail = useLoadingKey(LOADING_KEYS.PG_PATIENTS_GET_BY_ID);
  const isSaving = useLoadingKey(LOADING_KEYS.PG_PATIENTS_PATCH_UPDATE);

  const { patientDetail } = state;

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (!open || !editData?.id || !providerGroupId || !tenantName) return;
    dispatch(
      patientActions.fetchPatientById({
        id: editData.id,
        providerGroupId,
        tenantName,
      }),
    );
  }, [open, editData, providerGroupId, tenantName, dispatch]);

  const handleClose = () => {
    setActiveStep(1);
    setCompletedSteps(new Set());
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const guardianContacts = (values[FORM_FIELDS_NAMES.FAMILY_CONTACTS] || [])
      .filter((c) => c[FORM_FIELDS_NAMES.FC_FIRST_NAME])
      .map((c) => ({
        isEmergencyContact: c[FORM_FIELDS_NAMES.FC_EMERGENCY] || false,
        firstName: c[FORM_FIELDS_NAMES.FC_FIRST_NAME],
        lastName: c[FORM_FIELDS_NAMES.FC_LAST_NAME],
        relationshipType: c[FORM_FIELDS_NAMES.FC_RELATIONSHIP]?.value || '',
        email: c[FORM_FIELDS_NAMES.FC_EMAIL],
        primaryContactNumber: c[FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT],
        secondaryContactNumber: c[FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT],
      }));

    const insurances = (values[FORM_FIELDS_NAMES.INSURANCES] || [])
      .filter((ins) => ins[FORM_FIELDS_NAMES.INS_TYPE])
      .map((ins) => ({
        ...(ins.id ? { id: ins.id } : {}),
        insuranceType: ins[FORM_FIELDS_NAMES.INS_TYPE]?.value || '',
        insuranceName: ins[FORM_FIELDS_NAMES.INS_NAME]?.value || '',
        relationshipToInsured:
          ins[FORM_FIELDS_NAMES.INS_RELATIONSHIP]?.value || '',
        policyHolderName: ins[FORM_FIELDS_NAMES.INS_POLICY_HOLDER] || '',
        effectiveDate: ins[FORM_FIELDS_NAMES.INS_EFFECTIVE_DATE] || '',
        policyNumber: ins[FORM_FIELDS_NAMES.INS_POLICY_NUMBER] || '',
        groupPlan: ins[FORM_FIELDS_NAMES.INS_GROUP_PLAN] || '',
        employerSchoolName: ins[FORM_FIELDS_NAMES.INS_EMPLOYER] || '',
      }));

    const data = {
      firstName: values[FORM_FIELDS_NAMES.FIRST_NAME],
      lastName: values[FORM_FIELDS_NAMES.LAST_NAME],
      middleName: values[FORM_FIELDS_NAMES.MIDDLE_NAME] || undefined,
      sexAtBirth: values[FORM_FIELDS_NAMES.SEX_AT_BIRTH]?.value || undefined,
      dateOfBirth: values[FORM_FIELDS_NAMES.DATE_OF_BIRTH]
        ? dayjs(values[FORM_FIELDS_NAMES.DATE_OF_BIRTH]).format('YYYY-MM-DD')
        : undefined,
      identifiedGender:
        values[FORM_FIELDS_NAMES.IDENTIFIED_GENDER]?.value || undefined,
      maritalStatus:
        values[FORM_FIELDS_NAMES.MARITAL_STATUS]?.value || undefined,
      race: values[FORM_FIELDS_NAMES.RACE]?.value || undefined,
      ethnicity: values[FORM_FIELDS_NAMES.ETHNICITY]?.value || undefined,
      preferredLanguage:
        values[FORM_FIELDS_NAMES.PREFERRED_LANGUAGE]?.value || undefined,
      email: values[FORM_FIELDS_NAMES.EMAIL] || undefined,
      primaryContactNumber:
        values[FORM_FIELDS_NAMES.PRIMARY_CONTACT] || undefined,
      secondaryContactNumber:
        values[FORM_FIELDS_NAMES.SECONDARY_CONTACT] || undefined,
      preferredContactMethod:
        values[FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT]?.value ||
        undefined,
      consentToMessage: values[FORM_FIELDS_NAMES.CONSENT_TO_MESSAGE],
      consentToCall: values[FORM_FIELDS_NAMES.CONSENT_TO_CALL],
      consentToEmail: values[FORM_FIELDS_NAMES.CONSENT_TO_EMAIL],
      enableCallRecording: values[FORM_FIELDS_NAMES.ENABLE_CALL_RECORDING],
      address: {
        addressLine1: values[FORM_FIELDS_NAMES.ADDRESS_LINE_1] || '',
        addressLine2: values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || '',
        city: values[FORM_FIELDS_NAMES.CITY]?.value || '',
        state: values[FORM_FIELDS_NAMES.STATE]?.value || '',
        zipCode: values[FORM_FIELDS_NAMES.ZIP_CODE] || '',
        county: values[FORM_FIELDS_NAMES.COUNTY]?.value || '',
        country: values[FORM_FIELDS_NAMES.COUNTRY]?.value || 'US',
      },
      guardianContacts,
      insurances,
      ssn: values[FORM_FIELDS_NAMES.SSN] || undefined,
      providerMrn: values[FORM_FIELDS_NAMES.PROVIDER_MRN] || undefined,
      hospitalMrn: values[FORM_FIELDS_NAMES.HOSPITAL_MRN] || undefined,
      communityMpi: values[FORM_FIELDS_NAMES.COMMUNITY_MPI] || undefined,
      otherIdentifier1:
        values[FORM_FIELDS_NAMES.OTHER_IDENTIFIER_1] || undefined,
      otherIdentifier2:
        values[FORM_FIELDS_NAMES.OTHER_IDENTIFIER_2] || undefined,
    };

    dispatch(
      patientActions.updatePatient({
        id: editData?.id,
        providerGroupId,
        tenantName,
        data,
      }),
    );
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    setActiveStep(2);
  };

  const detail = patientDetail || editData;

  return (
    <Drawer
      title="Edit Profile"
      open={open}
      close={handleClose}
      width="max-w-[85%] w-[85%]"
      footerButton={null}
    >
      {isLoadingDetail ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse space-y-4 w-full px-8">
            <div className="h-4 bg-neutral-200 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={getInitialValues(detail)}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <Form className="flex flex-col h-full border border-border-light rounded-lg">
              <PatientStepBar
                steps={PATIENT_STEPS}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={setActiveStep}
              />

              <div className="flex-1 overflow-y-auto  p-5">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E9E9E9] px-5">
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
                {activeStep === 1 ? (
                  <Button
                    variant="outlineBlue"
                    size="sm"
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primaryBlue"
                    size="sm"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Updating...' : 'Update'}
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Drawer>
  );
}
