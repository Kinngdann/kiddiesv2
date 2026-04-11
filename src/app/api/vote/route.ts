import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendWhatsApp } from "@/lib/termii";
import { NextRequest, NextResponse } from "next/server";

const COST_PER_VOTE = 50;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { contestantId, voterName, voteMethod, keepAnonymous, reference } = data;

    if (!contestantId || !voteMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if voting is open
    const config = await getContestConfig();
    if (!config.votingOpen) {
      return NextResponse.json({ error: "Voting is currently closed" }, { status: 403 });
    }

    let votesToAdd: number;
    let amountPaid: number;

    if (voteMethod === "paystack") {
      if (!reference) {
        return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
      }

      let verification;
      try {
        verification = await verifyPaystackTransaction(reference);
      } catch {
        return NextResponse.json({ error: "Could not verify payment" }, { status: 502 });
      }

      if (!verification.status || verification.data.status !== "success") {
        return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
      }

      // Derive vote count from Paystack's verified amount (kobo → naira)
      amountPaid = Math.floor(verification.data.amount / 100);
      votesToAdd = Math.floor(amountPaid / COST_PER_VOTE);

      if (votesToAdd < 1) {
        return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
      }
    } else if (voteMethod === "bank_tx") {
      // Bank transfer: amount provided by admin, no external verification needed
      const amount = Number(data.amount);
      if (!amount || amount < COST_PER_VOTE) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }
      amountPaid = amount;
      votesToAdd = Math.floor(amount / COST_PER_VOTE);
    } else {
      return NextResponse.json({ error: "Invalid vote method" }, { status: 400 });
    }

    const field = stageVoteField(config.currentStage);

    // Find contestants that will be displaced (votes currently between current and new)
    const current = await prisma.contestant.findUnique({
      where: { contestantId, disabled: false },
      select: { stage1vote: true, stage2vote: true, stage3vote: true, firstName: true, lastName: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Contestant not found" }, { status: 404 });
    }

    const currentVotes = current[field] ?? 0;
    const newVotes = currentVotes + votesToAdd;

    const displaced = await prisma.contestant.findMany({
      where: {
        [field]: { gt: currentVotes, lte: newVotes },
        disabled: false,
        contestantId: { not: contestantId },
      },
      select: { firstName: true, whatsapp: true, parent: true },
    });

    const updatedContestant = await prisma.contestant.update({
      where: { contestantId, disabled: false },
      data: {
        [field]: { increment: votesToAdd },
        voteLogs: {
          create: {
            voterName: voterName || "Anonymous",
            numberOfVotes: votesToAdd,
            amount: amountPaid,
            voteMethod: voteMethod === "paystack" ? "paystack" : "bank_tx",
            keepAnonymous: keepAnonymous ?? false,
          },
        },
      },
    });

    // Fire-and-forget WhatsApp notifications to displaced contestants' parents
    const voterName_ = `${current.firstName} ${current.lastName}`;
    for (const d of displaced) {
      sendWhatsApp(
        d.whatsapp,
        `Hi ${d.parent}, just a heads-up — ${d.firstName} has just been overtaken by ${voterName_} in The Future Star Contest. Rally more votes to help ${d.firstName} climb back up! Vote at ${process.env.NEXT_PUBLIC_APP_URL ?? "https://kidscrown.net"}`
      ).catch(() => {}); // non-blocking
    }

    return NextResponse.json(updatedContestant);
  } catch (error) {
    console.error("Error posting vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

