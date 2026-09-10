import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppointmentForm } from "./AppointmentForm";

describe("AppointmentForm", () => {
  it("renders form elements correctly", () => {
    render(
      <AppointmentForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Add Appointment" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Start time")).toBeInTheDocument();
    expect(screen.getByLabelText("End time")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Appointment" })).toBeInTheDocument();
  });

  it("validates required title", async () => {
    const onSubmit = vi.fn();
    render(
      <AppointmentForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Create Appointment" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Title is required.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("validates required date", async () => {
    const onSubmit = vi.fn();
    render(
      <AppointmentForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Dental Checkup" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Appointment" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Date is required.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("validates start and end times are required", async () => {
    const onSubmit = vi.fn();
    render(
      <AppointmentForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Dental Checkup" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Appointment" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Start and end time are required.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects end time less than or equal to start time", async () => {
    const onSubmit = vi.fn();
    render(
      <AppointmentForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Dental Checkup" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-20" },
    });
    fireEvent.change(screen.getByLabelText("Start time"), {
      target: { value: "14:00" },
    });
    fireEvent.change(screen.getByLabelText("End time"), {
      target: { value: "13:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Appointment" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("End time must be after start time.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data and disables button while submitting", async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(
      <AppointmentForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Dental Checkup" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Regular cleaning" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-09-20" },
    });
    fireEvent.change(screen.getByLabelText("Start time"), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText("End time"), {
      target: { value: "11:00" },
    });

    const submitButton = screen.getByRole("button", { name: "Create Appointment" });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Dental Checkup",
      description: "Regular cleaning",
      date: "2026-09-20",
      startTime: "10:00",
      endTime: "11:00",
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Saving...");

    resolveSubmit();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Create Appointment");
    });
  });
});
