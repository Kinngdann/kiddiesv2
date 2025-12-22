import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import { capitalize } from "@/utils/capitalize";
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

export default async function Contestants() {
  const response = await fetch("http://localhost:3000/api/contestant", {
    cache: "no-store",
  });

  const contestants: Contestant[] = await response.json();

  return (
    <section className="fb-col-wrapper pt-24">
      <h3 className="text-center font-bold text-2xl">
        Showing all active contestants
      </h3>

      <div className="grid gap-8 md:grid-cols-3">
        {contestants.map((contestant) => (
          <Card key={contestant.contestantId} className="gap-2 py-0">
            <div className="full-bleed max-h-72 md:max-h-100 overflow-clip rounded-xl">
              <Image
                alt={`${contestant.firstName} ${contestant.lastName}`}
                src={`https://kidscrown.net/${contestant.picture}`}
                width={360}
                height={460}
                priority
                className="min-w-full object-cover"
              />
            </div>

            <CardTitle className="text-center text-2xl">
              {contestant.firstName} {contestant.lastName}
            </CardTitle>
            <div className="flex items-center gap-4 mx-auto">
              <CardDescription className="md:text-md">
                Gender:{" "}
                <span className="font-bold">
                  {capitalize(contestant.gender)}
                </span>
              </CardDescription>
              <CardDescription className="md:text-md">
                Age: <span className="font-semibold">{contestant.age}</span>
              </CardDescription>
            </div>
            <p className="text-center font-bold">
              Vote score: {contestant.stage2vote}
            </p>
            <CardAction className="my-6 mx-auto">
              <Button asChild>
                <Link href={`/contestant/${contestant.contestantId}`}>
                  See Profile
                </Link>
              </Button>
            </CardAction>
          </Card>
        ))}
      </div>
    </section>
  );
}
