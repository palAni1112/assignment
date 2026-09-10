import type {
  Appointment,
  ApiSuccess,
  AppointmentFilters,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../types/appointment";

const API_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:8001/api";

export async function getAppointments(
  filters: AppointmentFilters = {}
): Promise<Appointment[]> {
  const params = new URLSearchParams();

  if (filters.date) {
    params.set("date", filters.date);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/appointments${query ? `?${query}` : ""}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to load appointments."
    );
  }

  return (result as ApiSuccess<Appointment[]>).data;
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

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const response = await fetch(
    `${API_URL}/appointments/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to update appointment."
    );
  }

  return (result as ApiSuccess<Appointment>).data;
}

export async function completeAppointment(
  id: string
): Promise<Appointment> {
  const response = await fetch(
    `${API_URL}/appointments/${id}/complete`,
    {
      method: "PATCH",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to complete appointment."
    );
  }

  return (result as ApiSuccess<Appointment>).data;
}

export async function cancelAppointment(
  id: string
): Promise<Appointment> {
  const response = await fetch(
    `${API_URL}/appointments/${id}/cancel`,
    {
      method: "PATCH",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to cancel appointment."
    );
  }

  return (result as ApiSuccess<Appointment>).data;
}
