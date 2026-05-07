import Countdown from "../contestant/[contestantId]/components/countdown";
import LeaderboardClient, { LeaderboardContestant } from "./leaderboard-client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function LeaderBoardPage() {
  const [contestantsResponse, configResponse] = await Promise.all([
    fetch(`${APP_URL}/api/contestant?rank=top`, { cache: "no-store" }),
    fetch(`${APP_URL}/api/contest-config`, { cache: "no-store" }),
  ]);

  const topContestants: LeaderboardContestant[] = contestantsResponse.ok
    ? await contestantsResponse.json()
    : [];
  const config: { endDate?: string | null } = configResponse.ok
    ? await configResponse.json()
    : {};
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
            Winners of the contest
          </p>
        </div>
      </div>

      <div className="mt-6 mx-auto max-w-xl">
        <LeaderboardClient appUrl={APP_URL} initial={topContestants} />
      </div>
    </section>
  );
}
