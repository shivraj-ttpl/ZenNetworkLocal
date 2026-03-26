import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import AssessmentStepSidebar from "./AssessmentStepSidebar";
import StepPlaceholder from "./sections/StepPlaceholder";
import {
  PersonalCharacteristics,
  FamilyAndHome,
  MoneyAndResources,
  SocialEmotionalHealth,
  OptionalAdditionalQuestions,
} from "./sections/prapare";
import {
  LivingSituation,
  Food,
  Transportation,
  Utilities,
  Safety,
  FinancialStrain,
  Employment,
  FamilyCommunitySupport,
  Education,
  PhysicalActivity,
  SubstanceUse,
  MentalHealth,
  Disabilities,
} from "./sections/ahcHrsn";
import {
  Demographics,
  ReasonForVisit,
  PromisGlobalHealth,
  Medications,
  MedicationAdherence,
  Allergies,
  PastMedicalHistory,
  FamilyHistory,
  LifestyleAndSocialHabits,
  SubstanceUseNida,
  EmotionalMentalHealth,
  SocialDeterminants,
  Immunizations,
  CancerScreeningSummary,
  Signatures,
} from "./sections/familyMedicine";
import HorizontalStepBar from "./HorizontalStepBar";
import { componentKey, setCloseDrawer } from "../assessmentsSlice";
import { ASSESSMENT_STEPS_MAP, PRAPARE_STEPS } from "../constant";

// ─── Step component registry per assessment ───
const PRAPARE_STEP_COMPONENTS = {
  1: PersonalCharacteristics,
  2: FamilyAndHome,
  3: MoneyAndResources,
  4: SocialEmotionalHealth,
  5: OptionalAdditionalQuestions,
};

const AHC_HRSN_STEP_COMPONENTS = {
  1: LivingSituation,
  2: Food,
  3: Transportation,
  4: Utilities,
  5: Safety,
  6: FinancialStrain,
  7: Employment,
  8: FamilyCommunitySupport,
  9: Education,
  10: PhysicalActivity,
  11: SubstanceUse,
  12: MentalHealth,
  13: Disabilities,
};

const FAMILY_MEDICINE_STEP_COMPONENTS = {
  1: Demographics,
  2: ReasonForVisit,
  3: PromisGlobalHealth,
  4: Medications,
  5: MedicationAdherence,
  6: Allergies,
  7: PastMedicalHistory,
  8: FamilyHistory,
  9: LifestyleAndSocialHabits,
  10: SubstanceUseNida,
  11: EmotionalMentalHealth,
  12: SocialDeterminants,
  13: Immunizations,
  14: CancerScreeningSummary,
  15: Signatures,
};

const STEP_COMPONENTS_MAP = {
  PRAPARE: PRAPARE_STEP_COMPONENTS,
  "AHC HRSN Screening": AHC_HRSN_STEP_COMPONENTS,
  "Family Medicine Intake and Annual Form": FAMILY_MEDICINE_STEP_COMPONENTS,
};

const INITIAL_VALUES = {
  personalCharacteristics: {
    ethnicity: "",
    race: {},
    farmWork: "",
    armedForces: "",
    language: null,
  },
  familyAndHome: {
    familyMembers: "",
    familyMembersDecline: "",
    housing: "",
    worriedHousing: "",
    country: null,
    state: null,
    city: "",
    zipCode: "",
  },
  moneyAndResources: {
    education: "",
    work: "",
    workOtherSpecify: "",
    insurance: {},
    income: null,
  },
  socialEmotionalHealth: {
    socialConnection: "",
    work: "",
    insurance: "",
    income: "",
    incomeDecline: "",
    unableToGet: {},
    unableToGetOther: "",
    transportation: {},
    stress: "",
  },
  optionalAdditionalQuestions: {
    jailPrison: "",
    refugee: "",
    physicallySafe: "",
    afraidOfPartner: "",
  },
  // AHC HRSN
  livingSituation: { housing: "", problems: {} },
  food: { worriedFoodRunOut: "", foodDidntLast: "" },
  transportation: { lackOfTransportation: "" },
  utilities: { threatened: "" },
  safety: { physicallyHurt: "", insult: "", threaten: "", screamCurse: "" },
  financialStrain: { payForBasics: "" },
  employment: { helpWithWork: "" },
  familyCommunitySupport: { dailyHelp: "", lonely: "" },
  education: { otherLanguage: "", helpWithSchool: "" },
  physicalActivity: { daysPerWeek: "", minutesPerDay: "" },
  substanceUse: { alcohol: "", tobacco: "", prescriptionDrugs: "", illegalDrugs: "" },
  mentalHealth: { littleInterest: "", feelingDown: "", stress: "" },
  disabilities: { difficultyConcentrating: "", difficultyErrands: "" },
  // Family Medicine Intake
  demographics: {
    firstName: "", middleName: "", lastName: "", dob: "", gender: "",
    maritalStatus: "", race: "", ethnicity: "", language: "",
    phone: "", email: "", emergencyContact: "", address: "", city: "", state: "", zipCode: "",
  },
  reasonForVisit: { mainReason: "", symptoms: "", symptomOnset: "", healthGoals: "", additionalConcerns: "" },
  promisGlobalHealth: {
    generalHealth: "", qualityOfLife: "", physicalHealth: "", mentalHealth: "",
    socialActivities: "", carryOutActivities: "", emotionalProblems: "", fatigue: "", painLevel: "",
  },
  medications: [],
  medicationAdherence: {
    forgetMedicine: "", decidedNotToTake: "", forgetToGetPrescription: "",
    runOutOfMedicine: "", skipBeforeDoctor: "", missWhenFeelBetter: "", missWhenFeelSick: "",
  },
  allergies: [],
  pastMedicalHistory: { conditions: {}, otherConditions: "", surgeries: "", additionalNotes: "" },
  familyHistory: {},
  lifestyleAndSocialHabits: {
    exercise: "", exerciseFrequency: "", diet: "", sleepHours: "",
    sleepProblems: "", caffeine: "", seatBelt: "", sunscreen: "",
  },
  substanceUseNida: { alcohol: "", tobacco: "", prescriptionDrugs: "", illegalDrugs: "" },
  emotionalMentalHealth: {
    littleInterest: "", feelingDown: "", troubleSleeping: "", feelingTired: "",
    poorAppetite: "", feelingBad: "", troubleConcentrating: "", movingSlow: "",
    selfHarm: "", difficulty: "",
  },
  socialDeterminants: {
    housing: "", food: "", transportation: "", utilities: "",
    safety: "", financialStrain: "", employment: "", education: "",
  },
  immunizations: [],
  cancerScreenings: [],
  signatures: { patientName: "", patientDate: "", guardianName: "", relationship: "", additionalNotes: "" },
};

export default function ViewAssessmentDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen = false, viewData = null } = useSelector(
    (state) => state[componentKey] ?? {}
  );

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const assessmentName = viewData?.name || "";
  const isFamilyMedicine = assessmentName === "Family Medicine Intake and Annual Form";
  const steps = ASSESSMENT_STEPS_MAP[assessmentName] || PRAPARE_STEPS;
  const stepComponents = STEP_COMPONENTS_MAP[assessmentName] || {};
  const totalSteps = steps.length;
  const isFirstStep = activeStep === 1;
  const isLastStep = activeStep === totalSteps;

  const handleClose = useCallback(() => {
    setActiveStep(1);
    setCompletedSteps(new Set());
    dispatch(setCloseDrawer());
  }, [dispatch]);

  const handleNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    setActiveStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps, activeStep]);

  const handlePrev = useCallback(() => {
    setActiveStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      setCompletedSteps((prevCompleted) => {
        const updated = new Set(prevCompleted);
        for (let i = newStep; i <= totalSteps; i++) {
          updated.delete(i);
        }
        return updated;
      });
      return newStep;
    });
  }, [totalSteps]);

  const handleStepClick = useCallback(
    (stepId) => {
      if (stepId < activeStep || completedSteps.has(stepId)) {
        setActiveStep(stepId);
      }
    },
    [activeStep, completedSteps]
  );

  const renderStepContent = (formikProps) => {
    const StepComponent = stepComponents[activeStep];
    if (StepComponent) {
      return <StepComponent {...formikProps} />;
    }
    const stepLabel = steps.find((s) => s.id === activeStep)?.label || "";
    return <StepPlaceholder stepLabel={stepLabel} />;
  };

  return (
    <Drawer
      title={`${assessmentName} Assessment`}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[70%] w-[70%]"
      hideOverflow
      footerButton={
        <div className="flex justify-between w-full px-2 pb-2">
          {!isFirstStep ? (
            <Button variant="outlineBlue" size="sm" type="button" onClick={handlePrev}>
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={isLastStep ? handleClose : handleNext}
          >
            {isLastStep ? (assessmentName === "AHC HRSN Screening" ? "Assign to Patient" : "Close") : "Next"}
          </Button>
        </div>
      }
    >
      <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}} enableReinitialize>
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={`flex ${isFamilyMedicine ? "flex-col h-[86vh]" : ""} min-h-0 overflow-hidden`}>
            {isFamilyMedicine ? (
              <HorizontalStepBar
                steps={steps}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
            ) : (
              <AssessmentStepSidebar
                steps={steps}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
            )}
            <div className={`${isFamilyMedicine ? "flex-1  h-[50vh]  px-6 py-4" : "flex-1 h-[86vh] pl-6"} overflow-y-auto zenera-scrollbar`}>
              {renderStepContent({ values, handleChange, handleBlur, setFieldValue })}
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
