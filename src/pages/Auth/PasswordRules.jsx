import { Icon } from '@/components/icons';

const RULES = [
  {
    key: 'length',
    label: 'Password must be at least 8 characters long',
    test: (v) => v.length >= 8,
  },
  {
    key: 'upper',
    label: 'Password must contain at least one uppercase letter',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    key: 'lower',
    label: 'Password must contain at least one lowercase letter',
    test: (v) => /[a-z]/.test(v),
  },
  {
    key: 'number',
    label: 'Password must contain at least one number',
    test: (v) => /[0-9]/.test(v),
  },
  {
    key: 'special',
    label: 'Password must contain at least one special character (!@#$%^&*)',
    test: (v) => /[!@#$%^&*]/.test(v),
  },
];

export default function PasswordRules({ password = '' }) {
  return (
    <ul className="flex flex-col gap-2 mt-1">
      {RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li key={rule.key} className="flex items-start gap-2">
            <Icon
              name="CheckCircle2"
              size={18}
              className={`mt-0.5 shrink-0 ${
                passed ? 'text-success-500' : 'text-neutral-300'
              }`}
            />
            <span
              className={`text-sm ${
                passed ? 'text-neutral-700' : 'text-neutral-400'
              }`}
            >
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export { RULES };
