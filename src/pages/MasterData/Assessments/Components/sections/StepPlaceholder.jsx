export default function StepPlaceholder({ stepLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-base font-semibold text-text-primary mb-2">
        {stepLabel}
      </h3>
      <p className="text-sm text-text-secondary">
        This section is under development.
      </p>
    </div>
  );
}
