import type { Appointment } from "../types/appointment";

import { StatusBadge } from "./StatusBadge";
import {
  formatDate,
  formatTime,
} from "../utils/dateTime";

interface Props {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  actionLoading?: boolean;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onComplete,
  onCancel,
  actionLoading = false,
}: Props) {
  function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmed) {
      onCancel(appointment);
    }
  }

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
            disabled={actionLoading}
            onClick={() => onEdit(appointment)}
          >
            Edit
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onComplete(appointment)}
          >
            {actionLoading
              ? "Completing..."
              : "Complete"}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleCancel}
          >
            {actionLoading
              ? "Cancelling..."
              : "Cancel"}
          </button>
        </div>
      )}
    </article>
  );
}
