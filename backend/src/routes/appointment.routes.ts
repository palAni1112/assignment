import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentController,
  updateAppointmentController,
  completeAppointmentController,
  cancelAppointmentController,
} from "../controllers/appointment.controller.js";

import {
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware.js";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../validators/appointment.validator.js";

import { appointmentQuerySchema } from "../validators/query.validator.js";

const router = Router();

router.get(
  "/",
  validateQuery(appointmentQuerySchema),
  getAppointmentsController
);

router.get("/:id", getAppointmentController);

router.post(
  "/",
  validateBody(createAppointmentSchema),
  createAppointmentController
);

router.patch(
  "/:id/complete",
  completeAppointmentController
);

router.patch(
  "/:id/cancel",
  cancelAppointmentController
);

router.patch(
  "/:id",
  validateBody(updateAppointmentSchema),
  updateAppointmentController
);

export default router;

