import { Request, Response, NextFunction } from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  completeAppointment,
  cancelAppointment,
} from "../services/appointment.service.js";

export async function createAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const appointment = await createAppointment(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const appointments = await getAppointments({
      date:
        typeof req.query.date === "string"
          ? req.query.date
          : undefined,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as any)
          : undefined,
    });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        error: {
          code: "APPOINTMENT_NOT_FOUND",
          message: "Appointment not found.",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const existing = await getAppointmentById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          code: "APPOINTMENT_NOT_FOUND",
          message: "Appointment not found.",
        },
      });
      return;
    }

    const appointment = await updateAppointment(id, req.body);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function completeAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const appointment = await completeAppointment(id);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const appointment = await cancelAppointment(id);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}
