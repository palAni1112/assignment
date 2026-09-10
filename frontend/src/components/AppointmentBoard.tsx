import {
  useEffect,
  useState,
} from "react";

import type { Appointment } from "../types/appointment";

import { getAppointments } from "../services/appointmentApi";
import { AppointmentCard } from "./AppointmentCard";

export function AppointmentBoard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAppointments();

        setAppointments(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load appointments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div className="state-message">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message state-message--error">
        {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="state-message">
        No appointments found.
      </div>
    );
  }

  return (
    <section className="appointment-list">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </section>
  );
}
