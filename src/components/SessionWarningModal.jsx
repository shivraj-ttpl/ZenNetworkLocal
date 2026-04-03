import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';

export default function SessionWarningModal({ open, onExtend, onLogout }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <div
        className="bg-surface shadow-lg rounded-lg w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-warning-50 flex items-center justify-center">
            <Icon name="Clock" size={28} className="text-warning-700" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary text-center">
            Session Expiring Soon
          </h2>
          <p className="text-sm text-neutral-500 text-center">
            Your session will expire in 2 minutes due to inactivity. Would you
            like to continue?
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outlineBlue"
              size="sm"
              onClick={onLogout}
              fullWidth
            >
              Log Out
            </Button>
            <Button
              variant="primaryBlue"
              size="sm"
              onClick={onExtend}
              fullWidth
            >
              Continue Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
