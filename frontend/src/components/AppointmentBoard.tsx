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
import { GanttTimeline } from "./GanttTimeline";
import { AppointmentDetailPane } from "./AppointmentDetailPane";
import { Sidebar } from "./Sidebar";

export function AppointmentBoard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<AppointmentFilters>({
      date: "2026-09-10",
    });

  const [reloadKey, setReloadKey] =
    useState(0);

  const [showForm, setShowForm] =
    useState(false);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] =
    useState<string | null>(null);

  const [viewMode, setViewMode] =
    useState<"Day" | "Week" | "Month">("Day");

  const [sortBy, setSortBy] =
    useState<"time" | "recent">("time");

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getAppointments(filters);

        const sorted = sortAppointments(data);
        setAppointments(sorted);

        // Keep selectedAppointment updated if it was previously selected
        setSelectedAppointment((prev) => {
          if (prev && sorted.some((item) => item.id === prev.id)) {
            return sorted.find((item) => item.id === prev.id) || null;
          }
          return null;
        });
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
      setAppointments((current) => {
        const updated = sortAppointments([
          ...current,
          appointment,
        ]);
        return updated;
      });
      setSelectedAppointment(appointment);
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

    if (selectedAppointment?.id === updated.id) {
      setSelectedAppointment(updated);
    }

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

      if (selectedAppointment?.id === updated.id) {
        setSelectedAppointment(updated);
      }

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

      if (selectedAppointment?.id === updated.id) {
        setSelectedAppointment(updated);
      }

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

  const quickStats = {
    total: appointments.length,
    scheduled: scheduledCount,
    completed: completedCount,
    cancelled: cancelledCount,
  };

  // Sort display list: always sort by date, then startTime (or by recent)
  const displayAppointments = [...appointments].sort((a, b) => {
    if (sortBy === "recent") {
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    }
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const selectedDateStr = filters.date || "2026-09-10";

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <Sidebar stats={quickStats} />

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Header Bar */}
        <header className="dashboard-topbar">
          <div className="topbar-greeting">
            <span className="greeting-text">Good morning, John 👋</span>
            <div className="topbar-title-group">
              <p className="eyebrow" style={{ display: "none" }}>TEAM SCHEDULE</p>
              <h1>Appointment Board</h1>
              <p className="subtitle">View and manage your team's appointments.</p>
            </div>
          </div>

          <div className="topbar-controls">
            <div className="date-navigator">
              <button
                type="button"
                className="date-nav-btn"
                onClick={() => {
                  const d = new Date(`${selectedDateStr}T00:00:00Z`);
                  d.setUTCDate(d.getUTCDate() - 1);
                  handleFilterChange({ ...filters, date: d.toISOString().slice(0, 10) });
                }}
                title="Previous Day"
              >
                ‹
              </button>

              <span className="date-nav-current">
                {new Date(`${selectedDateStr}T00:00:00Z`).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>

              <button
                type="button"
                className="date-nav-btn"
                onClick={() => {
                  const d = new Date(`${selectedDateStr}T00:00:00Z`);
                  d.setUTCDate(d.getUTCDate() + 1);
                  handleFilterChange({ ...filters, date: d.toISOString().slice(0, 10) });
                }}
                title="Next Day"
              >
                ›
              </button>

              <button
                type="button"
                className="date-nav-today"
                onClick={() => handleFilterChange({ ...filters, date: "2026-09-10" })}
              >
                Today
              </button>
            </div>

            <div className="view-mode-tabs">
              {(["Day", "Week", "Month"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`view-tab ${viewMode === mode ? "view-tab--active" : ""}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </button>
              ))}
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
        </header>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Notifications */}
        {successMessage && (
          <div className="success-message" role="status">
            <svg viewBox="0 0 20 20" fill="currentColor" className="feedback-icon" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {actionError && (
          <div className="form-error" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" className="feedback-icon" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{actionError}</span>
          </div>
        )}

        {/* Add / Edit Form Modal */}
        {showForm && (
          <AppointmentForm
            initialValues={{
              title: "",
              description: "",
              date: filters.date || "2026-09-10",
              startTime: "",
              endTime: "",
            }}
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
              description: editingAppointment.description ?? "",
              date: editingAppointment.date.slice(0, 10),
              startTime: editingAppointment.startTime.slice(11, 16),
              endTime: editingAppointment.endTime.slice(11, 16),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingAppointment(null)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="state-container">
            <div className="state-message" role="status">
              <div className="spinner" aria-hidden="true" />
              Loading appointments...
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="state-message state-message--error" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" className="state-icon" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
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

        {/* 3-Column Workspace matching Reference: Gantt Timeline | Appointment List | Detail Pane */}
        {!loading && !error && appointments.length > 0 && (
          <div className="workspace-grid">
            {/* Column 1: Gantt Timeline Schedule */}
            <section className="workspace-column workspace-column--timeline">
              <GanttTimeline
                appointments={appointments}
                selectedDate={selectedDateStr}
                onDateChange={(date) => handleFilterChange({ ...filters, date })}
                selectedAppointmentId={selectedAppointment?.id ?? null}
                onSelectAppointment={(appt) => setSelectedAppointment(appt)}
              />
            </section>

            {/* Column 2: Appointment Cards List */}
            <section className="workspace-column workspace-column--list">
              <div className="list-column-header">
                <h3>Appointments ({appointments.length})</h3>
                <div className="sort-select-wrapper">
                  <svg className="sort-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 6l4-4 4 4M4 10l4 4 4-4" />
                  </svg>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "time" | "recent")}
                  >
                    <option value="time">Sort by time</option>
                    <option value="recent">Most recent</option>
                  </select>
                </div>
              </div>

              <div className="appointment-list">
                {displayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isSelected={selectedAppointment?.id === appointment.id}
                    onSelect={(appt) => setSelectedAppointment(appt)}
                    onEdit={(appt) => {
                      setShowForm(false);
                      setEditingAppointment(appt);
                      setSuccessMessage(null);
                      setActionError(null);
                    }}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                    actionLoading={actionLoadingId === appointment.id}
                  />
                ))}
              </div>
            </section>

            {/* Column 3: Detail Inspector Pane */}
            {selectedAppointment && (
              <section className="workspace-column workspace-column--detail">
                <AppointmentDetailPane
                  appointment={selectedAppointment}
                  onClose={() => setSelectedAppointment(null)}
                  onEdit={(appt) => {
                    setShowForm(false);
                    setEditingAppointment(appt);
                    setSuccessMessage(null);
                    setActionError(null);
                  }}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                  actionLoading={actionLoadingId === selectedAppointment.id}
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
