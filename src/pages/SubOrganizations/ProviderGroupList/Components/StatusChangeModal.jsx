import { useDispatch, useSelector } from 'react-redux';

import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import Button from '@/components/commonComponents/button/Button';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { componentKey, setStatusModal } from '../providerGroupListSlice';
import { providerGroupListActions } from '../providerGroupListSaga';

const { changeStatus } = providerGroupListActions;

const CONTENT = {
  INACTIVE: {
    heading: (name) => `You are about to deactivate "${name}"`,
    bullets: [
      'All Provider and users will not be able to access the provider portal',
      'This Provider Group and all associated accounts will be moved to inactive state immediately',
    ],
    confirmLabel: 'Yes, Deactivate',
  },
  ACTIVE: {
    heading: (name) => `You are about to activate "${name}"`,
    bullets: [
      'This action will affect all accounts associated with this Provider group: All providers and users will be able to access the provider portal',
      'This Provider Group and all associated accounts will be moved to active state immediately',
    ],
    confirmLabel: 'Yes, Activate',
  },
};

export default function StatusChangeModal() {
  const dispatch = useDispatch();
  const { open, row } = useSelector(
    (state) =>
      state[componentKey]?.statusModal ?? { open: false, row: null },
  );
  const isLoading = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_LIST_PATCH_STATUS);

  const targetStatus = row?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const content = CONTENT[targetStatus];

  const handleClose = () => {
    dispatch(setStatusModal({ open: false, row: null }));
  };

  const handleConfirm = () => {
    dispatch(changeStatus({ id: row.id, status: targetStatus }));
  };

  return (
    <ModalComponent
      title="Status Change"
      open={open}
      close={handleClose}
      customClasses="w-full max-w-[600px]"
      footerButton={
        <div className="flex justify-between w-full gap-3">
          <Button
            variant="outlineBlue"
            size="sm"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : content?.confirmLabel}
          </Button>
        </div>
      }
    >
      {row && content && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-primary text-center">
            {content.heading(row.name)}
          </p>
          <ul className="flex flex-col gap-3 px-4">
            {content.bullets.map((bullet, i) => (
              <li
                key={i}
                className="bg-neutral-50 rounded-lg py-3 px-4 text-sm text-text-secondary leading-6 list-disc list-outside"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ModalComponent>
  );
}
