import {
  useEffect,
  useState,
} from "react";

import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
} from "../types/appointment";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  completeAppointment,
  cancelAppointment,
} from "../services/appointmentApi";
import {
  sortAppointments,
  matchesFilters,
} from "../utils/appointments";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentForm } from "./AppointmentForm";
import { FilterBar } from "./FilterBar";

export function AppointmentBoard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<AppointmentFilters>({});

  const [reloadKey, setReloadKey] =
    useState(0);

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

        const data =
          await getAppointments(filters);

        setAppointments(sortAppointments(data));
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
  }, [filters, reloadKey]);

  function handleFilterChange(
    newFilters: AppointmentFilters
  ) {
    setFilters(newFilters);
    setSuccessMessage(null);
    setActionError(null);
  }

  function handleClearFilters() {
    setFilters({});
    setSuccessMessage(null);
    setActionError(null);
  }

  async function handleCreate(
    input: CreateAppointmentInput
  ) {
    const appointment =
      await createAppointment(input);

    if (matchesFilters(appointment, filters)) {
      setAppointments((current) =>
        sortAppointments([
          ...current,
          appointment,
        ])
      );
    }

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

    setAppointments((current) => {
      const updatedList = current
        .map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
        .filter((item) =>
          matchesFilters(item, filters)
        );

      return sortAppointments(updatedList);
    });

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
        sortAppointments(
          current
            .map((item) =>
              item.id === updated.id
                ? updated
                : item
            )
            .filter((item) =>
              matchesFilters(item, filters)
            )
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
        sortAppointments(
          current
            .map((item) =>
              item.id === updated.id
                ? updated
                : item
            )
            .filter((item) =>
              matchesFilters(item, filters)
            )
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

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

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
        <div
          className="state-message"
          role="status"
        >
          Loading appointments...
        </div>
      )}

      {!loading && error && (
        <div
          className="state-message state-message--error"
          role="alert"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() =>
              setReloadKey((value) => value + 1)
            }
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="state-message">
          {filters.date || filters.status
            ? "No appointments match the selected filters."
            : "No appointments scheduled yet."}
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
