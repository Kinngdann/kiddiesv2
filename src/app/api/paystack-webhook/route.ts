import { prisma } from "../../../../lib/prisma";
import { getContestConfig, stageVoteField } from "../../../../lib/contest-config";
import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const COST_PER_VOTE = 50;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  // Validate HMAC-SHA512 signature
  const expectedSig = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const { reference, amount, metadata } = event.data;
  const contestantId = metadata?.contestantId;

  if (!contestantId || !reference) {
    return NextResponse.json({ received: true });
  }

  // Idempotency: skip if already processed
  const existing = await prisma.voteLog.findFirst({
    where: { contestantId, voteMethod: "paystack" },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  const config = await getContestConfig();
  const field = stageVoteField(config.currentStage);
  const votesToAdd = Math.floor(amount / 100 / COST_PER_VOTE);

  if (votesToAdd < 1) {
    return NextResponse.json({ received: true });
  }

  await prisma.contestant.update({
    where: { contestantId, disabled: false },
    data: {
      [field]: { increment: votesToAdd },
      voteLogs: {
        create: {
          voterName: metadata?.voterName ?? "Anonymous",
          numberOfVotes: votesToAdd,
          amount: Math.floor(amount / 100),
          voteMethod: "paystack",
          keepAnonymous: metadata?.keepAnonymous ?? false,
        },
      },
    },
  });

  return NextResponse.json({ received: true });
}
