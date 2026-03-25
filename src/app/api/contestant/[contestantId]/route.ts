import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ contestantId: string }> }
): Promise<Response> {
  const { contestantId } = await context.params;

  try {
    const contestant = await prisma.contestant.findUnique({
      where: { contestantId, disabled: false },
      select: {
        contestantId: true,
        firstName: true,
        lastName: true,
        stage1vote: true,
        stage2vote: true,
        stage3vote: true,
        gender: true,
        age: true,
        picture: true,
        videoUrl: true,
        disabled: true,
        voteLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        }
      },
    });

    if (!contestant) {
      return NextResponse.json(
        { error: "Contestant not found" },
        { status: 404 }
      );
    }

    const config = await getContestConfig();
    const field = stageVoteField(config.currentStage);
    const contestantCurrentVotes = contestant[field] ?? 0;

    const position = await prisma.contestant.count({
      where: { [field]: { gte: contestantCurrentVotes }, disabled: false },
    });

    const preceding = await prisma.contestant.findFirst({
      where: { [field]: { gt: contestantCurrentVotes }, disabled: false },
      orderBy: { [field]: "asc" },
      select: { stage1vote: true, stage2vote: true, stage3vote: true },
    });

    const precedingVotes = preceding ? preceding[field] : null;
    const voteDifference = precedingVotes !== null ? precedingVotes - contestantCurrentVotes : null;

    return NextResponse.json({
      ...contestant,
      currentVotes: contestantCurrentVotes,
      currentStage: config.currentStage,
      stageLabel: config.stageLabel,
      votingOpen: config.votingOpen,
      endDate: config.endDate?.toISOString() ?? null,
      position,
      voteDifference,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
