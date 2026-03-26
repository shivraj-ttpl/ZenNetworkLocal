import { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import Icon from "@/components/icons/Icon";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import { providerAvailabilityData, APPOINTMENT_MODE_OPTIONS } from "@/data/subOrganizationsData";
import "./providerAvailability.css";

const localizer = dayjsLocalizer(dayjs);

function AvailabilityEvent({ event }) {
  if (event.type === "block") {
    return (
      <div className="rbc-availability-block">
        <div className="rbc-availability-block-stripes" />
        <span className="rbc-availability-block-label">Block Day</span>
      </div>
    );
  }

  const isWarning = event.variant === "warning";
  const label = event.mode === "in-person" ? "In Person" : "Virtual";

  return (
    <div className={`rbc-availability-card ${isWarning ? "rbc-availability-card--warning" : ""}`}>
      <p className="rbc-availability-card__label">{label}</p>
      <p className="rbc-availability-card__slots">
        {String(event.slots).padStart(2, "0")} Slots Available
      </p>
    </div>
  );
}

export default function ProviderGroupProviderAvailability() {
  const { setToolbar } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));
  const [appointmentMode, setAppointmentMode] = useState(null);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => dayjs(prev).subtract(1, "month").toDate());
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => dayjs(prev).add(1, "month").toDate());
  }, []);

  const monthLabel = useMemo(() => dayjs(currentDate).format("MMMM YYYY"), [currentDate]);

  useEffect(() => {
    setToolbar(
      <>
        <div className="flex items-center gap-2">
          <button onClick={goToPrevMonth} className="p-1 rounded hover:bg-neutral-100 cursor-pointer transition-colors">
            <Icon name="ChevronLeft" size={16} className="text-neutral-500" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-44 justify-center">
            <span className="text-sm font-medium text-text-primary">{monthLabel}</span>
            <Icon name="Calendar" size={14} className="text-neutral-400" />
          </div>
          <button onClick={goToNextMonth} className="p-1 rounded hover:bg-neutral-100 cursor-pointer transition-colors">
            <Icon name="ChevronRight" size={16} className="text-neutral-500" />
          </button>
        </div>
        <div className="w-44">
          <SelectDropdown
            name="appointmentMode"
            placeholder="Appointment Mode"
            options={APPOINTMENT_MODE_OPTIONS}
            value={appointmentMode}
            onChange={(val) => setAppointmentMode(val)}
          />
        </div>
        <Button variant="primaryBlue" size="sm">
          <Icon name="Pencil" size={14} />
          Configure Provider Availability
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, monthLabel, appointmentMode, goToPrevMonth, goToNextMonth]);

  const events = useMemo(() => {
    let data = providerAvailabilityData;
    if (appointmentMode) {
      data = data.filter((e) => e.type === "block" || e.mode === appointmentMode.value);
    }
    return data.map((entry, idx) => {
      const dateObj = dayjs(entry.date).toDate();
      return {
        id: `${entry.date}-${entry.mode}-${idx}`,
        title: entry.type === "block" ? "Block Day" : `${entry.mode === "in-person" ? "In Person" : "Virtual"} — ${entry.slots} slots`,
        start: dateObj,
        end: dateObj,
        allDay: true,
        type: entry.type,
        mode: entry.mode,
        slots: entry.slots,
        variant: entry.variant,
      };
    });
  }, [appointmentMode]);

  const components = useMemo(
    () => ({
      toolbar: () => null,
      event: AvailabilityEvent,
    }),
    []
  );

  return (
    <div className="px-5 pb-5">
      <div className="rbc-provider-availability border border-border-light rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          date={currentDate}
          onNavigate={handleNavigate}
          view="month"
          views={["month"]}
          components={components}
          startAccessor="start"
          endAccessor="end"
          style={{ minHeight: 620, }}
          popup={false}
          showAllEvents
        />
      </div>
    </div>
  );
}
