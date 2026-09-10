export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAppointmentInput {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface AppointmentFilters {
  date?: string;
  status?: AppointmentStatus;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
