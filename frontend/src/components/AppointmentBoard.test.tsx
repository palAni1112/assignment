import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AppointmentBoard } from "./AppointmentBoard";
import * as appointmentApi from "../services/appointmentApi";
import type { Appointment } from "../types/appointment";

vi.mock("../services/appointmentApi");

const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    title: "Morning Sync",
    description: "Daily standup",
    date: "2026-09-10T00:00:00.000Z",
    startTime: "1970-01-01T09:00:00.000Z",
    endTime: "1970-01-01T09:30:00.000Z",
    status: "SCHEDULED",
    createdAt: "2026-09-10T00:00:00.000Z",
    updatedAt: "2026-09-10T00:00:00.000Z",
  },
];

describe("AppointmentBoard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays appointments", async () => {
    vi.mocked(appointmentApi.getAppointments).mockResolvedValue(mockAppointments);

    render(<AppointmentBoard />);

    expect(screen.getByText("Loading appointments...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Morning Sync")).toBeInTheDocument();
    });

    expect(screen.getByText("Daily standup")).toBeInTheDocument();
    expect(screen.getByText("Scheduled", { selector: "span.status" })).toBeInTheDocument();
  });

  it("handles loading error state with retry option", async () => {
    vi.mocked(appointmentApi.getAppointments)
      .mockRejectedValueOnce(new Error("Failed to fetch"))
      .mockResolvedValueOnce(mockAppointments);

    render(<AppointmentBoard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Morning Sync")).toBeInTheDocument();
    });
  });

  it("completes an appointment using mock API", async () => {
    vi.mocked(appointmentApi.getAppointments).mockResolvedValue(mockAppointments);
    vi.mocked(appointmentApi.completeAppointment).mockResolvedValue({
      ...mockAppointments[0],
      status: "COMPLETED",
    });

    render(<AppointmentBoard />);

    await waitFor(() => {
      expect(screen.getByText("Morning Sync")).toBeInTheDocument();
    });

    const completeButton = screen.getByRole("button", { name: "Complete" });
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText("Appointment marked as completed.")).toBeInTheDocument();
      expect(screen.getByText("Completed", { selector: "span.status" })).toBeInTheDocument();
    });

    expect(appointmentApi.completeAppointment).toHaveBeenCalledWith("appt-1");
  });
});
