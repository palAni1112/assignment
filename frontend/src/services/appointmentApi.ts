import type {
  Appointment,
  ApiSuccess,
} from "../types/appointment";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments`);

  if (!response.ok) {
    throw new Error("Failed to load appointments.");
  }

  const result: ApiSuccess<Appointment[]> =
    await response.json();

  return result.data;
}
