import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { availabilityActions } from '../providerGroupProviderAvailabilitySaga';
import {
  componentKey,
  setCloseAvailableSlotsModal,
  setOpenConfigureDrawer,
} from '../providerGroupProviderAvailabilitySlice';

function SlotGroup({ icon, label, slots, borderColor, badgeColor }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-6 rounded-full ${borderColor}`} />
        <Icon name={icon} size={18} className="text-neutral-500" />
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        <span className="text-sm text-neutral-500">({slots.length} Slots)</span>
      </div>
      <div className="flex flex-wrap gap-2 pl-5">
        {slots.map((slot, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${badgeColor}`}
          >
            {slot}
          </span>
        ))}
      </div>
    </div>
  );
}

const EMPTY_STATE = {};

export default function AvailableSlotsModal({ open, availableSlotsData }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const state = useSelector((s) => s[componentKey] ?? EMPTY_STATE);
  const isLoading = useLoadingKey(LOADING_KEYS.AVAILABILITY_GET_SLOTS_FOR_DATE);

  const { dateSlotsData } = state;

  useEffect(() => {
    if (!open || !availableSlotsData?.date || !providerGroupId || !tenantName)
      return;

    dispatch(
      availabilityActions.fetchSlotsForDate({
        providerGroupId,
        tenantName,
        date: availableSlotsData.date,
        month: dayjs(availableSlotsData.date).format('YYYY-MM'),
      }),
    );
  }, [open, availableSlotsData, providerGroupId, tenantName, dispatch]);

  const handleClose = () => dispatch(setCloseAvailableSlotsModal());

  const handleEdit = () => {
    const date = availableSlotsData?.date;
    handleClose();
    dispatch(setOpenConfigureDrawer(date));
  };

  const formattedDate = availableSlotsData?.date
    ? dayjs(availableSlotsData.date).format('D MMMM YYYY')
    : '';

  const { inPersonSlots, virtualSlots } = useMemo(() => {
    const slots = dateSlotsData?.slots || dateSlotsData || [];
    const slotsArray = Array.isArray(slots) ? slots : [];

    const inPerson = slotsArray
      .filter((s) => s.mode === 'IN_PERSON')
      .map((s) => `${s.startTime} - ${s.endTime}`);

    const virtual = slotsArray
      .filter((s) => s.mode === 'VIRTUAL')
      .map((s) => `${s.startTime} - ${s.endTime}`);

    return { inPersonSlots: inPerson, virtualSlots: virtual };
  }, [dateSlotsData]);

  return (
    <ModalComponent
      title={`Available Slots- ${formattedDate}`}
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[550px]"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-text-primary">
            Availability
          </h4>
          <button
            type="button"
            onClick={handleEdit}
            className="text-primary-700 hover:text-primary-900 cursor-pointer"
          >
            <Icon name="Pencil" size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm text-neutral-400 py-4 text-center">
            Loading slots...
          </div>
        ) : (
          <>
            {inPersonSlots.length > 0 && (
              <SlotGroup
                icon="User"
                label="In Person"
                slots={inPersonSlots}
                borderColor="bg-primary-700"
                badgeColor="bg-primary-700"
              />
            )}

            {virtualSlots.length > 0 && (
              <SlotGroup
                icon="Monitor"
                label="Virtual"
                slots={virtualSlots}
                borderColor="bg-purple-500"
                badgeColor="bg-purple-500"
              />
            )}

            {inPersonSlots.length === 0 && virtualSlots.length === 0 && (
              <div className="text-sm text-neutral-400 py-4 text-center">
                No slots available for this date.
              </div>
            )}
          </>
        )}
      </div>
    </ModalComponent>
  );
}
