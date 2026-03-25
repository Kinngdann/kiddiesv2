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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/contestant`, {
    cache: "no-store",
  });

  const contestants: Contestant[] = await response.json();

  return (
    <section className="fb-col-wrapper pt-24">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 text-sky-700 text-sm font-bold px-4 py-1.5 rounded-full">
          <span>🌟</span>
          <span>Meet the Stars</span>
        </div>
        <h3 className="text-center font-bold text-2xl">
          All Active Contestants
        </h3>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {contestants.map((contestant) => (
          <Card
            key={contestant.contestantId}
            className="gap-2 py-0 rounded-xl overflow-hidden border-sky-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 hover:border-sky-300">
            <div className="full-bleed max-h-72 md:max-h-100 overflow-clip">
              <Image
                alt={`${contestant.firstName} ${contestant.lastName}`}
                src={`https://kidscrown.net/${contestant.picture}`}
                width={360}
                height={460}
                priority
                className="min-w-full object-cover"
              />
            </div>

            <CardTitle className="text-center text-2xl font-bold">
              {contestant.firstName} {contestant.lastName}
            </CardTitle>
            <div className="flex items-center gap-4 mx-auto">
              <CardDescription className="md:text-md">
                Gender:{" "}
                <span className="font-bold text-sky-500">
                  {capitalize(contestant.gender)}
                </span>
              </CardDescription>
              <CardDescription className="md:text-md">
                Age: <span className="font-semibold text-sky-500">{contestant.age}</span>
              </CardDescription>
            </div>
            <p className="text-center font-bold text-sm text-gray-500">
              🗳️ Vote score:{" "}
              <span className="text-sky-500">{contestant.stage2vote}</span>
            </p>
            <CardAction className="my-6 mx-auto">
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-white font-bold shadow-md shadow-sky-200">
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
