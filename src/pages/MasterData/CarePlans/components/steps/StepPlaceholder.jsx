export default function StepPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-text-secondary">
      <p className="text-lg font-medium text-text-primary">{title}</p>
      <p className="text-sm">This section is under development.</p>
    </div>
  );
}
