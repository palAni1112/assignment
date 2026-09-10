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
    <form
      className="appointment-form"
      onSubmit={handleSubmit}
    >
      <div className="form-header">
        <div>
          <p className="eyebrow">
            {isEditMode
              ? "EDIT APPOINTMENT"
              : "NEW APPOINTMENT"}
          </p>
          <h2>
            {isEditMode
              ? "Edit Appointment"
              : "Add Appointment"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Close
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <label>
        Title
        <input
          type="text"
          value={form.title}
          onChange={(event) =>
            updateField("title", event.target.value)
          }
          placeholder="Client Meeting"
          maxLength={200}
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          placeholder="Discuss project requirements"
          rows={4}
          maxLength={5000}
        />
      </label>

      <label>
        Date
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
          Start time
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
          End time
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

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
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
  );
}
