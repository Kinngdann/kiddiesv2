import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threshold = Number(searchParams.get("threshold") ?? "0");

  if (isNaN(threshold) || threshold < 0) {
    return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
  }

  const config = await getContestConfig();
  const field = stageVoteField(config.currentStage);

  const [failing, passing] = await Promise.all([
    prisma.contestant.count({
      where: { [field]: { lt: threshold }, disabled: false },
    }),
    prisma.contestant.count({
      where: { [field]: { gte: threshold }, disabled: false },
    }),
  ]);

  return NextResponse.json({ passing, failing });
}
