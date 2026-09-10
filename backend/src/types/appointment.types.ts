import { AppointmentStatus } from "@prisma/client";

export interface CreateAppointmentInput {
  title: string;
  description?: string;
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
