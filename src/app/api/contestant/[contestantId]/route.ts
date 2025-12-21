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
        stage2vote: true,
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
      where: { stage2vote: { gte: contestant.stage2vote }, disabled: false },
    });

    const preceding = await prisma.contestant.findFirst({
      where: { stage2vote: { gt: contestant.stage2vote } },
      orderBy: { stage2vote: "asc" },
      select: { stage2vote: true },
    });

    const voteDifference = preceding
      ? preceding.stage2vote - contestant.stage2vote
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
