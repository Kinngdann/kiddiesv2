import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const COST_OF_VOTE = 50;

  try {
    const data = await request.json();
    const votesToAdd = Math.floor(Number(data.amount) / COST_OF_VOTE);

    const updatedContestant = await prisma.contestant.update({
      where: { contestantId: data.contestantId, disabled: false },
      data: {
        stage1vote: { increment: votesToAdd },
        voteLogs: {
          create: {
            voterName: data.voterName,
            numberOfVotes: votesToAdd,
            amount: Number(data.amount),
            voteMethod: data.voteMethod,
          },
        },
      },
    });

    return NextResponse.json(updatedContestant);
  } catch (error) {
    console.error("Error posting vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

