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
  updateAppointment,
  completeAppointment,
  cancelAppointment,
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

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] =
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

  async function handleUpdate(
    input: CreateAppointmentInput
  ) {
    if (!editingAppointment) {
      return;
    }

    const updated = await updateAppointment(
      editingAppointment.id,
      input
    );

    setAppointments((current) =>
      current
        .map((appointment) =>
          appointment.id === updated.id
            ? updated
            : appointment
        )
        .sort((a, b) => {
          const dateComparison =
            a.date.localeCompare(b.date);

          if (dateComparison !== 0) {
            return dateComparison;
          }

          return a.startTime.localeCompare(
            b.startTime
          );
        })
    );

    setEditingAppointment(null);

    setSuccessMessage(
      "Appointment updated successfully."
    );

    window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }

  async function handleComplete(
    appointment: Appointment
  ) {
    try {
      setActionError(null);
      setActionLoadingId(appointment.id);

      const updated =
        await completeAppointment(appointment.id);

      setAppointments((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setSuccessMessage(
        "Appointment marked as completed."
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to complete appointment."
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancel(
    appointment: Appointment
  ) {
    try {
      setActionError(null);
      setActionLoadingId(appointment.id);

      const updated =
        await cancelAppointment(appointment.id);

      setAppointments((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setSuccessMessage(
        "Appointment cancelled."
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to cancel appointment."
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <>
      <div className="board-toolbar">
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditingAppointment(null);
            setSuccessMessage(null);
            setActionError(null);
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

      {actionError && (
        <div
          className="form-error"
          role="alert"
        >
          {actionError}
        </div>
      )}

      {showForm && (
        <AppointmentForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingAppointment && (
        <AppointmentForm
          key={editingAppointment.id}
          mode="edit"
          initialValues={{
            title: editingAppointment.title,
            description:
              editingAppointment.description ?? "",
            date: editingAppointment.date.slice(0, 10),
            startTime:
              editingAppointment.startTime.slice(11, 16),
            endTime:
              editingAppointment.endTime.slice(11, 16),
          }}
          onSubmit={handleUpdate}
          onCancel={() =>
            setEditingAppointment(null)
          }
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
              onEdit={(appt) => {
                setShowForm(false);
                setEditingAppointment(appt);
                setSuccessMessage(null);
                setActionError(null);
              }}
              onComplete={handleComplete}
              onCancel={handleCancel}
              actionLoading={
                actionLoadingId === appointment.id
              }
            />
          ))}
        </section>
      )}
    </>
  );
}
