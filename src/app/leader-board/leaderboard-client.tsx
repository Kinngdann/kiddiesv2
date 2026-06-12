"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crown, Medal, Trophy } from "lucide-react";
import { capitalize } from "@/utils/capitalize";
import { contestantImageSrc } from "@/utils/contestant-image";
import { nthPosition } from "@/utils/format-position";

export type LeaderboardContestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  currentVotes: number;
  picture: string | null;
};

type Props = {
  appUrl?: string;
  initial: LeaderboardContestant[];
};

const rankConfig = [
  {
    bg: "bg-[#FACC14]",
    badge: "bg-black text-[#FACC14]",
    accent: "text-[#FACC14]",
    label: "Top Star",
  },
  {
    bg: "bg-[#A855F7]",
    badge: "bg-black text-[#A855F7]",
    accent: "text-[#A855F7]",
    label: "Runner Up",
  },
  {
    bg: "bg-[#22C55E]",
    badge: "bg-black text-[#22C55E]",
    accent: "text-[#22C55E]",
    label: "Rising Star",
  },
];

export default function LeaderboardClient({ appUrl, initial }: Props) {
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

  const podium = contestants.slice(0, 3);
  const remaining = contestants.slice(3);

  return (
    <div className="space-y-8">
      <div className="hidden lg:grid grid-cols-[1fr_1.25fr_1fr] items-end gap-5">
        {[podium[1], podium[0], podium[2]].filter(Boolean).map((contestant) => {
          const originalIndex = contestants.findIndex(
            (item) => item.contestantId === contestant.contestantId,
          );
          const rank = rankConfig[originalIndex];
          const isWinner = originalIndex === 0;
          const name = [contestant.firstName, contestant.lastName]
            .filter(Boolean)
            .map(capitalize)
            .join(" ");

          return (
            <Link
              key={contestant.contestantId}
              href={`/contestant/${contestant.contestantId}`}
              className={`group block overflow-hidden rounded-2xl border-4 border-black ${rank.bg} shadow-[7px_7px_0px_#111] transition hover:-translate-y-1 hover:shadow-[10px_10px_0px_#111]`}
            >
              <div className={`${isWinner ? "h-[27rem]" : "h-[22rem]"} relative`}>
                <Image
                  alt={name}
                  src={contestantImageSrc(contestant.picture, contestant.gender, appUrl)}
                  fill
                  priority={isWinner}
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-20 text-white">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-white bg-white px-3 py-1 text-xs font-black text-black">
                      {isWinner ? <Crown className="size-4 fill-[#FACC14]" /> : <Medal className="size-4" />}
                      {nthPosition(originalIndex + 1)}
                    </span>
                    <ArrowUpRight className="size-5 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                    {rank.label}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-black leading-tight">
                    {name}
                  </h3>
                  <p className={`mt-2 font-display text-3xl font-black ${rank.accent}`}>
                    {contestant.currentVotes.toLocaleString()} votes
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:hidden">
        {contestants.map((contestant, index) => (
          <LeaderboardRow
            key={contestant.contestantId}
            contestant={contestant}
            index={index}
            appUrl={appUrl}
            compact
          />
        ))}
      </div>

      {remaining.length > 0 && (
        <div className="hidden lg:block rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_#111]">
          <div className="flex items-center justify-between border-b-4 border-black bg-[#FACC14] px-6 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                Full Rankings
              </p>
              <h3 className="font-display text-2xl font-black text-black">
                Contest Standings
              </h3>
            </div>
            <Trophy className="size-8 text-black" />
          </div>

          <div className="divide-y-2 divide-black/10">
            {remaining.map((contestant, index) => (
              <LeaderboardRow
                key={contestant.contestantId}
                contestant={contestant}
                index={index + 3}
                appUrl={appUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({
  contestant,
  index,
  appUrl,
  compact = false,
}: {
  contestant: LeaderboardContestant;
  index: number;
  appUrl?: string;
  compact?: boolean;
}) {
  const isTopThree = index < 3;
  const rank = isTopThree ? rankConfig[index] : null;
  const name = [contestant.firstName, contestant.lastName]
    .filter(Boolean)
    .map(capitalize)
    .join(" ");

  return (
    <Link
      href={`/contestant/${contestant.contestantId}`}
      className={`group flex items-center gap-4 overflow-hidden border-2 border-black bg-white transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] ${
        compact
          ? `rounded-2xl shadow-[4px_4px_0px_#111] ${isTopThree ? rank!.bg : ""}`
          : "border-x-0 border-b-0 border-t-0 px-5 py-4"
      }`}
    >
      <div
        className={`grid size-12 shrink-0 place-items-center border-2 border-black font-display text-xl font-black ${
          compact ? "ml-3 rounded-xl" : "rounded-full"
        } ${isTopThree ? rank!.badge : "bg-black text-white"}`}
      >
        {index + 1}
      </div>

      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-black bg-gray-100">
        <Image
          alt={name}
          src={contestantImageSrc(contestant.picture, contestant.gender, appUrl)}
          fill
          className="object-cover object-top"
        />
      </div>

      <div className="min-w-0 flex-1 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-display text-xl font-black text-black">
            {name}
          </p>
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[0.65rem] font-black text-black/60">
            #{contestant.contestantId}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-black/65">
          <span>{nthPosition(index + 1)} place</span>
          <span className="text-black/30">•</span>
          <span>{capitalize(contestant.gender)}</span>
        </div>
      </div>

      <div className="mr-4 shrink-0 text-right">
        <p className="font-display text-2xl font-black text-black">
          {contestant.currentVotes.toLocaleString()}
        </p>
        <p className="text-xs font-black uppercase tracking-wider text-black/50">
          votes
        </p>
      </div>

      <ArrowUpRight className="mr-4 hidden size-5 shrink-0 text-black/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black md:block" />
    </Link>
  );
}
