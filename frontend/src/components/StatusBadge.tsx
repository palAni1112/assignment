import type { AppointmentStatus } from "../types/appointment";

interface Props {
  status: AppointmentStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <span className={`status status--${status.toLowerCase()}`}>
      {status}
    </span>
  );
}
