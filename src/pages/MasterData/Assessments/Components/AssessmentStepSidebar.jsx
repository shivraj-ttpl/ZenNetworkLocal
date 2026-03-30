import { Icon } from "@/components/icons";

export default function AssessmentStepSidebar({ steps, activeStep, completedSteps = new Set(), onStepClick }) {
  const totalSteps = steps.length;

  return (
    <nav className="w-100 shrink-0 bg-surface overflow-y-auto">
      <div className="px-4 py-5 border-r border-border h-full">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const isLast = index === totalSteps - 1;

          return (
            <div key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="flex items-center gap-3 w-full text-left cursor-pointer"
              >
                <span
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center shrink-0
                    text-xs font-semibold transition-colors
                    ${isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-primary text-white"
                        : "bg-neutral-200 text-text-secondary"
                    }
                  `}
                >
                  {isCompleted ? <Icon name="Check" size={14} /> : step.id}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-text-primary font-medium"
                      : isCompleted
                        ? "text-text-primary"
                        : "text-text-secondary"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {!isLast && (
                <div className="flex justify-center w-7 py-1">
                  <div
                    className={`w-0.5 h-5 ${
                      isCompleted ? "bg-green-500" : "bg-neutral-200"
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
