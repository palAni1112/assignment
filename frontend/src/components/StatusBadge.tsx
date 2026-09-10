import type { AppointmentStatus } from "../types/appointment";

interface Props {
  status: AppointmentStatus;
}

const labels: Record<AppointmentStatus, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`status status--${status.toLowerCase()}`}>
      <span className="status__dot" aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
