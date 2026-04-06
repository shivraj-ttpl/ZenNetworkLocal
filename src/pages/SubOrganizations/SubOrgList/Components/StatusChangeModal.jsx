import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { subOrgListActions } from '../subOrgListSaga';
import { componentKey, setStatusModal } from '../subOrgListSlice';

const { changeSubOrgStatus } = subOrgListActions;

const CONTENT = {
  INACTIVE: {
    step1: {
      heading: (name) => `You are about to deactivate "${name}".`,
      bullets: [
        'This action will immediately affect all accounts associated with this sub-organization. All users and providers will not be able to log in to their respective portals.',
        'This sub-organization and all associated accounts will be moved to inactive state immediately.',
      ],
    },
    step2: {
      heading: (name) =>
        `Please confirm that you want to deactivate "${name}".`,
      bullets: [
        'This is a critical action that will prevent all users and providers from logging in to their respective portals.',
      ],
      confirmLabel: 'Yes, Deactivate',
    },
  },
  ACTIVE: {
    step1: {
      heading: (name) => `You are about to activate "${name}"`,
      bullets: [
        'This action will affect all accounts associated with this sub-organization. All users and providers will be able to log in to their respective portals and access their accounts.',
        'This sub-organization and all associated accounts will be moved to active state immediately.',
      ],
    },
    step2: {
      heading: (name) => `Please confirm that you want to activate "${name}"`,
      bullets: [
        'Once activated, all associated users and providers will immediately be able to log in to their respective portals.',
      ],
      confirmLabel: 'Yes, Activate',
    },
  },
};

export default function StatusChangeModal() {
  const dispatch = useDispatch();
  const { open, row } = useSelector(
    (state) =>
      state[componentKey]?.statusModal ?? { open: false, step: 1, row: null },
  );
  const [step, setStep] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setStep(1);
  }, [open]);
  const isLoading = useLoadingKey(LOADING_KEYS.SUB_ORG_LIST_PATCH_STATUS);

  const targetStatus = row?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const content = CONTENT[targetStatus];

  const handleClose = () => {
    dispatch(setStatusModal({ open: false, step: 1, row: null }));
    setStep(1);
  };

  const handleNext = () => setStep(2);

  const handleConfirm = () => {
    dispatch(changeSubOrgStatus({ id: row.id, status: targetStatus }));
  };

  const currentContent = step === 1 ? content?.step1 : content?.step2;

  return (
    <ModalComponent
      title="Status Change"
      open={open}
      close={handleClose}
      customClasses="w-full max-w-[700px]"
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
          {step === 1 ? (
            <Button
              variant="primaryBlue"
              size="sm"
              type="button"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primaryBlue"
              size="sm"
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : currentContent?.confirmLabel}
            </Button>
          )}
        </div>
      }
      cutomFooterBtnClass="justify-between"
    >
      {row && currentContent && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-primary text-center">
            {currentContent.heading(row.name)}
          </p>
          <ul className="flex flex-col gap-3 px-4">
            {currentContent.bullets.map((bullet, i) => (
              <li
                key={i}
                className="bg-neutral-50 rounded-lg  py-3 text-sm text-text-secondary leading-6 list-disc list-outside"
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
