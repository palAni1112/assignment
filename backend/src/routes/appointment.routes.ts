import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentController,
  updateAppointmentController,
} from "../controllers/appointment.controller.js";

const router = Router();

router.get("/", getAppointmentsController);
router.get("/:id", getAppointmentController);
router.post("/", createAppointmentController);
router.patch("/:id", updateAppointmentController);

export default router;
