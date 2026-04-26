import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import Leaderboard from "./leaderboard";

export default async function EliteBoard() {
  const config = await getContestConfig();
  const field = stageVoteField(config.currentStage);

  const raw = await prisma.contestant.findMany({
    where: { disabled: false },
    select: {
      contestantId: true,
      firstName: true,
      lastName: true,
      gender: true,
      stage1vote: true,
      stage2vote: true,
      stage3vote: true,
      picture: true,
    },
    orderBy: { [field]: "desc" },
    take: 5,
  });

  const topContestants = raw.map((c) => ({
    contestantId: c.contestantId,
    firstName: c.firstName,
    lastName: c.lastName,
    gender: c.gender,
    picture: c.picture,
    currentVotes: c[field],
  }));

  return (
    <section className="fb-col-wrapper pt-28 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          Live Rankings
        </span>
        <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)] flex items-center justify-center gap-3">
          <span>👑</span>
          <span>Elite Board</span>
          <span>👑</span>
        </h2>
        <p className="text-gray-600 font-semibold text-sm">
          Real-time top contestants — updates every 30 seconds
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-xl text-center border-4 border-black rounded-2xl bg-[#FACC14] px-8 py-10 shadow-[6px_6px_0px_0px_#000]">
        <p className="text-2xl font-black text-black leading-snug">
          You&apos;ll be able to see top performing contestants here at the
          final.
        </p>
      </div>
    </section>
  );
}
