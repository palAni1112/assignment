import { useState } from "react";

import type {
  CreateAppointmentInput,
} from "../types/appointment";

interface Props {
  initialValues?: CreateAppointmentInput;

  mode?: "create" | "edit";

  onSubmit: (
    input: CreateAppointmentInput
  ) => Promise<void>;

  onCancel: () => void;
}

const initialForm: CreateAppointmentInput = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
};

export function AppointmentForm({
  initialValues,
  mode = "create",
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState(
    initialValues ?? initialForm
  );

  const isEditMode = mode === "edit";

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  function updateField(
    field: keyof CreateAppointmentInput,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.date) {
      setError("Date is required.");
      return;
    }

    if (!form.startTime || !form.endTime) {
      setError("Start and end time are required.");
      return;
    }

    if (form.endTime <= form.startTime) {
      setError(
        "End time must be after start time."
      );
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });

      if (!isEditMode) {
        setForm(initialForm);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update appointment."
            : "Unable to create appointment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="appointment-form-wrapper">
      <form
        className="appointment-form"
        onSubmit={handleSubmit}
      >
        <div className="form-header">
          <div className="form-header__titles">
            <div className="form-header__badge">
              <span className="form-header__badge-icon">
                {isEditMode ? "✎" : "＋"}
              </span>
              <p className="eyebrow">
                {isEditMode
                  ? "EDIT APPOINTMENT"
                  : "NEW APPOINTMENT"}
              </p>
            </div>
            <h2>
              {isEditMode
                ? "Edit Appointment"
                : "Add Appointment"}
            </h2>
          </div>

          <button
            type="button"
            className="form-close-btn"
            onClick={onCancel}
            disabled={submitting}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="form-error" role="alert">
            <svg
              className="error-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="form-fields">
          <label>
            <span className="field-label">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="e.g. Design Architecture Review"
              maxLength={200}
            />
          </label>

          <label>
            <span className="field-label">Description</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Provide agenda or relevant notes for the attendees..."
              rows={3}
              maxLength={5000}
            />
          </label>

          <label>
            <span className="field-label">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                updateField("date", event.target.value)
              }
            />
          </label>

          <div className="form-row">
            <label>
              <span className="field-label">Start time</span>
              <input
                type="time"
                value={form.startTime}
                onChange={(event) =>
                  updateField(
                    "startTime",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span className="field-label">End time</span>
              <input
                type="time"
                value={form.endTime}
                onChange={(event) =>
                  updateField(
                    "endTime",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
