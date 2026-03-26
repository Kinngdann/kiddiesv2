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

const ACCENT_COLORS = [
  "bg-[#FACC14]",
  "bg-[#A855F7]",
  "bg-[#22C55E]",
  "bg-[#FB923C]",
];

export default async function Contestants() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/contestant`, {
    cache: "no-store",
  });

  const contestants: Contestant[] = await response.json();

  return (
    <section className="fb-col-wrapper pt-28 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-4">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          🌟 Meet the Stars
        </span>
        <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)]">
          All Active Contestants
        </h2>
        <p className="text-gray-600 font-semibold">
          Vote for your favourite star — ₦50 per vote
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contestants.map((contestant, i) => (
          <div
            key={contestant.contestantId}
            className="rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition duration-200 bg-white"
          >
            {/* Photo */}
            <div className="h-72 overflow-hidden relative">
              <Image
                alt={`${contestant.firstName} ${contestant.lastName}`}
                src={`https://kidscrown.net/${contestant.picture}`}
                width={360}
                height={460}
                priority
                className="w-full h-full object-cover"
              />
              {/* Contestant ID badge */}
              <span className="absolute top-3 left-3 bg-black text-white font-bold text-[0.6rem] px-2 py-0.5 rounded-full">
                #{contestant.contestantId}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-black text-xl leading-snug">
                {contestant.firstName} {contestant.lastName}
              </h3>

              <div className="flex gap-2 flex-wrap">
                <span className={`${ACCENT_COLORS[i % ACCENT_COLORS.length]} text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black`}>
                  {capitalize(contestant.gender)}
                </span>
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
                  Age {contestant.age}
                </span>
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
                  🗳️ {contestant.stage2vote} votes
                </span>
              </div>

              <Link
                href={`/contestant/${contestant.contestantId}`}
                className="block w-full text-center bg-black text-[#FACC14] font-bold text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition"
              >
                See Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
