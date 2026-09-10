import type { Appointment } from "../types/appointment";

import { StatusBadge } from "./StatusBadge";
import {
  formatDate,
  formatTime,
} from "../utils/dateTime";

interface Props {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: Props) {
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
    </article>
  );
}
