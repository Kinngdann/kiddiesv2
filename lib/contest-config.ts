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

export function stageVoteField(stage: number): "stage1vote" | "stage2vote" | "stage3vote" {
  if (stage === 1) return "stage1vote";
  if (stage === 2) return "stage2vote";
  return "stage3vote";
}
