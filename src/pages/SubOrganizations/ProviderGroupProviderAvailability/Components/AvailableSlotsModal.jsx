import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import Icon from '@/components/icons/Icon';

import {
  setCloseAvailableSlotsModal,
  setOpenConfigureDrawer,
} from '../providerGroupProviderAvailabilitySlice';

const MOCK_SLOTS = {
  'in-person': [
    '12:30 PM - 02:30 PM',
    '03:30 PM - 06:30 PM',
    '07:30 PM - 09:30 PM',
    '07:30 PM - 09:30 PM',
    '07:30 PM - 09:30 PM',
  ],
  virtual: [
    '12:30 PM - 02:30 PM',
    '03:30 PM - 06:30 PM',
    '07:30 PM - 09:30 PM',
  ],
};

function SlotGroup({
  mode: _mode,
  icon,
  label,
  slots,
  borderColor,
  badgeColor,
}) {
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

export default function AvailableSlotsModal({ open, availableSlotsData }) {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setCloseAvailableSlotsModal());

  const handleEdit = () => {
    const date = availableSlotsData?.date;
    handleClose();
    dispatch(setOpenConfigureDrawer(date));
  };

  const formattedDate = availableSlotsData?.date
    ? dayjs(availableSlotsData.date).format('D MMMM YYYY')
    : '';

  const inPersonSlots = MOCK_SLOTS['in-person'];
  const virtualSlots = MOCK_SLOTS['virtual'];

  return (
    <ModalComponent
      title={`Available Slots- ${formattedDate}`}
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[550px]"
    >
      <div className="space-y-5">
        {/* Availability Header */}
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

        {/* In Person Slots */}
        <SlotGroup
          mode="in-person"
          icon="User"
          label="In Person"
          slots={inPersonSlots}
          borderColor="bg-primary-700"
          badgeColor="bg-primary-700"
        />

        {/* Virtual Slots */}
        <SlotGroup
          mode="virtual"
          icon="Monitor"
          label="Virtual"
          slots={virtualSlots}
          borderColor="bg-purple-500"
          badgeColor="bg-purple-500"
        />
      </div>
    </ModalComponent>
  );
}
