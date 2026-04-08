import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import RadioButton from '@/components/commonComponents/radioButton';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import TimePicker from '@/components/commonComponents/timePicker/TimePicker';
import Icon from '@/components/icons/Icon';
import { useAnyLoading } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { APPOINTMENT_MODE_OPTIONS } from '../constant';
import { availabilityActions } from '../providerGroupProviderAvailabilitySaga';
import { setCloseBlockDayModal } from '../providerGroupProviderAvailabilitySlice';

const EMPTY_SLOT = { startTime: null, endTime: null, appointmentMode: null };

export default function EditBlockDayModal({ open, blockDayDate }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const isSaving = useAnyLoading('AVAILABILITY_');
  const [selected, setSelected] = useState('block');
  const [timeSlots, setTimeSlots] = useState([{ ...EMPTY_SLOT }]);

  const handleClose = () => {
    dispatch(setCloseBlockDayModal());
    setSelected('block');
    setTimeSlots([{ ...EMPTY_SLOT }]);
  };

  const addTimeSlot = useCallback(() => {
    setTimeSlots((prev) => [...prev, { ...EMPTY_SLOT }]);
  }, []);

  const removeTimeSlot = useCallback((index) => {
    setTimeSlots((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateTimeSlot = useCallback((index, field, value) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  }, []);

  const handleSave = () => {
    if (!blockDayDate) return;

    if (selected === 'block') {
      dispatch(
        availabilityActions.removeBlockDay({
          providerGroupId,
          tenantName,
          date: blockDayDate,
        }),
      );
    } else {
      const slots = timeSlots
        .filter((s) => s.startTime && s.endTime && s.appointmentMode)
        .map((s) => ({
          startTime: dayjs(s.startTime).format('HH:mm'),
          endTime: dayjs(s.endTime).format('HH:mm'),
          appointmentMode: s.appointmentMode.value,
        }));

      dispatch(
        availabilityActions.convertBlockDay({
          providerGroupId,
          tenantName,
          date: blockDayDate,
          data: { slots },
        }),
      );
    }
  };

  const formattedDate = blockDayDate
    ? dayjs(blockDayDate).format('D MMMM YYYY')
    : '';

  return (
    <ModalComponent
      title={`Edit Block Day- ${formattedDate}`}
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[550px]"
      footerButton={
        <>
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
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <RadioButton
          label="Remove Block Day"
          name="blockDayOption"
          value="block"
          checked={selected === 'block'}
          onChangeCb={() => setSelected('block')}
        />
        <RadioButton
          label="Convert to Available Day"
          name="blockDayOption"
          value="available"
          checked={selected === 'available'}
          onChangeCb={() => setSelected('available')}
        />

        {selected === 'available' && (
          <div className="border border-border rounded-lg p-4 space-y-4 mt-2">
            <h5 className="text-sm font-semibold text-text-primary">
              Time Slots
            </h5>

            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-end gap-3">
                <TimePicker
                  label="Start Time"
                  name={`modal-startTime-${index}`}
                  placeholder="Select Start Time"
                  value={slot.startTime}
                  onChangeCb={(val) => updateTimeSlot(index, 'startTime', val)}
                  isRequired
                  timeIntervals={30}
                />

                <TimePicker
                  label="End Time"
                  name={`modal-endTime-${index}`}
                  placeholder="Select End Time"
                  value={slot.endTime}
                  onChangeCb={(val) => updateTimeSlot(index, 'endTime', val)}
                  isRequired
                  timeIntervals={30}
                />

                <SelectDropdown
                  label="Mode"
                  name={`modal-mode-${index}`}
                  placeholder="Select Mode"
                  options={APPOINTMENT_MODE_OPTIONS}
                  value={slot.appointmentMode}
                  onChange={(val) =>
                    updateTimeSlot(index, 'appointmentMode', val)
                  }
                  required
                />

                {timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="mb-1 p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addTimeSlot}
              className="flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-900 cursor-pointer"
            >
              <Icon name="Plus" size={16} />
              Add Time Slot
            </button>
          </div>
        )}
      </div>
    </ModalComponent>
  );
}
