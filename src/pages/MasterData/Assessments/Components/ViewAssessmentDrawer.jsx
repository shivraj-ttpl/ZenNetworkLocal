import { Form, Formik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';

import { componentKey, setCloseDrawer } from '../assessmentsSlice';
import { ASSESSMENT_STEPS_MAP, PRAPARE_STEPS } from '../constant';
import AssessmentStepSidebar from './AssessmentStepSidebar';
import {
  Disabilities,
  Education,
  Employment,
  FamilyCommunitySupport,
  FinancialStrain,
  Food,
  LivingSituation,
  MentalHealth,
  PhysicalActivity,
  Safety,
  SubstanceUse,
  Transportation,
  Utilities,
} from './sections/ahcHrsn';
import {
  Allergies,
  AnnualTesting,
  CancerScreeningSummary,
  Demographics,
  EmotionalMentalHealth,
  FamilyHistory,
  HealthCareAccess,
  Immunizations,
  LifestyleAndSocialHabits,
  LifestyleBehaviorQuestions,
  MedicationAdherence,
  Medications,
  PastMedicalHistory,
  PromisGlobalHealth,
  ReasonForVisit,
  Signatures,
  SocialDeterminants,
  SubstanceUseNida,
  WomensHealth,
} from './sections/familyMedicine';
import {
  FamilyAndHome,
  MoneyAndResources,
  OptionalAdditionalQuestions,
  PersonalCharacteristics,
  SocialEmotionalHealth,
} from './sections/prapare';
import StepPlaceholder from './sections/StepPlaceholder';

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
  3: HealthCareAccess,
  4: PromisGlobalHealth,
  5: Medications,
  6: MedicationAdherence,
  7: Allergies,
  8: PastMedicalHistory,
  9: WomensHealth,
  10: FamilyHistory,
  11: LifestyleAndSocialHabits,
  12: LifestyleBehaviorQuestions,
  13: SubstanceUseNida,
  14: EmotionalMentalHealth,
  15: SocialDeterminants,
  16: Immunizations,
  17: CancerScreeningSummary,
  18: AnnualTesting,
  19: Signatures,
};

const STEP_COMPONENTS_MAP = {
  PRAPARE: PRAPARE_STEP_COMPONENTS,
  'AHC HRSN Screening': AHC_HRSN_STEP_COMPONENTS,
  'Family Medicine Intake and Annual Form': FAMILY_MEDICINE_STEP_COMPONENTS,
};

const INITIAL_VALUES = {
  personalCharacteristics: {
    ethnicity: '',
    race: {},
    farmWork: '',
    armedForces: '',
    language: null,
  },
  familyAndHome: {
    familyMembers: '',
    familyMembersDecline: '',
    housing: '',
    worriedHousing: '',
    country: null,
    state: null,
    city: '',
    zipCode: '',
  },
  moneyAndResources: {
    education: '',
    work: '',
    workOtherSpecify: '',
    insurance: {},
    income: null,
  },
  socialEmotionalHealth: {
    socialConnection: '',
    work: '',
    insurance: '',
    income: '',
    incomeDecline: '',
    unableToGet: {},
    unableToGetOther: '',
    transportation: {},
    stress: '',
  },
  optionalAdditionalQuestions: {
    jailPrison: '',
    refugee: '',
    physicallySafe: '',
    afraidOfPartner: '',
  },
  // AHC HRSN
  livingSituation: { housing: '', problems: {} },
  food: { worriedFoodRunOut: '', foodDidntLast: '' },
  transportation: { lackOfTransportation: '' },
  utilities: { threatened: '' },
  safety: { physicallyHurt: '', insult: '', threaten: '', screamCurse: '' },
  financialStrain: { payForBasics: '' },
  employment: { helpWithWork: '' },
  familyCommunitySupport: { dailyHelp: '', lonely: '' },
  education: { otherLanguage: '', helpWithSchool: '' },
  physicalActivity: { daysPerWeek: '', minutesPerDay: '' },
  substanceUse: {
    alcohol: '',
    tobacco: '',
    prescriptionDrugs: '',
    illegalDrugs: '',
  },
  mentalHealth: { littleInterest: '', feelingDown: '', stress: '' },
  disabilities: { difficultyConcentrating: '', difficultyErrands: '' },
  // Family Medicine — all 19 sections
  demographics: {
    firstName: '',
    middleName: '',
    lastName: '',
    sexAtBirth: '',
    dateOfBirth: '',
    maritalStatus: '',
    identifiedGender: '',
    raceEthnicity: '',
    preferredLanguage: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    preferredContact: '',
    pronouns: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    zipCode: '',
    county: '',
    country: '',
    noInsurance: false,
    ssn: '',
    providerMrn: '',
    hospitalMrn: '',
    communityMpi: '',
    otherIdentifier1: '',
    otherIdentifier2: '',
    hasInternetAccess: '',
    hasSmartPhone: '',
    preferredContactMethod: '',
    interestedInPrograms: '',
    interestedInAdvisory: '',
    informationConfirmed: false,
  },
  reasonForVisit: {
    bringsYouIn: '',
    mattersToYou: '',
    healthGoal1: '',
    healthGoal2: '',
    healthGoal3: '',
    informationConfirmed: false,
  },
  healthCareAccess: {
    hasRegularProvider: '',
    lastWellnessVisitAmount: '',
    lastWellnessVisitUnit: '',
    erVisits: '',
    overnightHospital: '',
  },
  promisGlobalHealth: {
    generalHealth: '',
    qualityOfLife: '',
    physicalHealth: '',
    mentalHealth: '',
    socialActivities: '',
    carryOutActivities: '',
    emotionalProblems: '',
    fatigue: '',
    averagePain: '',
    sleepQuality: '',
  },
  medications: { informationConfirmed: false },
  medicationAdherence: {
    forgetMedicine: '',
    decidedNotToTake: '',
    runOutOfMedicine: '',
    forgetToGetPrescription: '',
    skipBeforeDoctor: '',
    stopWhenFeelBetter: '',
    stopWhenFeelWorse: '',
  },
  allergies: { informationConfirmed: false },
  pastMedicalHistory: {
    conditions: {},
  },
  womensHealth: {
    timesPregnant: '',
    children: '',
    miscarriages: '',
    terminations: '',
    lastMenstrualPeriod: '',
    usingContraception: '',
    currentlyPregnant: '',
  },
  familyHistory: {},
  lifestyleAndSocialHabits: {
    satisfiedRelationships: '',
    someoneToConfide: '',
    qualitySleep: '',
    stressLevel: '',
    stressReduction: '',
    mindfulness: '',
    feelSafe: '',
    satisfiedSexLife: '',
    safeSex: '',
    lifePurpose: '',
    workSatisfaction: '',
    balanceWork: '',
  },
  lifestyleBehaviorQuestions: {
    height: '',
    weight: '',
    bmi: '',
    idealWeight: '',
    caffeineDrinks: '',
    sleepHours: '',
    waterCups: '',
    waterOunces: '',
    alcoholDrinks: '',
    fruitsVegetables: '',
    whiteFoodServings: '',
    sugarServings: '',
    processedFoods: '',
    proteinGrams: '',
    weighFood: '',
    logFood: '',
    cardioMinutes: '',
    strengthMinutes: '',
    stretchingMinutes: '',
    selfCareFrequency: '',
    screenTime: '',
    mainStress: '',
    interestedCoaching: '',
    interestedCounseling: '',
  },
  substanceUseNida: {
    tobacco: '',
    alcohol: '',
    prescriptionDrugs: '',
    illegalDrugs: '',
  },
  emotionalMentalHealth: {
    littleInterest: '',
    feelingDown: '',
    troubleSleeping: '',
    feelingTired: '',
    poorAppetite: '',
    feelingBad: '',
    troubleConcentrating: '',
    movingSlow: '',
    selfHarm: '',
    phq9Score: '',
    phq9Severity: '',
    nervousAnxious: '',
    unableToControlWorrying: '',
    worryingTooMuch: '',
    troubleRelaxing: '',
    beingRestless: '',
    easilyAnnoyed: '',
    feelingAfraid: '',
    gad7Score: '',
    gad7Severity: '',
    wishedDead: '',
    thoughtsKilling: '',
    thoughtHow: '',
    intentionToAct: '',
    startedToPrepare: '',
  },
  socialDeterminants: {
    currentHousing: '',
    worriedHousing: '',
    lacked: '',
    transportation: '',
    feelSafe: '',
    talkToPeople: '',
    workSituation: '',
    jobTitle: '',
    workOutdoors: '',
    education: '',
    householdIncome: '',
    falls: '',
    wantHelp: '',
    urgentNeeds: '',
    urgentNeedsDescribe: '',
  },
  immunizations: {},
  cancerScreenings: {},
  annualTesting: {
    allScreeningsDone: '',
    allScreeningsDate: '',
    tests: {},
  },
  signatures: {
    gatheredManually: true,
    patientSignature: null,
    drawnSignature: null,
    patientDate: '',
    provider: null,
    providerReview: '',
    providerDate: '',
  },
};

export default function ViewAssessmentDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen = false, viewData = null } = useSelector(
    (state) => state[componentKey] ?? {},
  );

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeStep]);

  const assessmentName = viewData?.name || '';
  const isFamilyMedicine =
    assessmentName === 'Family Medicine Intake and Annual Form';
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
    [activeStep, completedSteps],
  );

  const renderStepContent = (formikProps) => {
    const StepComponent = stepComponents[activeStep];
    if (StepComponent) {
      return <StepComponent {...formikProps} />;
    }
    const stepLabel = steps.find((s) => s.id === activeStep)?.label || '';
    return <StepPlaceholder stepLabel={stepLabel} />;
  };

  return (
    <Drawer
      title={`${assessmentName} Assessment`}
      open={drawerOpen}
      close={handleClose}
      width={isFamilyMedicine ? 'w-[90%] max-w-[90%]' : 'max-w-[70%] w-[70%]'}
      hideOverflow
      footerButton={
        <div className="flex justify-between w-full px-2 ">
          {!isFirstStep ? (
            <Button
              variant="outlineBlue"
              size="sm"
              type="button"
              onClick={handlePrev}
            >
              Previous
            </Button>
          ) : (
            <Button
              variant="outlineBlue"
              size="sm"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={isLastStep ? handleClose : handleNext}
          >
            {
              isLastStep ? 'Close' : 'Next'
              // ? assessmentName === 'AHC HRSN Screening'
              //   ? 'Assign to Patient'
              //   : isFamilyMedicine
              //     ? 'Save & Finish'
              //     : 'Close'
              // : 'Next'
            }
          </Button>
        </div>
      }
    >
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={() => {}}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className="flex min-h-0 h-[calc(100vh-130px)] overflow-hidden">
            <div className="h-[calc(100vh-140px)]  border-border  border-r overflow-hidden overflow-y-auto">
              {' '}
              <AssessmentStepSidebar
                steps={steps}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
            </div>

            <div
              ref={contentRef}
              className="flex-1 h-full overflow-y-auto pl-6 pr-4"
            >
              <fieldset
                disabled
                className="border-none p-0 m-0 min-w-0 [&_label:has(input[type='radio'])]:pointer-events-none [&_label:has(input[type='radio'])]:cursor-not-allowed [&_label:has(input[type='checkbox'])]:cursor-not-allowed! [&_label:has(input[type='checkbox'])>*]:pointer-events-none"
              >
                {renderStepContent({
                  values,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                })}
              </fieldset>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
