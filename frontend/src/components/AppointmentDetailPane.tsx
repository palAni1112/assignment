import type { Appointment } from "../types/appointment";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatTime } from "../utils/dateTime";

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  actionLoading?: boolean;
}

function calculateDuration(startTime: string, endTime: string): string {
  const startHours = parseInt(startTime.slice(11, 13), 10);
  const startMins = parseInt(startTime.slice(14, 16), 10);
  const endHours = parseInt(endTime.slice(11, 13), 10);
  const endMins = parseInt(endTime.slice(14, 16), 10);

  const diffMins = endHours * 60 + endMins - (startHours * 60 + startMins);
  if (diffMins <= 0) return "";
  if (diffMins === 60) return "1 hour";
  if (diffMins < 60) return `${diffMins} mins`;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hours`;
}

function formatTimestamp(isoStr: string): string {
  if (!isoStr) return "Just now";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

export function AppointmentDetailPane({
  appointment,
  onClose,
  onEdit,
  onComplete,
  onCancel,
  actionLoading = false,
}: Props) {
  const duration = calculateDuration(appointment.startTime, appointment.endTime);

  function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (confirmed) {
      onCancel(appointment);
    }
  }

  return (
    <aside className="detail-pane">
      <div className="detail-pane__header">
        <div className="detail-pane__title-group">
          <div className="detail-pane__avatar">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div>
            <h3>{appointment.title}</h3>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        <button
          type="button"
          className="detail-pane__close"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      {appointment.status === "SCHEDULED" && (
        <div className="detail-pane__actions">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={actionLoading}
            onClick={() => onEdit(appointment)}
          >
            <svg
              className="btn-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H2v-3l8.5-8.5z" />
            </svg>
            Edit
          </button>

          <button
            type="button"
            className="btn btn--success btn--sm"
            disabled={actionLoading}
            onClick={() => onComplete(appointment)}
          >
            <svg
              className="btn-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
          >
            <svg
              className="btn-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
            {actionLoading ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}

      <div className="detail-pane__body">
        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="4" width="14" height="13" rx="2" />
              <path d="M16 2v4M4 2v4M3 8h14" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Date</span>
            <span className="detail-row__value">{formatDate(appointment.date)}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10" cy="10" r="7" />
              <polyline points="10 6 10 10 13 12" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Time</span>
            <span className="detail-row__value">
              {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
              {duration ? ` (${duration})` : ""}
            </span>
          </div>
        </div>

        {appointment.description && (
          <div className="detail-row">
            <div className="detail-row__icon">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 4h12v12H4zM4 8h12M8 4v12" />
              </svg>
            </div>
            <div className="detail-row__content">
              <span className="detail-row__label">Description</span>
              <p className="detail-row__desc">{appointment.description}</p>
            </div>
          </div>
        )}

        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6z" />
              <circle cx="10" cy="8" r="2" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Location</span>
            <span className="detail-row__value">Meeting Room A / Virtual</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a6 6 0 0112 0v2H4v-2z" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Attendees</span>
            <span className="detail-row__value">Team & Client</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="4" width="14" height="13" rx="2" />
              <path d="M7 8h6M7 12h4" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Created</span>
            <span className="detail-row__value">{formatTimestamp(appointment.createdAt)}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-row__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="detail-row__content">
            <span className="detail-row__label">Last updated</span>
            <span className="detail-row__value">{formatTimestamp(appointment.updatedAt)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
