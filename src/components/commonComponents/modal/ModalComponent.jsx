import { Icon } from '@/components/icons';

function ModalComponent({
  title,
  showIcon = true,
  children,
  customClasses = '',
  close,
  open,
  customBodyClasses = '',
  subtitle,
  footerButton,
  cutomFooterBtnClass = '',
  showEditIcon = false,
  edit,
  hideOverflow = false,
  showDeleteIcon = false,
  deleteClick,
  hideHeaderBorder = false,
  backdropColor = 'bg-black/50',
  maxChildrenHeight = 'max-h-[70vh]',
}) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropColor}`}
      onClick={close}
    >
      <div
        className={`bg-surface shadow-lg rounded-lg flex flex-col max-h-[90vh] ${customClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between gap-4 ${
            !hideHeaderBorder ? 'px-5 py-4 border-b border-border' : ''
          }`}
        >
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-semibold text-text-primary truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showEditIcon && (
              <button
                type="button"
                onClick={edit}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
              >
                <Icon name="Pencil" size={16} />
                <span>Edit</span>
              </button>
            )}
            {showDeleteIcon && (
              <button
                type="button"
                onClick={deleteClick}
                className="flex items-center gap-1.5 text-sm text-error-500 hover:text-error-600 transition-colors cursor-pointer"
              >
                <Icon name="Trash2" size={16} />
                <span>Delete</span>
              </button>
            )}
            {showIcon && (
              <button
                type="button"
                onClick={close}
                className="text-neutral-400 hover:text-text-primary transition-colors cursor-pointer"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          className={`${!hideHeaderBorder ? 'p-5' : ''} ${maxChildrenHeight} ${
            hideOverflow ? 'overflow-visible' : 'overflow-auto'
          } ${customBodyClasses}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footerButton && (
          <div
            className={`flex justify-end gap-3 px-5 py-3 border-t border-border ${cutomFooterBtnClass}`}
          >
            {footerButton}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalComponent;
