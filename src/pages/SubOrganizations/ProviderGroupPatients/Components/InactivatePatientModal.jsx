import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import TextArea from '@/components/commonComponents/textArea';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { patientActions } from '../providerGroupPatientsSaga';
import { setCloseInactiveModal } from '../providerGroupPatientsSlice';

export default function InactivatePatientModal({ open, patient }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const isSaving = useLoadingKey(LOADING_KEYS.PG_PATIENTS_POST_INACTIVE);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    dispatch(setCloseInactiveModal());
  };

  const handleConfirm = () => {
    if (!patient?.id || !reason.trim()) return;
    dispatch(
      patientActions.inactivatePatient({
        id: patient.id,
        providerGroupId,
        tenantName,
        data: { reason: reason.trim() },
      }),
    );
  };

  const patientName = [patient?.firstName, patient?.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <ModalComponent
      title="Inactivate Patient"
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[480px]"
      showIcon={false}
      footerButton={null}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-50">
          <Icon name="UserX" size={24} className="text-error-500" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">
            Are you sure you want to inactivate{' '}
            {patientName ? `"${patientName}"` : 'this patient'}?
          </p>
          <p className="text-sm text-text-secondary">
            Please provide a reason for inactivation.
          </p>
        </div>

        <div className="w-full">
          <TextArea
            label="Reason"
            name="inactivateReason"
            placeholder="Enter reason for inactivation"
            value={reason}
            onChangeCb={(e) => setReason(e.target.value)}
            isRequired
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between gap-3 w-full pt-3 border-t border-border">
          <Button
            variant="outlineBlue"
            size="sm"
            type="button"
            onClick={handleClose}
            customClasses="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={handleConfirm}
            customClasses="flex-1 !bg-error-500 hover:!bg-error-600 !border-error-500"
            disabled={isSaving || !reason.trim()}
          >
            {isSaving ? 'Processing...' : 'Yes, Inactivate'}
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
}
