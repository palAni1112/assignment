import type {
  Appointment,
  AppointmentFilters,
} from "../types/appointment";

export function sortAppointments(
  appointments: Appointment[]
): Appointment[] {
  return [...appointments].sort((a, b) => {
    const dateComparison =
      a.date.localeCompare(b.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.startTime.localeCompare(
      b.startTime
    );
  });
}

export function matchesFilters(
  appointment: Appointment,
  filters: AppointmentFilters
): boolean {
  const matchesDate =
    !filters.date ||
    appointment.date.slice(0, 10) === filters.date;

  const matchesStatus =
    !filters.status ||
    appointment.status === filters.status;

  return matchesDate && matchesStatus;
}
