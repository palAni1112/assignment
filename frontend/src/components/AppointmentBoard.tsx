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

  const scheduledCount = appointments.filter(
    (a) => a.status === "SCHEDULED"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

  return (
    <>
      <div className="board-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--total">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <div className="stat-card__content">
              <span className="stat-card__number">{appointments.length}</span>
              <span className="stat-card__label">Total Appointments</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--scheduled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-card__content">
              <span className="stat-card__number">{scheduledCount}</span>
              <span className="stat-card__label">Active Scheduled</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--completed">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-card__content">
              <span className="stat-card__number">{completedCount}</span>
              <span className="stat-card__label">Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--cancelled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-card__content">
              <span className="stat-card__number">{cancelledCount}</span>
              <span className="stat-card__label">Cancelled</span>
            </div>
          </div>
        </div>

        <div className="board-toolbar">
          <button
            type="button"
            className="btn btn--primary btn--add"
            onClick={() => {
              setShowForm(true);
              setEditingAppointment(null);
              setSuccessMessage(null);
              setActionError(null);
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="btn-icon"
              aria-hidden="true"
            >
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
            + Add Appointment
          </button>
        </div>
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
          <svg viewBox="0 0 20 20" fill="currentColor" className="feedback-icon" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {actionError && (
        <div
          className="form-error"
          role="alert"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="feedback-icon" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{actionError}</span>
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
        <div className="state-container">
          <div
            className="state-message"
            role="status"
          >
            <div className="spinner" aria-hidden="true" />
            Loading appointments...
          </div>
        </div>
      )}

      {!loading && error && (
        <div
          className="state-message state-message--error"
          role="alert"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="state-icon" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() =>
              setReloadKey((value) => value + 1)
            }
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="state-message state-message--empty">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>No Appointments Found</h3>
          <p>
            {filters.date || filters.status
              ? "No appointments match the selected filters."
              : "No appointments scheduled yet."}
          </p>
          {!filters.date && !filters.status && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => setShowForm(true)}
            >
              + Create First Appointment
            </button>
          )}
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
