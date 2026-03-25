import { getContestConfig } from "../../../../lib/contest-config";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "../../../../lib/session";

export async function GET() {
  try {
    const config = await getContestConfig();
    return NextResponse.json({
      votingOpen: config.votingOpen,
      currentStage: config.currentStage,
      stageLabel: config.stageLabel,
      endDate: config.endDate?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error fetching contest config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Auth check (middleware covers /admin/* pages; this API is accessed directly by admin UI)
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prisma } = await import("../../../../lib/prisma");
    const body = await request.json();

    const updated = await prisma.contestConfig.upsert({
      where: { key: "singleton" },
      update: {
        ...(typeof body.votingOpen === "boolean" && { votingOpen: body.votingOpen }),
        ...(typeof body.currentStage === "number" && { currentStage: body.currentStage }),
        ...(typeof body.stageLabel === "string" && { stageLabel: body.stageLabel }),
        ...(body.endDate !== undefined && {
          endDate: body.endDate ? new Date(body.endDate) : null,
        }),
      },
      create: {
        key: "singleton",
        votingOpen: body.votingOpen ?? false,
        currentStage: body.currentStage ?? 1,
        stageLabel: body.stageLabel ?? "Stage 1",
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating contest config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
