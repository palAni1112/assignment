import "dotenv/config";

import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 8001;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
