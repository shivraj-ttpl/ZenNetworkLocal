import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import dayjs from 'dayjs';

import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import DatePicker from '@/components/commonComponents/datePicker/DatePicker';
import TimePicker from '@/components/commonComponents/timePicker/TimePicker';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Icon from '@/components/icons/Icon';

import {
  TIME_ZONE_OPTIONS,
  BOOKING_WINDOW_OPTIONS,
  APPOINTMENT_MODE_OPTIONS,
  DAYS_OF_WEEK,
} from '../constant';
import { setCloseConfigureDrawer } from '../providerGroupProviderAvailabilitySlice';

const EMPTY_SLOT = { startTime: null, endTime: null, appointmentMode: null };
const EMPTY_BLOCK_DAY = { date: null };

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri'];

export default function ConfigureAvailabilityDrawer({ open, configureDate }) {
  const dispatch = useDispatch();

  const [timeZone, setTimeZone] = useState(
    TIME_ZONE_OPTIONS.find((o) => o.value === 'MST') ?? null,
  );
  const [bookingWindow, setBookingWindow] = useState(null);
  const [startDate, setStartDate] = useState(
    configureDate ? dayjs(configureDate).format('YYYY-MM-DD') : '',
  );
  const [selectedDays, setSelectedDays] = useState(['mon']);
  const [applyToAllDays, setApplyToAllDays] = useState(false);
  const [applyToWeekdays, setApplyToWeekdays] = useState(false);
  const [timeSlots, setTimeSlots] = useState([{ ...EMPTY_SLOT }]);
  const [blockDays, setBlockDays] = useState([{ ...EMPTY_BLOCK_DAY }]);

  const handleClose = () => dispatch(setCloseConfigureDrawer());

  const toggleDay = useCallback((dayValue) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue],
    );
    setApplyToAllDays(false);
    setApplyToWeekdays(false);
  }, []);

  const handleApplyAllDays = useCallback(() => {
    setApplyToAllDays((prev) => {
      const next = !prev;
      if (next) {
        setSelectedDays(DAYS_OF_WEEK.map((d) => d.value));
        setApplyToWeekdays(false);
      }
      return next;
    });
  }, []);

  const handleApplyWeekdays = useCallback(() => {
    setApplyToWeekdays((prev) => {
      const next = !prev;
      if (next) {
        setSelectedDays([...WEEKDAYS]);
        setApplyToAllDays(false);
      }
      return next;
    });
  }, []);

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

  const addBlockDay = useCallback(() => {
    setBlockDays((prev) => [...prev, { ...EMPTY_BLOCK_DAY }]);
  }, []);

  const removeBlockDay = useCallback((index) => {
    setBlockDays((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateBlockDay = useCallback((index, value) => {
    setBlockDays((prev) =>
      prev.map((item, i) => (i === index ? { date: value } : item)),
    );
  }, []);

  const handleSave = () => {
    handleClose();
  };

  const drawerTitle = configureDate
    ? `Configure Provider Availability- ${dayjs(configureDate).format('Do MMMM YYYY')}`
    : 'Configure Provider Availability';

  return (
    <Drawer
      title={drawerTitle}
      open={open}
      close={handleClose}
      width="w-full lg:w-[920px]"
      footerButton={null}
    >
      <Formik initialValues={{}} onSubmit={handleSave}>
        <Form className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto  space-y-6">
            {/* Top Row: Time Zone, Booking Window, Start Date */}
            <div className="grid grid-cols-3 gap-4">
              <SelectDropdown
                label="Time Zone"
                name="timeZone"
                placeholder="Select Time Zone"
                options={TIME_ZONE_OPTIONS}
                value={timeZone}
                onChange={setTimeZone}
                required
              />
              <SelectDropdown
                label="Booking Window"
                name="bookingWindow"
                placeholder="Select Booking Window"
                options={BOOKING_WINDOW_OPTIONS}
                value={bookingWindow}
                onChange={setBookingWindow}
                required
              />
              <DatePicker
                label="Start Date"
                name="startDate"
                placeholder="Select"
                value={startDate}
                onChangeCb={setStartDate}
                isRequired
                showMonthDropdown
                showYearDropdown
              />
            </div>

            {/* Day Slot Creation */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-text-primary">
                Day Slot Creation
              </h4>

              {/* Time Slots Card */}
              <div className="border border-border rounded-lg p-4 space-y-4">
                {/* Day Buttons + Checkboxes */}
                <div className="flex items-center justify-between flex-wrap">
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={
                          selectedDays.includes(day.value)
                            ? 'primaryBlue'
                            : 'secondary'
                        }
                        size="sm"
                        onClick={() => toggleDay(day.value)}
                        className="px-6"
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Checkbox
                      label="Apply to all days"
                      checked={applyToAllDays}
                      onChange={handleApplyAllDays}
                      variant="blue"
                      size="sm"
                    />
                    <Checkbox
                      label="Set to weekdays"
                      checked={applyToWeekdays}
                      onChange={handleApplyWeekdays}
                      variant="blue"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 -mx-4 my-2" />

                {/* Time Slots */}
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
                      onChangeCb={(val) =>
                        updateTimeSlot(index, 'endTime', val)
                      }
                      isRequired
                      timeIntervals={30}
                    />

                    <SelectDropdown
                      label="Appointment Mode"
                      name={`appointmentMode-${index}`}
                      placeholder="Select Appointment Mode"
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

                {/* Add Time Slot */}
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

            {/* Block Days */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-text-primary">
                Block Days
              </h4>

              <div className="border border-border rounded-lg p-4 space-y-4">
                {blockDays.map((item, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <DatePicker
                      label="Date"
                      name={`blockDay-${index}`}
                      placeholder="Select Date"
                      value={item.date}
                      onChangeCb={(val) => updateBlockDay(index, val)}
                      showMonthDropdown
                      showYearDropdown
                    />
                    <button
                      type="button"
                      onClick={() => removeBlockDay(index)}
                      className="mb-1 p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addBlockDay}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-900 cursor-pointer"
                >
                  <Icon name="Plus" size={16} />
                  Add Block Days
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
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
            >
              Save
            </Button>
          </div>
        </Form>
      </Formik>
    </Drawer>
  );
}
