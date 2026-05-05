import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { prisma } from "@/lib/prisma";
import Countdown from "../contestant/[contestantId]/components/countdown";
import LeaderboardClient, { LeaderboardContestant } from "./leaderboard-client";

export default async function LeaderBoardPage() {
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

  const topContestants: LeaderboardContestant[] = raw.map((c) => ({
    contestantId: c.contestantId,
    firstName: c.firstName,
    lastName: c.lastName,
    gender: c.gender,
    picture: c.picture,
    currentVotes: c[field],
  }));
  const countdownTarget = config.endDate
    ? new Date(config.endDate).toISOString().split("T")[0]
    : "";

  return (
    <section className="fb-col-wrapper pt-20 pb-16">
      {countdownTarget && (
        <Countdown target={countdownTarget} header="Winners will emerge in" />
      )}

      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          Rankings
        </span>
        <div>
          <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)] flex items-center justify-center gap-3">
            <span>Leader Board</span>
          </h2>
          <p className="text-gray-600 font-semibold text-sm">
            Top contestants for the final
          </p>
        </div>
      </div>

      <div className="mt-6 mx-auto max-w-xl">
        <LeaderboardClient initial={topContestants} />
      </div>
    </section>
  );
}
