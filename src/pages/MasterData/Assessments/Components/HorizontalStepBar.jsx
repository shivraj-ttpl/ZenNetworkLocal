import { Icon } from "@/components/icons";

export default function HorizontalStepBar({ steps, activeStep, completedSteps = new Set(), onStepClick }) {
  const activeLabel = steps.find((s) => s.id === activeStep)?.label || "";

  return (
    <div className="w-full px-4 py-4 border-b border-border bg-surface shrink-0">
      <div className="flex items-center min-w-max overflow-x-auto zenera-scrollbar pb-2">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="cursor-pointer"
              >
                <span
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-colors
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
              </button>

              {!isLast && (
                <div
                  className={`w-10 h-0.5 ${
                    isCompleted ? "bg-green-500" : "bg-neutral-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-sm font-semibold text-text-primary mt-3">{activeLabel}</p>
    </div>
  );
}
