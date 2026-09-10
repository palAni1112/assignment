import type { Appointment } from "../types/appointment";

import { StatusBadge } from "./StatusBadge";
import {
  formatDate,
  formatTime,
} from "../utils/dateTime";

interface Props {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment, onEdit }: Props) {
  return (
    <article
      className={`appointment-card ${
        appointment.status === "CANCELLED"
          ? "appointment-card--cancelled"
          : ""
      }`}
    >
      <div className="appointment-card__header">
        <h2>{appointment.title}</h2>

        <StatusBadge status={appointment.status} />
      </div>

      {appointment.description && (
        <p className="appointment-card__description">
          {appointment.description}
        </p>
      )}

      <div className="appointment-card__details">
        <span>{formatDate(appointment.date)}</span>

        <span>
          {formatTime(appointment.startTime)}
          {" – "}
          {formatTime(appointment.endTime)}
        </span>
      </div>

      {appointment.status === "SCHEDULED" && (
        <div className="appointment-card__actions">
          <button
            type="button"
            onClick={() => onEdit(appointment)}
          >
            Edit
          </button>
        </div>
      )}
    </article>
  );
}
