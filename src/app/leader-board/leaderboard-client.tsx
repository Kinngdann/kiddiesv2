"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { capitalize } from "@/utils/capitalize";
import { nthPosition } from "@/utils/format-position";

const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

export type LeaderboardContestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  currentVotes: number;
  picture: string | null;
};

type Props = {
  initial: LeaderboardContestant[];
};

const rankConfig = [
  { bg: "bg-[#FACC14]", badge: "bg-black text-[#FACC14]", showCrown: true },
  { bg: "bg-[#A855F7]", badge: "bg-black text-[#A855F7]", showCrown: false },
  { bg: "bg-[#22C55E]", badge: "bg-black text-[#22C55E]", showCrown: false },
];

export default function LeaderboardClient({ initial }: Props) {
  const contestants = Array.isArray(initial) ? initial : [];

  if (contestants.length === 0) {
    return (
      <div className="mt-12 mx-auto max-w-xl text-center border-4 border-black rounded-2xl bg-[#FACC14] px-8 py-10 shadow-[6px_6px_0px_0px_#000]">
        <p className="text-2xl font-black text-black leading-snug">
          You&apos;ll be able to see top performing contestants here at the final.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {contestants.map((contestant, index) => {
          const isTopThree = index < 3;
          const rank = isTopThree ? rankConfig[index] : null;

          return (
            <div
              key={contestant.contestantId}
              className={`rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] transition-all duration-300 ${
                isTopThree ? rank!.bg : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex flex-col items-center justify-center w-12 shrink-0 font-black text-lg gap-0.5 py-2 ${
                    isTopThree ? rank!.badge : "bg-black text-white"
                  }`}
                >
                  {isTopThree && rank!.showCrown && (
                    <Crown className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{index + 1}</span>
                </div>

                <div className="w-16 h-24 overflow-hidden shrink-0 relative">
                  <Image
                    alt={`${contestant.firstName} ${contestant.lastName}`}
                    src={
                      contestant.picture
                        ? `/${contestant.picture}`
                        : contestant.gender?.toLowerCase() === "male"
                          ? malePic
                          : femalePic
                    }
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </div>

                <div className="py-3 flex-1 pr-3">
                  <p className="font-bold text-[0.55rem] text-black/50 bg-black/10 w-fit rounded-full px-2 mb-0.5">
                    #{contestant.contestantId}
                  </p>
                  <p className="font-bold text-black text-sm">
                    {[contestant.firstName, contestant.lastName]
                      .filter(Boolean)
                      .map(capitalize)
                      .join(" ")}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="font-black text-sm text-black">
                      {contestant.currentVotes.toLocaleString()} votes
                    </span>
                    <span className="text-black/40">·</span>
                    <span className="font-bold text-xs text-black/70">
                      {nthPosition(index + 1)} place
                    </span>
                  </div>
                  <Link
                    className="font-bold text-xs text-black underline underline-offset-2 hover:opacity-60 transition mt-1 inline-block"
                    href={`/contestant/${contestant.contestantId}`}
                  >
                    see profile →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
