import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/appointments", appointmentRouter);

app.use(errorHandler);

export default app;
