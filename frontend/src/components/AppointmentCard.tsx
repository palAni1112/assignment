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
  isSelected?: boolean;
  onSelect?: (appointment: Appointment) => void;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onComplete,
  onCancel,
  actionLoading = false,
  isSelected = false,
  onSelect,
}: Props) {
  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmed) {
      onCancel(appointment);
    }
  }

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(appointment);
  }

  function handleCompleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onComplete(appointment);
  }

  return (
    <article
      className={`appointment-card ${
        appointment.status === "CANCELLED"
          ? "appointment-card--cancelled"
          : appointment.status === "COMPLETED"
            ? "appointment-card--completed"
            : "appointment-card--scheduled"
      } ${isSelected ? "appointment-card--selected" : ""}`}
      onClick={() => onSelect?.(appointment)}
      tabIndex={0}
      role="article"
    >
      <div className="appointment-card__header">
        <div className="appointment-card__title-group">
          <h2>{appointment.title}</h2>
        </div>

        <div className="appointment-card__header-right">
          <StatusBadge status={appointment.status} />
          <span className="appointment-card__chevron" aria-hidden="true">
            ›
          </span>
        </div>
      </div>

      {appointment.description && (
        <p className="appointment-card__description">
          {appointment.description}
        </p>
      )}

      <div className="appointment-card__footer">
        <div className="appointment-card__details">
          <span className="detail-item detail-item--date">
            <svg
              className="detail-icon"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="14" height="13" rx="2" />
              <path d="M16 2v4M4 2v4M3 8h14" />
            </svg>
            {formatDate(appointment.date)}
          </span>

          <span className="detail-item detail-item--time">
            <svg
              className="detail-icon"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="7" />
              <polyline points="10 6 10 10 13 12" />
            </svg>
            {formatTime(appointment.startTime)}
            {" – "}
            {formatTime(appointment.endTime)}
          </span>
        </div>

        {appointment.status === "SCHEDULED" && (
          <div className="appointment-card__actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={actionLoading}
              onClick={handleEditClick}
              title="Edit appointment details"
            >
              <svg
                className="btn-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H2v-3l8.5-8.5z" />
              </svg>
              Edit
            </button>

            <button
              type="button"
              className="btn btn--success btn--sm"
              disabled={actionLoading}
              onClick={handleCompleteClick}
              title="Mark appointment as completed"
            >
              <svg
                className="btn-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
              </svg>
              {actionLoading ? "Completing..." : "Complete"}
            </button>

            <button
              type="button"
              className="btn btn--danger btn--sm"
              disabled={actionLoading}
              onClick={handleCancel}
              title="Cancel appointment"
            >
              <svg
                className="btn-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
              {actionLoading ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
