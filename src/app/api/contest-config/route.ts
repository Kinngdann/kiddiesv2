import { getContestConfig, isContestStage } from "../../../../lib/contest-config";
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
    const updateData: {
      votingOpen?: boolean;
      stageLabel?: string;
      endDate?: Date | null;
    } = {};

    if (body.votingOpen !== undefined) {
      if (typeof body.votingOpen !== "boolean") {
        return NextResponse.json({ error: "votingOpen must be a boolean" }, { status: 400 });
      }
      updateData.votingOpen = body.votingOpen;
    }

    if (body.currentStage !== undefined) {
      if (!isContestStage(body.currentStage)) {
        return NextResponse.json({ error: "currentStage must be 1, 2, or 3" }, { status: 400 });
      }

      const current = await getContestConfig();
      if (body.currentStage !== current.currentStage) {
        return NextResponse.json(
          { error: "Use stage transition to change the current stage" },
          { status: 400 },
        );
      }
    }

    if (body.stageLabel !== undefined) {
      if (typeof body.stageLabel !== "string" || body.stageLabel.trim().length === 0) {
        return NextResponse.json({ error: "stageLabel must be a non-empty string" }, { status: 400 });
      }
      updateData.stageLabel = body.stageLabel.trim();
    }

    if (body.endDate !== undefined) {
      if (body.endDate === null || body.endDate === "") {
        updateData.endDate = null;
      } else {
        const endDate = new Date(body.endDate);
        if (Number.isNaN(endDate.getTime())) {
          return NextResponse.json({ error: "endDate must be a valid date" }, { status: 400 });
        }
        updateData.endDate = endDate;
      }
    }

    const updated = await prisma.contestConfig.upsert({
      where: { key: "singleton" },
      update: updateData,
      create: {
        key: "singleton",
        votingOpen: updateData.votingOpen ?? false,
        currentStage: isContestStage(body.currentStage) ? body.currentStage : 1,
        stageLabel: updateData.stageLabel ?? "Stage 1",
        endDate: updateData.endDate ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating contest config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
