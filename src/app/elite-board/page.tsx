import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { nthPosition } from "@/utils/format-position";
import Image from "next/image";
import Link from "next/link";
import Countdown from "../contestant/[contestantId]/components/countdown";

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
      <div>
        <h3 className="text-center font-bold text-2xl">
          Real-time top contestants
        </h3>
        <p className="text-center">Winners of the Kiddies Crown Contest </p>
        {/* <Countdown target="2025-12-26" header="" /> */}
      </div>
      <div className="grid gap-6">
        {topContestants.map((contestant, index) => (
          <Card key={contestant.contestantId} className="gap-2 py-0 rounded-sm">
            <div className="flex gap-3">
              <div className="w-22 h-24 overflow-hidden rounded-l-sm">
                <Image
                  alt={`${contestant.firstName} ${contestant.lastName}`}
                  src={`https://kidscrown.net/${contestant.picture}`}
                  width={360}
                  height={460}
                  priority
                  className="object-cove"
                />
              </div>
              <div className="py-2">
                <p className="font-bold text-[0.5rem] text-gray-500 bg-gray-200 w-fit rounded-xs px-2">
                  Contestant No: <span>{contestant.contestantId}</span>
                </p>
                <p className="font-bold">
                  {contestant.firstName} {contestant.lastName}
                </p>
                <div className="flex items-center gap-2 ">
                  <p className="font-bold text-xs">
                    Votes: {contestant.stage2vote}
                  </p>
                  <Separator
                    orientation="vertical"
                    className="h-fit border-gray-500 border-2"
                  />
                  <p className="font-bold text-xs">
                    Position: {nthPosition(index + 1)}
                  </p>
                </div>
                <Link
                  className="underline underline-offset-4 font-semibold text-xs"
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
