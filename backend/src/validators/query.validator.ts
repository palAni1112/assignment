import { z } from "zod";
import { isValidDateString } from "../utils/date.js";

export const appointmentQuerySchema = z.object({
  date: z
    .string()
    .refine(isValidDateString, {
      message: "Invalid date.",
    })
    .optional(),

  status: z
    .enum([
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
});
