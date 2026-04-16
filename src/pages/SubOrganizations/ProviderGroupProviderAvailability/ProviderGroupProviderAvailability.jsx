import './providerAvailability.css';

import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import AvailableSlotsModal from './Components/AvailableSlotsModal';
import ConfigureAvailabilityDrawer from './Components/ConfigureAvailabilityDrawer';
import ConfigureDateAvailabilityDrawer from './Components/ConfigureDateAvailabilityDrawer';
import EditBlockDayModal from './Components/EditBlockDayModal';
import {
  ALL_APPOINTMENT_MODE_OPTION,
  APPOINTMENT_MODE_OPTIONS,
} from './constant';
import { availabilityActions } from './providerGroupProviderAvailabilitySaga';
import {
  componentKey,
  setOpenAvailableSlotsModal,
  setOpenBlockDayModal,
  setOpenConfigureDateDrawer,
  setOpenConfigureDrawer,
} from './providerGroupProviderAvailabilitySlice';

const localizer = dayjsLocalizer(dayjs);

const EMPTY_STATE = {};

const SKELETON_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SKELETON_ROWS = 5;
const SLOT_PATTERNS = [
  [true, false],
  [true, true],
  [false, true],
  [true, false],
  [false, false],
  [true, true],
  [false, true],
];

function CalendarSkeleton() {
  return (
    <div className="animate-pulse" style={{ minHeight: 620 }}>
      <div className="grid grid-cols-7 border-b border-border-light">
        {SKELETON_DAYS.map((day) => (
          <div
            key={day}
            className="px-3 py-2.5 text-xs font-semibold text-neutral-300 border-l border-border-light first:border-l-0"
          >
            {day}
          </div>
        ))}
      </div>

      {Array.from({ length: SKELETON_ROWS }, (_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-7 border-b border-border-light last:border-b-0"
          style={{ minHeight: 110 }}
        >
          {Array.from({ length: 7 }, (_col, colIdx) => {
            const pattern =
              SLOT_PATTERNS[(rowIdx * 7 + colIdx) % SLOT_PATTERNS.length];
            return (
              <div
                key={colIdx}
                className="p-2 border-l border-border-light first:border-l-0 space-y-1.5"
              >
                <div className="h-3 w-5 rounded bg-neutral-200" />
                {pattern[0] && (
                  <div className="h-8 rounded bg-neutral-100 border-l-3 border-neutral-200" />
                )}
                {pattern[1] && (
                  <div className="h-8 rounded bg-neutral-100 border-l-3 border-neutral-200" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function AvailabilityEvent({ event }) {
  if (event.type === 'block') {
    return (
      <div className="rbc-availability-block">
        <div className="rbc-availability-block-stripes" />
        <span className="rbc-availability-block-label">Block Day</span>
      </div>
    );
  }

  const label = event.mode === 'IN_PERSON' ? 'In Person' : 'Virtual';

  return (
    <div className="rbc-availability-card">
      <p className="rbc-availability-card__label">{label}</p>
      <p className="rbc-availability-card__slots">
        {String(event.slots).padStart(2, '0')} Slots Available
      </p>
    </div>
  );
}

export default function ProviderGroupProviderAvailability() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const state = useSelector((s) => s[componentKey] ?? EMPTY_STATE);
  const isLoading = useLoadingKey(LOADING_KEYS.AVAILABILITY_GET_CALENDAR);

  useFlexCleanup(componentKey);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointmentMode, setAppointmentMode] = useState(ALL_APPOINTMENT_MODE_OPTION);

  const {
    calendarData = [],
    refreshCalendarFlag = 0,
    configureDrawerOpen,
    configureDate,
    blockDayModalOpen,
    blockDayDate,
    availableSlotsModalOpen,
    availableSlotsData,
    configureDateDrawerOpen,
    configureDateValue,
  } = state;

  const currentMonth = useMemo(
    () => dayjs(currentDate).format('YYYY-MM'),
    [currentDate],
  );

  useEffect(() => {
    if (!providerGroupId || !tenantName) return;
    dispatch(
      availabilityActions.fetchCalendar({
        providerGroupId,
        tenantName,
        month: currentMonth,
        mode: appointmentMode?.value || null,
      }),
    );
  }, [
    dispatch,
    providerGroupId,
    tenantName,
    currentMonth,
    appointmentMode,
    refreshCalendarFlag,
  ]);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => dayjs(prev).subtract(1, 'month').toDate());
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => dayjs(prev).add(1, 'month').toDate());
  }, []);

  const monthLabel = useMemo(
    () => dayjs(currentDate).format('MMMM YYYY'),
    [currentDate],
  );

  useEffect(() => {
    setToolbar(
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-1 rounded hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            <Icon name="ChevronLeft" size={16} className="text-neutral-500" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-44 justify-center">
            <span className="text-sm font-medium text-text-primary">
              {monthLabel}
            </span>
            <Icon name="Calendar" size={14} className="text-neutral-400" />
          </div>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            <Icon name="ChevronRight" size={16} className="text-neutral-500" />
          </button>
        </div>
        <div className="w-44 max-[1149px]:w-auto max-[1149px]:max-w-57.5 max-[1149px]:flex-1 max-[1149px]:min-w-30">
          <SelectDropdown
            name="appointmentMode"
            placeholder="Select Mode"
            options={[ALL_APPOINTMENT_MODE_OPTION, ...APPOINTMENT_MODE_OPTIONS]}
            value={appointmentMode}
            isClearable={!!appointmentMode?.value}
            onChange={(val) => setAppointmentMode(val ?? ALL_APPOINTMENT_MODE_OPTION)}
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenConfigureDrawer())}
        >
          <Icon name="Pencil" size={14} />
          Provider Availability
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [
    setToolbar,
    monthLabel,
    appointmentMode,
    goToPrevMonth,
    goToNextMonth,
    dispatch,
  ]);

  const events = useMemo(() => {
    return calendarData.flatMap((day) => {
      const dateObj = dayjs(day.date).toDate();
      const result = [];

      if (day.isBlocked) {
        result.push({
          id: `${day.date}-block`,
          title: 'Block Day',
          start: dateObj,
          end: dateObj,
          allDay: true,
          type: 'block',
          rawDate: day.date,
        });
        return result;
      }

      const modeGroups = {};
      (day.slots || []).forEach((slot) => {
        const mode = slot.mode || 'IN_PERSON';
        if (!modeGroups[mode]) modeGroups[mode] = 0;
        modeGroups[mode] += 1;
      });

      Object.entries(modeGroups).forEach(([mode, count]) => {
        result.push({
          id: `${day.date}-${mode}`,
          title: `${mode === 'IN_PERSON' ? 'In Person' : 'Virtual'} — ${count} slots`,
          start: dateObj,
          end: dateObj,
          allDay: true,
          type: 'available',
          mode,
          slots: count,
          rawDate: day.date,
        });
      });

      return result;
    });
  }, [calendarData]);

  const handleSelectEvent = useCallback(
    (event) => {
      if (event.type === 'block') {
        dispatch(setOpenBlockDayModal(event.rawDate));
      } else {
        dispatch(
          setOpenAvailableSlotsModal({
            date: event.rawDate,
            mode: event.mode,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      const dateStr = dayjs(slotInfo.start).format('YYYY-MM-DD');
      const hasEvents = calendarData.some(
        (d) => d.date === dateStr && (d.isBlocked || d.slots?.length > 0),
      );
      if (!hasEvents) {
        dispatch(setOpenConfigureDateDrawer(dateStr));
      }
    },
    [dispatch, calendarData],
  );

  const components = useMemo(
    () => ({
      toolbar: () => null,
      event: AvailabilityEvent,
    }),
    [],
  );

  return (
    <div className="px-5 pb-5">
      <div className="rbc-provider-availability border border-border-light rounded-lg overflow-hidden">
        {isLoading ? (
          <CalendarSkeleton />
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            date={currentDate}
            onNavigate={handleNavigate}
            view="month"
            views={['month']}
            components={components}
            startAccessor="start"
            endAccessor="end"
            style={{ minHeight: 620 }}
            popup={false}
            showAllEvents
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
          />
        )}
      </div>

      <ConfigureAvailabilityDrawer
        open={configureDrawerOpen}
        configureDate={configureDate}
      />
      <EditBlockDayModal open={blockDayModalOpen} blockDayDate={blockDayDate} />
      <AvailableSlotsModal
        open={availableSlotsModalOpen}
        availableSlotsData={availableSlotsData}
      />
      <ConfigureDateAvailabilityDrawer
        open={configureDateDrawerOpen}
        configureDate={configureDateValue}
      />
    </div>
  );
}
