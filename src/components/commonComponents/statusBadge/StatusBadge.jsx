const STATUS_STYLES = {
  ACTIVE: 'bg-success-50 text-success-700',
  INACTIVE: 'bg-neutral-100 text-neutral-600',
  PENDING: 'bg-warning-50 text-warning-700',
  ARCHIVED: 'bg-neutral-200 text-neutral-500',
  SUSPENDED: 'bg-error-50 text-error-700',
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  ARCHIVED: 'Archived',
  SUSPENDED: 'Suspended',
};

const DEFAULT_STYLE = 'bg-neutral-100 text-neutral-600';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toUpperCase();
  const style = STATUS_STYLES[normalizedStatus] || DEFAULT_STYLE;
  const label = STATUS_LABELS[normalizedStatus] || status;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
