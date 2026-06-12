import { CalendarDays, Crown, Trophy } from "lucide-react";

type ComingSoonPosterProps = {
  eyebrow: string;
  title: string;
  message: string;
};

export default function ComingSoonPoster({
  eyebrow,
  title,
  message,
}: ComingSoonPosterProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0px_#111]">
        <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border-4 border-black bg-[#A855F7]" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full border-4 border-black bg-[#22C55E]" />

        <div className="relative grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#FACC14] border-b-4 border-black p-7 md:border-b-0 md:border-r-4 md:p-9">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#111]">
              {eyebrow}
            </div>

            <div className="grid aspect-square place-items-center rounded-2xl border-4 border-black bg-white shadow-[5px_5px_0px_#111]">
              <div className="grid place-items-center gap-4 text-center">
                <div className="grid size-24 place-items-center rounded-full border-4 border-black bg-black text-[#FACC14] shadow-[4px_4px_0px_#A855F7]">
                  <Crown className="size-12 fill-current" />
                </div>
                <div>
                  <p className="font-display text-3xl font-black leading-none text-black">
                    Future
                  </p>
                  <p className="font-display text-3xl font-black leading-none text-[#A855F7]">
                    Stars
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-7 md:p-9">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-black px-3 py-1 text-xs font-bold text-[#FACC14]">
                <CalendarDays className="size-3.5" />
                Coming Soon
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#22C55E] px-3 py-1 text-xs font-bold text-black">
                <Trophy className="size-3.5" />
                Contest Update
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.4rem,8vw,4.6rem)] font-black leading-[0.95] text-black">
              {title}
            </h1>

            <p className="mt-5 max-w-[34rem] text-base font-bold leading-relaxed text-gray-700">
              {message}
            </p>

            <div className="mt-7 border-y-4 border-black py-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">
                The Future Star Contest
              </p>
              <p className="mt-1 font-display text-2xl font-black text-black">
                New contestants and rankings will appear here.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl border-2 border-black bg-[#FACC14] px-4 py-3 shadow-[3px_3px_0px_#111]">
                <p className="text-xs font-black uppercase tracking-wider text-black">
                  Stage
                </p>
                <p className="font-display text-xl font-black text-black">
                  Preparing
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white px-4 py-3 shadow-[3px_3px_0px_#111]">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Status
                </p>
                <p className="font-display text-xl font-black text-[#A855F7]">
                  Almost Ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
