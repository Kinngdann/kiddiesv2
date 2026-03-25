import { prisma } from "../../../../../lib/prisma";
import { getContestConfig, stageVoteField } from "../../../../../lib/contest-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { threshold } = await request.json();

    if (typeof threshold !== "number" || threshold < 0) {
      return NextResponse.json({ error: "threshold must be a non-negative number" }, { status: 400 });
    }

    const config = await getContestConfig();
    if (config.currentStage >= 3) {
      return NextResponse.json({ error: "Already at the final stage" }, { status: 400 });
    }

    const field = stageVoteField(config.currentStage);

    // Disable contestants below the threshold
    const { count: disabledCount } = await prisma.contestant.updateMany({
      where: { [field]: { lt: threshold }, disabled: false },
      data: { disabled: true },
    });

    // Advance the stage and close voting
    const newStage = config.currentStage + 1;
    const stageLabels: Record<number, string> = { 2: "Stage 2", 3: "The Final" };
    await prisma.contestConfig.update({
      where: { key: "singleton" },
      data: {
        currentStage: newStage,
        votingOpen: false,
        stageLabel: stageLabels[newStage] ?? `Stage ${newStage}`,
      },
    });

    const remaining = await prisma.contestant.count({ where: { disabled: false } });

    return NextResponse.json({
      disabledCount,
      remaining,
      newStage,
    });
  } catch (error) {
    console.error("Stage transition error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
