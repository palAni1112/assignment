import { z } from "zod";

export const appointmentQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.")
    .optional(),

  status: z
    .enum(["SCHEDULED", "COMPLETED", "CANCELLED"])
    .optional(),
});
