import { prisma } from "../../../../../lib/prisma";
import { getContestConfig, stageVoteField } from "../../../../../lib/contest-config";
import { isAdminSession } from "../../../../../lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threshold, expectedStage } = await request.json();

    if (!Number.isSafeInteger(threshold) || threshold < 0) {
      return NextResponse.json({ error: "threshold must be a non-negative integer" }, { status: 400 });
    }

    if (!Number.isSafeInteger(expectedStage)) {
      return NextResponse.json({ error: "expectedStage is required" }, { status: 400 });
    }

    const config = await getContestConfig();
    if (config.currentStage !== expectedStage) {
      return NextResponse.json(
        { error: `Contest is already at stage ${config.currentStage}` },
        { status: 409 },
      );
    }

    if (config.currentStage >= 3) {
      return NextResponse.json({ error: "Already at the final stage" }, { status: 400 });
    }

    const field = stageVoteField(config.currentStage);
    const newStage = config.currentStage + 1;
    const stageLabels: Record<number, string> = { 2: "Stage 2", 3: "The Final" };

    const result = await prisma.$transaction(async (tx) => {
      const { count: disabledCount } = await tx.contestant.updateMany({
        where: { [field]: { lt: threshold }, disabled: false },
        data: { disabled: true },
      });

      await tx.contestConfig.update({
        where: { key: "singleton" },
        data: {
          currentStage: newStage,
          votingOpen: false,
          stageLabel: stageLabels[newStage] ?? `Stage ${newStage}`,
        },
      });

      const remaining = await tx.contestant.count({ where: { disabled: false } });
      return { disabledCount, remaining };
    });

    return NextResponse.json({
      disabledCount: result.disabledCount,
      remaining: result.remaining,
      newStage,
    });
  } catch (error) {
    console.error("Stage transition error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
