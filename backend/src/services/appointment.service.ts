import { AppointmentStatus } from "@prisma/client";

import { prisma } from "../lib/prisma.js";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
} from "../types/appointment.types.js";

export async function createAppointment(
  input: CreateAppointmentInput
) {
  return prisma.appointment.create({
    data: {
      title: input.title,
      description: input.description,
      date: new Date(input.date),
      startTime: new Date(`1970-01-01T${input.startTime}:00`),
      endTime: new Date(`1970-01-01T${input.endTime}:00`),
    },
  });
}

export async function getAppointments(
  filters: AppointmentFilters
) {
  return prisma.appointment.findMany({
    where: {
      ...(filters.date && {
        date: new Date(filters.date),
      }),
      ...(filters.status && {
        status: filters.status,
      }),
    },
    orderBy: [
      { date: "asc" },
      { startTime: "asc" },
    ],
  });
}

export async function getAppointmentById(id: string) {
  return prisma.appointment.findUnique({
    where: { id },
  });
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
) {
  return prisma.appointment.update({
    where: { id },
    data: {
      ...(input.title !== undefined && {
        title: input.title,
      }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.date !== undefined && {
        date: new Date(input.date),
      }),
      ...(input.startTime !== undefined && {
        startTime: new Date(
          `1970-01-01T${input.startTime}:00`
        ),
      }),
      ...(input.endTime !== undefined && {
        endTime: new Date(
          `1970-01-01T${input.endTime}:00`
        ),
      }),
    },
  });
}
