import type {
  Appointment,
  ApiSuccess,
  CreateAppointmentInput,
} from "../types/appointment";

const API_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:8001/api";

export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments`);

  if (!response.ok) {
    throw new Error("Failed to load appointments.");
  }

  const result: ApiSuccess<Appointment[]> =
    await response.json();

  return result.data;
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to create appointment."
    );
  }

  return (result as ApiSuccess<Appointment>).data;
}
