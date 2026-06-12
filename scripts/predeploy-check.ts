import "dotenv/config";
import { prisma } from "../lib/prisma";
import { isContestStage } from "../lib/contest-config";

const requiredEnv = [
  "DATABASE_URL",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_SESSION_SECRET",
  "PAYSTACK_SECRET_KEY",
  "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
  "NEXT_PUBLIC_APP_URL",
];

async function main() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  if ((process.env.ADMIN_SESSION_SECRET?.length ?? 0) < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }

  const config = await prisma.contestConfig.findUnique({
    where: { key: "singleton" },
    select: { currentStage: true },
  });

  if (config && !isContestStage(config.currentStage)) {
    throw new Error(`Invalid ContestConfig.currentStage: ${config.currentStage}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Predeploy checks passed.");
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    console.error(error);
    process.exit(1);
  });
