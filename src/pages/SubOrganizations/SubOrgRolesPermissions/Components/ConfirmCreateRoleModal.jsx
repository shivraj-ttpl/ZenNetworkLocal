import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import Icon from '@/components/icons/Icon';

export default function ConfirmCreateRoleModal({ open, onCancel, onConfirm }) {
  return (
    <ModalComponent
      title="Confirm Role Creation"
      open={open}
      close={onCancel}
      customClasses="w-[95%] sm:w-[620px]"
      footerButton={null}
      showIcon={false}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
          <Icon name="ShieldCheck" size={24} className="text-primary-700" />
        </div>

        <div className="text-center">
          <p className="text-md text-text-secondary mb-3">
            Adding this role will be available for this sub-organization.
          </p>
          <p>Do you want to continue?</p>
        </div>

        <div className="flex items-center justify-between gap-3 w-full pt-3 border-t border-border">
          <Button
            variant="outlineBlue"
            size="sm"
            onClick={onCancel}
            customClasses="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={onConfirm}
            customClasses="flex-1"
          >
            Save
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
}
