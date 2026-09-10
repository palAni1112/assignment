import { AppointmentStatus, Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
} from "../types/appointment.types.js";

async function ensureNoConflict(
  date: Date,
  startTime: Date,
  endTime: Date,
  excludeId?: string
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      date,
      status: AppointmentStatus.SCHEDULED,
      ...(excludeId && {
        id: {
          not: excludeId,
        },
      }),
    },
  });

  const newStart = startTime.getTime();
  const newEnd = endTime.getTime();

  const conflict = appointments.some((appointment) => {
    const existingStart = appointment.startTime.getTime();
    const existingEnd = appointment.endTime.getTime();

    return newStart < existingEnd && newEnd > existingStart;
  });

  if (conflict) {
    throw new AppError(
      409,
      "TIME_SLOT_CONFLICT",
      "The selected time slot is already occupied."
    );
  }
}

export async function createAppointment(input: CreateAppointmentInput) {
  const date = new Date(input.date);
  const startTime = new Date(`1970-01-01T${input.startTime}:00`);
  const endTime = new Date(`1970-01-01T${input.endTime}:00`);

  // 1. Application-level check
  await ensureNoConflict(date, startTime, endTime);

  // 2. Database-level execution with exclusion constraint guard
  try {
    return await prisma.appointment.create({
      data: {
        title: input.title,
        description: input.description,
        date,
        startTime,
        endTime,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2004" ||
        error.code === "P2002" ||
        error.message.includes("appointments_no_scheduled_overlap"))
    ) {
      throw new AppError(
        409,
        "TIME_SLOT_CONFLICT",
        "The selected time slot is already occupied."
      );
    }

    throw error;
  }
}

export async function getAppointments(filters: AppointmentFilters) {
  return prisma.appointment.findMany({
    where: {
      ...(filters.date && {
        date: new Date(filters.date),
      }),
      ...(filters.status && {
        status: filters.status,
      }),
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
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
  const existing = await getAppointmentById(id);

  if (!existing) {
    throw new AppError(
      404,
      "APPOINTMENT_NOT_FOUND",
      "Appointment not found."
    );
  }

  // Calculate final target values for the appointment
  const finalDate = input.date ? new Date(input.date) : existing.date;
  const finalStartTime = input.startTime
    ? new Date(`1970-01-01T${input.startTime}:00`)
    : existing.startTime;
  const finalEndTime = input.endTime
    ? new Date(`1970-01-01T${input.endTime}:00`)
    : existing.endTime;

  if (finalEndTime.getTime() <= finalStartTime.getTime()) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "End time must be after start time."
    );
  }

  // If status is SCHEDULED, ensure no conflict on target date (excluding self)
  if (existing.status === AppointmentStatus.SCHEDULED) {
    await ensureNoConflict(finalDate, finalStartTime, finalEndTime, id);
  }

  try {
    return await prisma.appointment.update({
      where: { id },
      data: {
        ...(input.title !== undefined && {
          title: input.title,
        }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.date !== undefined && {
          date: finalDate,
        }),
        ...(input.startTime !== undefined && {
          startTime: finalStartTime,
        }),
        ...(input.endTime !== undefined && {
          endTime: finalEndTime,
        }),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2004" ||
        error.code === "P2002" ||
        error.message.includes("appointments_no_scheduled_overlap"))
    ) {
      throw new AppError(
        409,
        "TIME_SLOT_CONFLICT",
        "The selected time slot is already occupied."
      );
    }

    throw error;
  }
}
