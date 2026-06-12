import { randomUUID } from "crypto";
import { getContestConfig } from "@/lib/contest-config";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { COST_PER_VOTE } from "@/lib/votes";
import { VOTE_BUNDLES } from "@/lib/vote-bundles";
import { NextRequest, NextResponse } from "next/server";

function normalizeVoterName(value: unknown) {
  if (typeof value !== "string") return "Anonymous";
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 50) : "Anonymous";
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(`paystack-init:${clientIp(request)}`, {
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (limited) return limited;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const contestantId = typeof body.contestantId === "string" ? body.contestantId.trim() : "";
    const numberOfVotes = Number(body.numberOfVotes);

    if (!contestantId || !Number.isSafeInteger(numberOfVotes)) {
      return NextResponse.json({ error: "Invalid payment request" }, { status: 400 });
    }

    const bundle = VOTE_BUNDLES.find((item) => item.votes === numberOfVotes);
    if (!bundle) {
      return NextResponse.json({ error: "Invalid vote pack" }, { status: 400 });
    }

    const config = await getContestConfig();
    if (!config.votingOpen) {
      return NextResponse.json({ error: "Voting is currently closed" }, { status: 403 });
    }

    const contestant = await prisma.contestant.findUnique({
      where: { contestantId, disabled: false },
      select: { contestantId: true },
    });

    if (!contestant) {
      return NextResponse.json({ error: "Contestant not found" }, { status: 404 });
    }

    const reference = `kc_${randomUUID().replaceAll("-", "")}`;
    const email = `${contestantId}-${reference}@kidscrown.net`.toLowerCase();
    const amount = bundle.price;

    if (amount !== numberOfVotes * COST_PER_VOTE) {
      return NextResponse.json({ error: "Invalid vote pack price" }, { status: 400 });
    }

    await prisma.paystackTransaction.create({
      data: {
        reference,
        contestantId,
        amount,
        numberOfVotes,
        stage: config.currentStage,
        voterName: normalizeVoterName(body.voterName),
        keepAnonymous: body.keepAnonymous === true,
        expectedEmail: email,
      },
    });

    return NextResponse.json({
      reference,
      email,
      amount: amount * 100,
      publicKey,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json({ error: "Could not initialize payment" }, { status: 500 });
  }
}
