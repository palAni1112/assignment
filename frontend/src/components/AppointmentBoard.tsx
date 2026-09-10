import {
  useEffect,
  useState,
} from "react";

import type {
  Appointment,
  CreateAppointmentInput,
} from "../types/appointment";

import {
  getAppointments,
  createAppointment,
} from "../services/appointmentApi";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentForm } from "./AppointmentForm";

export function AppointmentBoard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [successMessage, setSuccessMessage] =
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

  async function handleCreate(
    input: CreateAppointmentInput
  ) {
    const appointment =
      await createAppointment(input);

    setAppointments((current) =>
      [...current, appointment].sort(
        (a, b) => {
          const dateComparison =
            a.date.localeCompare(b.date);

          if (dateComparison !== 0) {
            return dateComparison;
          }

          return a.startTime.localeCompare(
            b.startTime
          );
        }
      )
    );

    setShowForm(false);

    setSuccessMessage(
      "Appointment created successfully."
    );

    window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }

  return (
    <>
      <div className="board-toolbar">
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setSuccessMessage(null);
          }}
        >
          + Add Appointment
        </button>
      </div>

      {successMessage && (
        <div
          className="success-message"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {showForm && (
        <AppointmentForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && (
        <div className="state-message">
          Loading appointments...
        </div>
      )}

      {!loading && error && (
        <div className="state-message state-message--error">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="state-message">
          No appointments found.
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <section className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </section>
      )}
    </>
  );
}
