import type { Appointment } from "../types/appointment";
import { formatTime } from "../utils/dateTime";

interface Props {
  appointments: Appointment[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedAppointmentId: string | null;
  onSelectAppointment: (appointment: Appointment) => void;
}

const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const HOUR_HEIGHT = 56;
const START_HOUR = 8;
const END_HOUR = 18;

function parseMinutes(isoTime: string): number {
  const hours = parseInt(isoTime.slice(11, 13), 10);
  const minutes = parseInt(isoTime.slice(14, 16), 10);
  return hours * 60 + minutes;
}

export function GanttTimeline({
  appointments,
  selectedDate,
  onDateChange,
  selectedAppointmentId,
  onSelectAppointment,
}: Props) {
  const dateObj = selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date("2026-09-10T00:00:00Z");
  const formattedHeaderDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const dayAppointments = selectedDate
    ? appointments.filter((a) => a.date.slice(0, 10) === selectedDate)
    : appointments;

  function handlePrevDay() {
    const current = selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date();
    current.setUTCDate(current.getUTCDate() - 1);
    onDateChange(current.toISOString().slice(0, 10));
  }

  function handleNextDay() {
    const current = selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date();
    current.setUTCDate(current.getUTCDate() + 1);
    onDateChange(current.toISOString().slice(0, 10));
  }

  function handleToday() {
    onDateChange("2026-09-10");
  }

  return (
    <div className="gantt-panel">
      <div className="gantt-panel__header">
        <div className="gantt-panel__date-title">
          <h3>{formattedHeaderDate}</h3>
        </div>

        <div className="gantt-panel__nav">
          <button
            type="button"
            className="gantt-nav-btn gantt-nav-btn--today"
            onClick={handleToday}
          >
            Today
          </button>
          <button
            type="button"
            className="gantt-nav-btn"
            onClick={handlePrevDay}
            aria-label="Previous day"
            title="Previous day"
          >
            ‹
          </button>
          <button
            type="button"
            className="gantt-nav-btn"
            onClick={handleNextDay}
            aria-label="Next day"
            title="Next day"
          >
            ›
          </button>
        </div>
      </div>

      <div className="gantt-grid">
        <div className="gantt-time-column">
          {HOURS.map((hour) => (
            <div key={hour} className="gantt-time-cell">
              <span>{hour}</span>
            </div>
          ))}
        </div>

        <div className="gantt-slots-container">
          {HOURS.map((hour) => (
            <div key={hour} className="gantt-slot-row" />
          ))}

          {dayAppointments.map((appt) => {
            const startMinutes = parseMinutes(appt.startTime);
            const endMinutes = parseMinutes(appt.endTime);

            const startOffset = Math.max(0, startMinutes - START_HOUR * 60);
            const endOffset = Math.min((END_HOUR - START_HOUR) * 60, endMinutes - START_HOUR * 60);
            const duration = Math.max(30, endOffset - startOffset);

            const top = (startOffset / 60) * HOUR_HEIGHT;
            const height = Math.max(36, (duration / 60) * HOUR_HEIGHT - 4);

            const isSelected = appt.id === selectedAppointmentId;
            const statusClass =
              appt.status === "COMPLETED"
                ? "gantt-block--completed"
                : appt.status === "CANCELLED"
                  ? "gantt-block--cancelled"
                  : "gantt-block--scheduled";

            return (
              <div
                key={appt.id}
                className={`gantt-block ${statusClass} ${isSelected ? "gantt-block--selected" : ""}`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
                onClick={() => onSelectAppointment(appt)}
                role="button"
                tabIndex={0}
                title={`${appt.title} (${formatTime(appt.startTime)} - ${formatTime(appt.endTime)})`}
              >
                <div className="gantt-block__header">
                  <span className="gantt-block__title">
                    {formatTime(appt.startTime)} — {appt.title}
                    {appt.status === "CANCELLED" ? " (Cancelled)" : ""}
                  </span>
                </div>
                <div className="gantt-block__meta">
                  <span>
                    {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
