"use client";

import { useEffect, useRef, useState } from "react";
import { Separator } from "@/src/components/ui/separator";
import { nthPosition } from "@/utils/format-position";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Crown } from "lucide-react";

type Contestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  currentVotes: number;
  picture: string | null;
};

type Props = {
  initial: Contestant[];
};

const REFRESH_INTERVAL = 30_000;

const rankConfig = [
  {
    card: "rank-gold",
    badge: "bg-amber-400 text-amber-900",
    label: "text-amber-700",
    showCrown: true,
  },
  {
    card: "rank-silver",
    badge: "bg-slate-400 text-white",
    label: "text-slate-600",
    showCrown: false,
  },
  {
    card: "rank-bronze",
    badge: "bg-orange-400 text-white",
    label: "text-orange-700",
    showCrown: false,
  },
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
      <p className="text-xs text-center text-muted-foreground">
        Updated {secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`} · refreshes every 30s
      </p>
      <div className="grid gap-4">
        {contestants.map((contestant, index) => {
          const change = getPositionChange(contestant.contestantId, index);
          const rank = rankConfig[index];
          const isTopThree = index < 3;

          return (
            <div
              key={contestant.contestantId}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isTopThree ? rank.card : "bg-card border border-border shadow-sm"
              }`}>
              <div className="flex gap-3">
                {/* Rank badge */}
                <div
                  className={`flex flex-col items-center justify-center w-12 shrink-0 font-black text-lg gap-0.5 py-2 ${
                    isTopThree ? rank.badge : "bg-muted text-muted-foreground"
                  }`}>
                  {isTopThree && rank.showCrown && (
                    <Crown className="w-3.5 h-3.5 fill-current" />
                  )}
                  {index + 1}
                </div>

                {/* Photo */}
                <div className="w-18 h-22 overflow-hidden shrink-0">
                  {contestant.picture ? (
                    <Image
                      alt={`${contestant.firstName} ${contestant.lastName}`}
                      src={`/${contestant.picture}`}
                      width={360}
                      height={460}
                      priority
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>

                {/* Info */}
                <div className="py-2 flex-1 pr-2">
                  <p className="font-bold text-[0.5rem] text-muted-foreground bg-muted w-fit rounded-full px-2">
                    Contestant No: <span>{contestant.contestantId}</span>
                  </p>
                  <p className={`font-bold ${isTopThree ? rank.label : ""}`}>
                    {contestant.firstName} {contestant.lastName}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-xs">
                      Votes: {contestant.currentVotes.toLocaleString()}
                    </p>
                    <Separator orientation="vertical" className="h-3 border-muted-foreground/30 border" />
                    <p className="font-bold text-xs">
                      {nthPosition(index + 1)} place
                    </p>
                    {change !== null && change !== 0 && (
                      <span
                        className={`flex items-center text-xs font-bold ${
                          change > 0 ? "text-green-600" : "text-red-500"
                        }`}>
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
                    className="underline underline-offset-4 font-semibold text-xs text-violet-600 hover:text-violet-700"
                    href={`/contestant/${contestant.contestantId}`}>
                    see profile
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
