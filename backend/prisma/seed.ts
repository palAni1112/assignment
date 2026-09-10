import { PrismaClient, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();

  await prisma.appointment.createMany({
    data: [
      {
        title: "Team Standup",
        description: "Daily team sync",
        date: new Date("2026-09-10T00:00:00Z"),
        startTime: new Date("1970-01-01T09:00:00Z"),
        endTime: new Date("1970-01-01T09:30:00Z"),
        status: AppointmentStatus.SCHEDULED,
      },
      {
        title: "Client Meeting",
        description: "Discuss project requirements",
        date: new Date("2026-09-10T00:00:00Z"),
        startTime: new Date("1970-01-01T10:00:00Z"),
        endTime: new Date("1970-01-01T11:00:00Z"),
        status: AppointmentStatus.SCHEDULED,
      },
      {
        title: "Project Review",
        description: "Review current progress",
        date: new Date("2026-09-10T00:00:00Z"),
        startTime: new Date("1970-01-01T14:00:00Z"),
        endTime: new Date("1970-01-01T15:00:00Z"),
        status: AppointmentStatus.COMPLETED,
      },
      {
        title: "Design Discussion",
        description: "Discuss updated designs",
        date: new Date("2026-09-10T00:00:00Z"),
        startTime: new Date("1970-01-01T16:00:00Z"),
        endTime: new Date("1970-01-01T17:00:00Z"),
        status: AppointmentStatus.CANCELLED,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
