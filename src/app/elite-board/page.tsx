import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { nthPosition } from "@/utils/format-position";
import Image from "next/image";
import Link from "next/link";

type Contestant = {
  contestantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  stage2vote: number;
  picture: string;
};

export default async function EliteBoard() {
  const responds = await fetch(
    "https://kidscrown.net/api/contestant?rank=top",
    { cache: "no-store" }
  );
  const topContestants: Contestant[] = await responds.json();

  return (
    <section className="fb-col-wrapper pt-24">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-200 text-yellow-700 text-sm font-bold px-4 py-1.5 rounded-full">
          <span>✨</span>
          <span>Live Rankings</span>
        </div>
        <h2 className="font-bold flex items-center justify-center gap-3">
          <span>👑</span>
          <span>Elite Board</span>
          <span>👑</span>
        </h2>
        <p className="text-gray-600 font-semibold">Real-time top contestants in the Kiddies Crown Contest</p>
      </div>
      <div className="grid gap-4">
        {topContestants.map((contestant, index) => (
          <Card
            key={contestant.contestantId}
            className={`gap-2 py-0 rounded-xl overflow-hidden border-l-4 ${
              index === 0
                ? "border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white shadow-yellow-100 shadow-md"
                : index === 1
                ? "border-l-gray-400 bg-gradient-to-r from-gray-50 to-white"
                : index === 2
                ? "border-l-orange-400 bg-gradient-to-r from-orange-50 to-white"
                : "border-l-sky-300"
            }`}>
            <div className="flex gap-3 items-center">
              <div className="w-22 h-24 overflow-hidden">
                <Image
                  alt={`${contestant.firstName} ${contestant.lastName}`}
                  src={`https://kidscrown.net/${contestant.picture}`}
                  width={360}
                  height={460}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="py-2 flex-1">
                <p className="font-bold text-[0.5rem] text-gray-500 bg-gray-100 w-fit rounded-full px-2 py-0.5">
                  Contestant No: <span>{contestant.contestantId}</span>
                </p>
                <p className="font-bold text-gray-900">
                  {contestant.firstName} {contestant.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-sky-500">
                    Votes: {contestant.stage2vote}
                  </p>
                  <Separator
                    orientation="vertical"
                    className="h-fit border-gray-300 border"
                  />
                  <p className="font-bold text-xs">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}{" "}
                    {nthPosition(index + 1)}
                  </p>
                </div>
                <Link
                  className="underline underline-offset-4 font-semibold text-xs text-sky-500 hover:text-sky-700 transition"
                  href={`/contestant/${contestant.contestantId}`}>
                  see profile
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
