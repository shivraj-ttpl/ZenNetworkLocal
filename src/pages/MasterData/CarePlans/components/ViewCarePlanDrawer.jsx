import { useState, useCallback } from 'react';
import { Formik, Form } from 'formik';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';
import StepSidebar from './StepSidebar';
import { CARE_PLAN_STEPS } from './carePlanConstants';
import CurrentStateQuestions from './steps/CurrentStateQuestions';
import CareGapGoals from './steps/CareGapGoals';
import EducationGoal from './steps/EducationGoal';
import NutritionGoals from './steps/NutritionGoals';
import ExerciseGoals from './steps/ExerciseGoals';
import SelfCareStressGoals from './steps/SelfCareStressGoals';
import MedicationAdherenceGoals from './steps/MedicationAdherenceGoals';
import StepPlaceholder from './steps/StepPlaceholder';

const INITIAL_VALUES = {
  lifeGoals: {
    liveAsLong: '',
    goodQuality: '',
    liveMyWay: '',
    beingThere: '',
    avoidComplications: '',
    other: '',
    otherSpecify: '',
  },
  careGapQuestions: {
    hemoglobinA1C: '',
    lastHbA1C: '',
    urineAlbumin: '',
    urineAlbuminNormal: '',
    kidneyMedication: '',
    cholesterol: '',
    lastLDL: '',
    retinalExam: '',
    retinopathy: '',
    statinMedication: '',
    footExam: '',
    footNumbness: '',
  },
  careGapGoals: {
    bloodPressure: {
      lastValue: '142 / 88',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    bmi: {
      lastValue: '31.2',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    hba1c: {
      lastValue: '8.1',
      lastDate: '12/10/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    ldl: {
      lastValue: '96',
      lastDate: '12/10/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    urineAlbCr: {
      lastValue: '38',
      lastDate: '11/25/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    egfr: {
      lastValue: '82',
      lastDate: '11/25/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    onStatin: {
      lastValue: 'Yes',
      currentValue: '',
    },
    eyeExam: {
      lastDate: '11/25/2025',
      currentDate: null,
    },
    footExam: {
      lastDate: '11/25/2025',
      currentDate: null,
    },
  },
  educationGoal: {
    welcomeGettingStarted: { completedDate: null, goalThisMonth: false },
    trackingFoodActivity: { completedDate: null, goalThisMonth: false },
    beFatDetective: { completedDate: null, goalThisMonth: false },
    healthyEating: { completedDate: null, goalThisMonth: false },
    moveThoseMuscles: { completedDate: null, goalThisMonth: false },
    problemSolving: { completedDate: null, goalThisMonth: false },
    slipperySlopeLifestyle: { completedDate: null, goalThisMonth: false },
    healthyEatingOut: { completedDate: null, goalThisMonth: false },
    managingStress: { completedDate: null, goalThisMonth: false },
    stayingMotivated: { completedDate: null, goalThisMonth: false },
    heartHealth: { completedDate: null, goalThisMonth: false },
    takeChargeThoughts: { completedDate: null, goalThisMonth: false },
    gettingBackOnTrack: { completedDate: null, goalThisMonth: false },
    sleepAndHealth: { completedDate: null, goalThisMonth: false },
    timeManagement: { completedDate: null, goalThisMonth: false },
    stayingActiveForLife: { completedDate: null, goalThisMonth: false },
    healthyEatingForLife: { completedDate: null, goalThisMonth: false },
    lookingBackForward: { completedDate: null, goalThisMonth: false },
    copingHolidays: { completedDate: null, goalThisMonth: false },
    familySocialSupport: { completedDate: null, goalThisMonth: false },
    mindfulEating: { completedDate: null, goalThisMonth: false },
    preventingWeightRegain: { completedDate: null, goalThisMonth: false },
  },
  nutritionGoals: {
    caffeineDrinks: {
      lastValue: '4',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    hoursOfSleep: {
      lastValue: '5.5',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    waterIntake: {
      lastValue: '4',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    alcoholDrinks: {
      lastValue: '1',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    fruitsVegetables: {
      lastValue: '2',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    whiteFood: {
      lastValue: '3',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    sugarFood: {
      lastValue: '2',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    processedFood: {
      lastValue: '2',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    proteinGrams: {
      lastValue: '45',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
    weighFood: { lastValue: 'Yes', currentValue: '' },
    logFoodDrinks: { lastValue: 'Yes', currentValue: '' },
    logExercise: { lastValue: 'Yes', currentValue: '' },
  },
  exerciseGoals: {
    types: {
      walkingFast: false,
      running: false,
      biking: false,
      swimming: false,
      pickleBall: false,
      yoga: false,
      pilates: false,
      weightsMachines: false,
      other: false,
      otherSpecify: '',
    },
    measures: {
      cardiovascular: {
        lastValue: '60',
        lastDate: '12/15/2025',
        currentValue: '',
        currentDate: null,
        goal: null,
      },
      strength: {
        lastValue: '20',
        lastDate: '12/15/2025',
        currentValue: '',
        currentDate: null,
        goal: null,
      },
      flexibilityStretching: {
        lastValue: '15',
        lastDate: '12/15/2025',
        currentValue: '',
        currentDate: null,
        goal: null,
      },
    },
  },
  selfCareStressGoals: {
    types: {
      meditation: false,
      visualization: false,
      yoga: false,
      spaDays: false,
      manicures: false,
      seeingFriendsFamily: false,
      reading: false,
      exercise: false,
      crafting: false,
      makingArt: false,
      music: false,
      other: false,
      otherSpecify: '',
    },
    measure: {
      lastValue: '60',
      lastDate: '12/15/2025',
      currentValue: '',
      currentDate: null,
      goal: null,
    },
  },
  medicationAdherenceGoals: {
    strategies: {
      pillBox: false,
      timerReminder: false,
      toothBrush: false,
      someoneHelp: false,
      other: false,
      otherSpecify: '',
    },
    questions: {
      forgetMedicine: { lastValue: 'Some of the time', currentValue: '', strategy: '' },
      decideNotTake: { lastValue: 'Most of the time', currentValue: '', strategy: '' },
      runOut: { lastValue: 'Most of the time', currentValue: '', strategy: '' },
      forgetPrescriptions: { lastValue: 'Some of the time', currentValue: '', strategy: '' },
      missBeforeDoctor: { lastValue: 'Most of the time', currentValue: '', strategy: '' },
      stopFeelBetter: { lastValue: 'Some of the time', currentValue: '', strategy: '' },
      stopFeelWorse: { lastValue: 'Some of the time', currentValue: '', strategy: '' },
    },
  },
};

function StepContent({ stepId, formikProps }) {
  const step = CARE_PLAN_STEPS.find((s) => s.id === stepId);

  switch (stepId) {
    case 1:
      return <CurrentStateQuestions {...formikProps} />;
    case 2:
      return <CareGapGoals {...formikProps} />;
    case 3:
      return <EducationGoal {...formikProps} />;
    case 4:
      return <NutritionGoals {...formikProps} />;
    case 5:
      return <ExerciseGoals {...formikProps} />;
    case 6:
      return <SelfCareStressGoals {...formikProps} />;
    case 7:
      return <MedicationAdherenceGoals {...formikProps} />;
    default:
      return <StepPlaceholder title={step?.label || ''} />;
  }
}

export default function ViewCarePlanDrawer({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const totalSteps = CARE_PLAN_STEPS.length;
  const currentStepLabel =
    CARE_PLAN_STEPS.find((s) => s.id === activeStep)?.label || '';

  const handleClose = useCallback(() => {
    setActiveStep(1);
    setCompletedSteps(new Set());
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    setActiveStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps, activeStep]);

  const handlePrev = useCallback(() => {
    setActiveStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      setCompletedSteps((prevCompleted) => {
        const updated = new Set(prevCompleted);
        // Remove completed status for all steps from newStep onward
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
      setActiveStep((prev) => {
        if (stepId > prev) return stepId;
        // Going backward — remove completed for steps from stepId onward
        setCompletedSteps((prevCompleted) => {
          const updated = new Set(prevCompleted);
          for (let i = stepId; i <= totalSteps; i++) {
            updated.delete(i);
          }
          return updated;
        });
        return stepId;
      });
    },
    [totalSteps],
  );

  const handleFormSubmit = (values) => {
    // TODO: dispatch saga action for save
    handleClose();
  };

  const isFirstStep = activeStep === 1;
  const isLastStep = activeStep === totalSteps;

  return (
    <Drawer
      title="Add Care Plan"
      open={open}
      close={handleClose}
      width="w-[70%]"
      hideHeaderBorder
      footerButton={
        <div className="flex items-center justify-between w-full px-4 py-2">
          <Button
            variant="outlineTeal"
            size="sm"
            type="button"
            onClick={isFirstStep ? handleClose : handlePrev}
            disabled={isFirstStep}
          >
            Previous
          </Button>
          <Button
            variant="primaryTeal"
            size="sm"
            type="button"
            onClick={isLastStep ? undefined : handleNext}
          >
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </div>
      }
    >
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {(formikProps) => (
          <Form className="flex h-full min-h-0 overflow-hidden">
            {/* Sidebar */}
            <StepSidebar
              activeStep={activeStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />

            {/* Step content */}
            <div className="flex-1 overflow-y-auto p-6">
              <StepContent
                stepId={activeStep}
                formikProps={{
                  values: formikProps.values,
                  handleChange: formikProps.handleChange,
                  handleBlur: formikProps.handleBlur,
                  errors: formikProps.errors,
                  touched: formikProps.touched,
                  setFieldValue: formikProps.setFieldValue,
                }}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
