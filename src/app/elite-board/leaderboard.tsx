"use client";

import { useEffect, useRef, useState } from "react";
import { nthPosition } from "@/utils/format-position";
import { capitalize } from "@/utils/capitalize";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Crown } from "lucide-react";
const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

type Contestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  currentVotes: number;
  picture: string | null;
};

type Props = {
  initial: Contestant[];
};

const REFRESH_INTERVAL = 30_000;

const rankConfig = [
  { bg: "bg-[#FACC14]", badge: "bg-black text-[#FACC14]", numText: "text-black", showCrown: true },
  { bg: "bg-[#A855F7]", badge: "bg-black text-[#A855F7]", numText: "text-white", showCrown: false },
  { bg: "bg-[#22C55E]", badge: "bg-black text-[#22C55E]", numText: "text-white", showCrown: false },
];

export default function Leaderboard({ initial }: Props) {
  const [contestants, setContestants] = useState<Contestant[]>(initial);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const prevOrderRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    initial.forEach((c, i) => { map[c.contestantId] = i; });
    prevOrderRef.current = map;
  }, [initial]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/contestant?rank=top", { cache: "no-store" });
        if (!res.ok) return;
        const data: Contestant[] = await res.json();
        prevOrderRef.current = Object.fromEntries(
          contestants.map((c, i) => [c.contestantId, i])
        );
        setContestants(data);
        setLastUpdated(new Date());
        setSecondsAgo(0);
      } catch {
        // silently ignore
      }
    };

    const refreshTimer = setInterval(fetchLatest, REFRESH_INTERVAL);
    return () => clearInterval(refreshTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestants]);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  const getPositionChange = (contestantId: string, currentIndex: number) => {
    const prev = prevOrderRef.current[contestantId];
    if (prev === undefined) return null;
    return prev - currentIndex;
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-center text-gray-400 font-semibold">
        Updated {secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`} · refreshes every 30s
      </p>

      <div className="grid gap-4">
        {contestants.map((contestant, index) => {
          const change = getPositionChange(contestant.contestantId, index);
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
                {/* Rank badge */}
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

                {/* Photo */}
                <div className="w-16 h-24 overflow-hidden shrink-0 relative">
                  <Image
                    alt={`${contestant.firstName} ${contestant.lastName}`}
                    src={contestant.picture ? `/${contestant.picture}` : contestant.gender?.toLowerCase() === "male" ? malePic : femalePic}
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </div>

                {/* Info */}
                <div className="py-3 flex-1 pr-3">
                  <p className="font-bold text-[0.55rem] text-black/50 bg-black/10 w-fit rounded-full px-2 mb-0.5">
                    #{contestant.contestantId}
                  </p>
                  <p className="font-bold text-black text-sm">
                    {[contestant.firstName, contestant.lastName].filter(Boolean).map(capitalize).join(" ")}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="font-black text-sm text-black">
                      {contestant.currentVotes.toLocaleString()} votes
                    </span>
                    <span className="text-black/40">·</span>
                    <span className="font-bold text-xs text-black/70">
                      {nthPosition(index + 1)} place
                    </span>
                    {change !== null && change !== 0 && (
                      <span
                        className={`flex items-center text-xs font-bold ${
                          change > 0 ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        {change > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(change)}
                      </span>
                    )}
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
