import { beforeEach } from "vitest";

import { prisma } from "../lib/prisma.js";

beforeEach(async () => {
  await prisma.appointment.deleteMany({
    where: {
      date: new Date("2026-09-20T00:00:00Z"),
    },
  });
});
