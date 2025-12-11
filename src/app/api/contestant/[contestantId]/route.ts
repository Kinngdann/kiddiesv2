import { prisma } from "@/lib/prisma";
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
        gender: true,
        age: true,
        picture: true,
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

    const position = await prisma.contestant.count({
      where: { stage1vote: { gte: contestant.stage1vote } },
    });

    const preceding = await prisma.contestant.findFirst({
      where: { stage1vote: { gt: contestant.stage1vote } },
      orderBy: { stage1vote: "asc" },
      select: { stage1vote: true },
    });

    const voteDifference = preceding
      ? preceding.stage1vote - contestant.stage1vote
      : null;

    return NextResponse.json({
      ...contestant,
      position,
      voteDifference
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
