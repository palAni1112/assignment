import { PrismaClient, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();

  await prisma.appointment.createMany({
    data: [
      {
        title: "Team Standup",
        description: "Daily team sync",
        date: new Date("2026-09-10"),
        startTime: new Date("1970-01-01T09:00:00"),
        endTime: new Date("1970-01-01T09:30:00"),
        status: AppointmentStatus.SCHEDULED,
      },
      {
        title: "Client Meeting",
        description: "Discuss project requirements",
        date: new Date("2026-09-10"),
        startTime: new Date("1970-01-01T10:00:00"),
        endTime: new Date("1970-01-01T11:00:00"),
        status: AppointmentStatus.SCHEDULED,
      },
      {
        title: "Project Review",
        description: "Review current progress",
        date: new Date("2026-09-10"),
        startTime: new Date("1970-01-01T14:00:00"),
        endTime: new Date("1970-01-01T15:00:00"),
        status: AppointmentStatus.COMPLETED,
      },
      {
        title: "Design Discussion",
        description: "Discuss updated designs",
        date: new Date("2026-09-11"),
        startTime: new Date("1970-01-01T11:00:00"),
        endTime: new Date("1970-01-01T12:00:00"),
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
