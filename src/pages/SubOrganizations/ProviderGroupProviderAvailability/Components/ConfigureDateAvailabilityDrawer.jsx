import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import TimePicker from '@/components/commonComponents/timePicker/TimePicker';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { APPOINTMENT_MODE_OPTIONS, TIME_ZONE_OPTIONS } from '../constant';
import { availabilityActions } from '../providerGroupProviderAvailabilitySaga';
import { setCloseConfigureDateDrawer } from '../providerGroupProviderAvailabilitySlice';

const EMPTY_SLOT = { startTime: null, endTime: null, appointmentMode: null };

export default function ConfigureDateAvailabilityDrawer({
  open,
  configureDate,
}) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const isSaving = useLoadingKey(LOADING_KEYS.AVAILABILITY_POST_BULK_CONFIGURE);

  const [timeSlots, setTimeSlots] = useState([{ ...EMPTY_SLOT }]);
  const [timeZone, setTimeZone] = useState(
    TIME_ZONE_OPTIONS.find((o) => o.value === 'America/New_York') ?? null,
  );

  const handleClose = () => dispatch(setCloseConfigureDateDrawer());

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
    if (!configureDate) return;

    const dateObj = dayjs(configureDate);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayOfWeek = dayNames[dateObj.day()];

    const slots = timeSlots
      .filter((s) => s.startTime && s.endTime && s.appointmentMode)
      .map((s) => ({
        startTime: dayjs(s.startTime).format('HH:mm'),
        endTime: dayjs(s.endTime).format('HH:mm'),
        appointmentMode: s.appointmentMode.value,
      }));

    const payload = {
      timeZone: timeZone?.value,
      bookingWindow: 1,
      startDate: dateObj.format('YYYY-MM-DD'),
      daySlots: [{ day: dayOfWeek, slots }],
    };

    dispatch(
      availabilityActions.bulkConfigure({
        providerGroupId,
        tenantName,
        data: payload,
      }),
    );
  };

  const drawerTitle = configureDate
    ? `Configure Provider Availability- ${dayjs(configureDate).format('Do MMMM YYYY')}`
    : 'Configure Provider Availability';

  return (
    <Drawer
      title={drawerTitle}
      open={open}
      close={handleClose}
      width="w-full lg:w-[900px]"
      footerButton={null}
    >
      <Formik initialValues={{}} onSubmit={handleSave}>
        <Form className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto  space-y-6">
            <div className="w-1/3">
              <SelectDropdown
                label="Time Zone"
                name="dateTimeZone"
                placeholder="Select Time Zone"
                options={TIME_ZONE_OPTIONS}
                value={timeZone}
                onChange={setTimeZone}
                required
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-primary">
                Day Slot Creation
              </h4>

              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-end gap-3">
                  <TimePicker
                    label="Start Time"
                    name={`startTime-${index}`}
                    placeholder="Select Start Time"
                    value={slot.startTime}
                    onChangeCb={(val) =>
                      updateTimeSlot(index, 'startTime', val)
                    }
                    isRequired
                    timeIntervals={30}
                  />
                  <TimePicker
                    label="End Time"
                    name={`endTime-${index}`}
                    placeholder="Select End Time"
                    value={slot.endTime}
                    onChangeCb={(val) => updateTimeSlot(index, 'endTime', val)}
                    isRequired
                    timeIntervals={30}
                  />
                  <SelectDropdown
                    label="Appointment Mode"
                    name={`appointmentMode-${index}`}
                    placeholder="Select Appointment..."
                    options={APPOINTMENT_MODE_OPTIONS}
                    value={slot.appointmentMode}
                    onChange={(val) =>
                      updateTimeSlot(index, 'appointmentMode', val)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="mb-1 p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
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
          </div>

          <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
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
          </div>
        </Form>
      </Formik>
    </Drawer>
  );
}
