import { Icon } from '@/components/icons';

export default function PatientStepBar({
  steps,
  activeStep,
  completedSteps = new Set(),
  onStepClick,
}) {
  return (
    <div className="mx-5 mt-4 mb-2 border border-border-light rounded-lg bg-neutral-50 px-6 py-4">
      <div className="flex items-center justify-around">
        {steps.map((step, _index) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-colors shrink-0
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-text-secondary'
                    }
                  `}
                >
                  {isCompleted ? <Icon name="Check" size={14} /> : step.id}
                </span>
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive || isCompleted
                      ? 'text-text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
