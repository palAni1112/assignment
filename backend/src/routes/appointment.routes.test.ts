import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../app.js";

describe("Health API", () => {
  it("returns healthy status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
      },
    });
  });
});

describe("POST /api/appointments", () => {
  it("creates an appointment", async () => {
    const response = await request(app)
      .post("/api/appointments")
      .send({
        title: "Test Appointment",
        description: "Testing",
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Test Appointment");
    expect(response.body.data.status).toBe("SCHEDULED");
  });

  it("rejects missing title", async () => {
    const response = await request(app)
      .post("/api/appointments")
      .send({
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects invalid time range", async () => {
    const response = await request(app)
      .post("/api/appointments")
      .send({
        title: "Invalid",
        date: "2026-09-20",
        startTime: "12:00",
        endTime: "11:00",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects conflicting time slot", async () => {
    await request(app)
      .post("/api/appointments")
      .send({
        title: "A",
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    const response = await request(app)
      .post("/api/appointments")
      .send({
        title: "B",
        date: "2026-09-20",
        startTime: "10:30",
        endTime: "11:30",
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("TIME_SLOT_CONFLICT");
  });

  it("allows adjacent appointment slots", async () => {
    await request(app)
      .post("/api/appointments")
      .send({
        title: "First Slot",
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    const response = await request(app)
      .post("/api/appointments")
      .send({
        title: "Adjacent",
        date: "2026-09-20",
        startTime: "11:00",
        endTime: "12:00",
      });

    expect(response.status).toBe(201);
  });

  it("allows reusing cancelled appointment slots", async () => {
    const resA = await request(app)
      .post("/api/appointments")
      .send({
        title: "To Cancel",
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    const id = resA.body.data.id;
    await request(app).patch(`/api/appointments/${id}/cancel`);

    const resB = await request(app)
      .post("/api/appointments")
      .send({
        title: "New Booking Same Slot",
        date: "2026-09-20",
        startTime: "10:00",
        endTime: "11:00",
      });

    expect(resB.status).toBe(201);
    expect(resB.body.data.status).toBe("SCHEDULED");
  });
});

describe("Appointment Lifecycle", () => {
  it("completes a scheduled appointment and rejects invalid transitions", async () => {
    const createRes = await request(app)
      .post("/api/appointments")
      .send({
        title: "Lifecycle Appt",
        date: "2026-09-20",
        startTime: "13:00",
        endTime: "14:00",
      });

    const id = createRes.body.data.id;

    const completeRes = await request(app).patch(
      `/api/appointments/${id}/complete`
    );
    expect(completeRes.status).toBe(200);
    expect(completeRes.body.data.status).toBe("COMPLETED");

    // Attempt invalid COMPLETED -> CANCELLED
    const invalidRes = await request(app).patch(
      `/api/appointments/${id}/cancel`
    );
    expect(invalidRes.status).toBe(409);
    expect(invalidRes.body.error.code).toBe("INVALID_STATUS_TRANSITION");
  });
});

describe("GET /api/appointments Filters", () => {
  it("filters appointments by status and date", async () => {
    await request(app)
      .post("/api/appointments")
      .send({
        title: "Filter Sched",
        date: "2026-09-20",
        startTime: "09:00",
        endTime: "09:30",
      });

    const response = await request(app).get(
      "/api/appointments?date=2026-09-20&status=SCHEDULED"
    );

    expect(response.status).toBe(200);
    expect(
      response.body.data.every(
        (appointment: { status: string; date: string }) =>
          appointment.status === "SCHEDULED" &&
          appointment.date.startsWith("2026-09-20")
      )
    ).toBe(true);
  });
});
