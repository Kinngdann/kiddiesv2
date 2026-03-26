import { nthPosition } from "@/utils/format-position";
import Image from "next/image";
import Link from "next/link";
import Leaderboard from "./leaderboard";

type Contestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  currentVotes: number;
  picture: string | null;
};

export default async function EliteBoard() {
  const res = await fetch(
    "https://kidscrown.net/api/contestant?rank=top",
    { cache: "no-store" }
  );
  const topContestants: Contestant[] = await res.json();

  return (
    <section className="fb-col-wrapper pt-28 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          ✨ Live Rankings
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

      <Leaderboard initial={topContestants} />
    </section>
  );
}
