import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppointmentCard } from "./AppointmentCard";

const scheduledAppointment = {
  id: "1",
  title: "Client Meeting",
  description: "Discuss project",
  date: "2026-09-10T00:00:00.000Z",
  startTime: "1970-01-01T10:00:00.000Z",
  endTime: "1970-01-01T11:00:00.000Z",
  status: "SCHEDULED" as const,
  createdAt: "",
  updatedAt: "",
};

const cancelledAppointment = {
  id: "2",
  title: "Cancelled Meeting",
  description: "Discuss cancelled project",
  date: "2026-09-10T00:00:00.000Z",
  startTime: "1970-01-01T10:00:00.000Z",
  endTime: "1970-01-01T11:00:00.000Z",
  status: "CANCELLED" as const,
  createdAt: "",
  updatedAt: "",
};

describe("AppointmentCard", () => {
  it("renders appointment information", () => {
    render(
      <AppointmentCard
        appointment={scheduledAppointment}
        onEdit={vi.fn()}
        onComplete={vi.fn()}
        onCancel={vi.fn()}
        actionLoading={false}
      />
    );

    expect(
      screen.getByText("Client Meeting")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Discuss project")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Scheduled")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders cancelled appointment without lifecycle action buttons", () => {
    render(
      <AppointmentCard
        appointment={cancelledAppointment}
        onEdit={vi.fn()}
        onComplete={vi.fn()}
        onCancel={vi.fn()}
        actionLoading={false}
      />
    );

    expect(
      screen.getByText("Cancelled Meeting")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cancelled")
    ).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Complete" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });
});
