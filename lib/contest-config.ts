import { prisma } from "./prisma";

export async function getContestConfig() {
  return prisma.contestConfig.upsert({
    where: { key: "singleton" },
    update: {},
    create: {
      key: "singleton",
      votingOpen: false,
      currentStage: 1,
      stageLabel: "Stage 1",
    },
  });
}

export function isContestStage(stage: unknown): stage is 1 | 2 | 3 {
  return stage === 1 || stage === 2 || stage === 3;
}

export function stageVoteField(stage: number): "stage1vote" | "stage2vote" | "stage3vote" {
  if (stage === 1) return "stage1vote";
  if (stage === 2) return "stage2vote";
  if (stage === 3) return "stage3vote";
  throw new Error("INVALID_CONTEST_STAGE");
}
