import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { providerGroupProvidersActions } from '../providerGroupProvidersSaga';
import { setCloseStatusModal } from '../providerGroupProvidersSlice';

export default function StatusChangeModal({ open, statusChangeRow }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const isLoading = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_PATCH_STATUS,
  );

  const isActive = statusChangeRow?.status === 'ACTIVE';
  const targetStatus = isActive ? 'INACTIVE' : 'ACTIVE';
  const name = `${statusChangeRow?.firstName}  ${statusChangeRow?.lastName}`;

  const handleClose = () => {
    dispatch(setCloseStatusModal());
  };

  const handleConfirm = () => {
    dispatch(
      providerGroupProvidersActions.updateProviderStatus({
        providerId: statusChangeRow?.id,
        providerGroupId,
        tenantName,
        status: targetStatus,
      }),
    );
  };

  return (
    <ModalComponent
      title="Status Change"
      open={open}
      close={handleClose}
      customClasses="max-w-[800px] w-[700px]"
      maxChildrenHeight="max-h-[50vh]"
      footerButton={
        <div className="flex justify-between w-full">
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
            {isLoading
              ? 'Processing...'
              : isActive
                ? 'Yes, Deactivate'
                : 'Yes, Activate'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-lg font-semibold text-text-primary text-center">
          Are you sure you want to {isActive ? 'deactivate' : 'activate'} &quot;
          {name}&quot;?
        </p>
        <p className="text-sm text-neutral-500 text-center">
          {isActive
            ? 'This action will immediately remove their access to the Provider Portal.'
            : 'This will restore their access to the Provider Portal.'}
        </p>
      </div>
    </ModalComponent>
  );
}
