import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { feeScheduleActions } from '../providerGroupFeeScheduleSaga';
import {
  componentKey,
  setCloseDeleteModal,
} from '../providerGroupFeeScheduleSlice';

const { deleteFeeSchedule } = feeScheduleActions;

export default function DeleteFeeScheduleModal() {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();

  const { open, row } = useSelector(
    (state) => state[componentKey]?.deleteModal ?? { open: false, row: null },
  );

  const isDeleting = useLoadingKey(LOADING_KEYS.FEE_SCHEDULE_DELETE);

  const handleClose = () => {
    dispatch(setCloseDeleteModal());
  };

  const handleConfirm = () => {
    dispatch(deleteFeeSchedule({ id: row.id, providerGroupId, tenantName }));
  };

  return (
    <ModalComponent
      title="Delete Fee Schedule"
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[480px]"
      showIcon={false}
      footerButton={null}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-50">
          <Icon name="Trash2" size={24} className="text-error-500" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">
            Are you sure you want to delete this fee schedule?
          </p>
          <p className="text-sm text-text-secondary">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 w-full pt-3 border-t border-border">
          <Button
            variant="outlineBlue"
            size="sm"
            type="button"
            onClick={handleClose}
            customClasses="flex-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={handleConfirm}
            customClasses="flex-1 !bg-error-500 hover:!bg-error-600 !border-error-500"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
}
