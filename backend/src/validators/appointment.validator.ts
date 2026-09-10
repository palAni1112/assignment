import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createAppointmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(200, "Title must not exceed 200 characters."),

    description: z
      .string()
      .trim()
      .max(5000, "Description must not exceed 5000 characters.")
      .optional(),

    date: z
      .string()
      .regex(dateRegex, "Date must use YYYY-MM-DD format."),

    startTime: z
      .string()
      .regex(timeRegex, "Start time must use HH:mm format."),

    endTime: z
      .string()
      .regex(timeRegex, "End time must use HH:mm format."),
  })
  .superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

export const updateAppointmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty.")
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000)
      .optional(),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must use YYYY-MM-DD format."
      )
      .optional(),

    startTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Start time must use HH:mm format."
      )
      .optional(),

    endTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "End time must use HH:mm format."
      )
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field is required for an update.",
    }
  );

