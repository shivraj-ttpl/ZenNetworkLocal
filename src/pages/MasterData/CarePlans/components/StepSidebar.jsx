import { Icon } from '@/components/icons';

import { CARE_PLAN_STEPS } from './carePlanConstants';

export default function StepSidebar({
  activeStep,
  completedSteps = new Set(),
  onStepClick,
}) {
  const totalSteps = CARE_PLAN_STEPS.length;

  return (
    <nav className="w-70 flex-shrink-0  bg-surface overflow-y-auto">
      <div className="px-5 py-5 m-4 border border-border rounded-lg h-[85vh]">
        {CARE_PLAN_STEPS.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const isLast = index === totalSteps - 1;

          return (
            <div key={step.id}>
              {/* Step row: circle + label */}
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="flex items-center gap-3 w-full text-left cursor-pointer"
              >
                <span
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    text-xs font-semibold transition-colors
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-text-secondary'
                    }
                  `}
                >
                  {isCompleted ? <Icon name="Check" size={16} /> : step.id}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    isActive
                      ? 'text-text-primary font-medium'
                      : isCompleted
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Vertical connector */}
              {!isLast && (
                <div className="flex justify-center w-8 py-1">
                  <div
                    className={`w-0.5 h-6 ${
                      isCompleted ? 'bg-green-500' : 'bg-neutral-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
