import successIcon from '@/assets/success.svg';
import { Icon } from '@/components/icons';

export default function SuccessModal({ open, close, message }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={close}
    >
      <div
        className="bg-surface shadow-lg rounded-lg flex flex-col w-full max-w-125 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            type="button"
            onClick={close}
            className="text-neutral-400 hover:text-text-primary transition-colors cursor-pointer"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 px-8 pb-10 pt-4">
          <img src={successIcon} alt="Success" className="w-20 h-20" />
          <p className="text-lg font-semibold text-text-primary text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
