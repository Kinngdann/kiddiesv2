import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { capitalize } from "@/utils/capitalize";
import Image from "next/image";
import Link from "next/link";
const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

const ACCENT_COLORS = [
  "bg-[#FACC14]",
  "bg-[#A855F7]",
  "bg-[#22C55E]",
  "bg-[#FB923C]",
];

const PAGE_SIZE = 12;

export default async function Contestants({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const config = await getContestConfig();
  const field = stageVoteField(config.currentStage);

  const [contestants, total] = await Promise.all([
    prisma.contestant.findMany({
      where: { disabled: false },
      select: {
        contestantId: true,
        firstName: true,
        lastName: true,
        gender: true,
        age: true,
        stage1vote: true,
        stage2vote: true,
        stage3vote: true,
        picture: true,
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contestant.count({ where: { disabled: false } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    // <section className="fb-col-wrapper pt-28 pb-16">
    //   {/* Header */}
    //   <div className="text-center space-y-3 mb-4">
    //     <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
    //       🌟 Meet the Stars
    //     </span>
    //     <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)]">
    //       All Active Contestants
    //     </h2>
    //     <p className="text-gray-600 font-semibold">
    //       Vote for your favourite star — ₦50 per vote
    //     </p>
    //     <p className="text-gray-400 text-xs font-semibold">
    //       Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total} contestants
    //     </p>
    //   </div>

    //   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    //     {contestants.map((contestant, i) => (
    //       <div
    //         key={contestant.contestantId}
    //         className="rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition duration-200 bg-white"
    //       >
    //         {/* Photo */}
    //         <div className="h-72 overflow-hidden relative">
    //           <Image
    //             alt={`${contestant.firstName} ${contestant.lastName}`}
    //             src={contestant.picture ? `/${contestant.picture}` : contestant.gender?.toLowerCase() === "male" ? malePic : femalePic}
    //             fill
    //             className="object-cover object-top"
    //           />
    //           {/* Contestant ID badge */}
    //           <span className="absolute top-3 left-3 bg-black text-white font-bold text-[0.6rem] px-2 py-0.5 rounded-full">
    //             #{contestant.contestantId}
    //           </span>
    //         </div>

    //         {/* Info */}
    //         <div className="p-5 space-y-3">
    //           <h3 className="font-bold text-black text-xl leading-snug">
    //             {[contestant.firstName, contestant.lastName].filter(Boolean).map(capitalize).join(" ")}
    //           </h3>

    //           <div className="flex gap-2 flex-wrap">
    //             <span className={`${ACCENT_COLORS[i % ACCENT_COLORS.length]} text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black`}>
    //               {capitalize(contestant.gender)}
    //             </span>
    //             <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
    //               Age {contestant.age}
    //             </span>
    //             <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
    //               🗳️ {contestant[field]} votes
    //             </span>
    //           </div>

    //           <Link
    //             href={`/contestant/${contestant.contestantId}`}
    //             className="block w-full text-center bg-black text-[#FACC14] font-bold text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition"
    //           >
    //             See Profile →
    //           </Link>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Pagination */}
    //   {totalPages > 1 && (
    //     <div className="flex items-center justify-center gap-1 mt-10">
    //       <Link
    //         href={`/all-contestants?page=${currentPage - 1}`}
    //         aria-disabled={currentPage === 1}
    //         className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-black font-bold text-sm transition ${
    //           currentPage === 1
    //             ? "opacity-30 pointer-events-none bg-white"
    //             : "bg-white hover:bg-[#FACC14] shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
    //         }`}
    //       >
    //         ←
    //       </Link>

    //       {(() => {
    //         const pages: (number | "…")[] = [];
    //         for (let p = 1; p <= totalPages; p++) {
    //           if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
    //             pages.push(p);
    //           } else if (pages[pages.length - 1] !== "…") {
    //             pages.push("…");
    //           }
    //         }
    //         return pages.map((p, i) =>
    //           p === "…" ? (
    //             <span key={`ellipsis-${i}`} className="w-7 flex items-center justify-center font-bold text-sm text-gray-400">
    //               …
    //             </span>
    //           ) : (
    //             <Link
    //               key={p}
    //               href={`/all-contestants?page=${p}`}
    //               className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-black font-bold text-sm transition ${
    //                 p === currentPage
    //                   ? "bg-[#FACC14] shadow-[3px_3px_0px_#111]"
    //                   : "bg-white hover:bg-gray-50"
    //               }`}
    //             >
    //               {p}
    //             </Link>
    //           )
    //         );
    //       })()}

    //       <Link
    //         href={`/all-contestants?page=${currentPage + 1}`}
    //         aria-disabled={currentPage === totalPages}
    //         className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-black font-bold text-sm transition ${
    //           currentPage === totalPages
    //             ? "opacity-30 pointer-events-none bg-white"
    //             : "bg-white hover:bg-[#FACC14] shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
    //         }`}
    //       >
    //         →
    //       </Link>
    //     </div>
    //   )}
    // </section>
    <section className="fb-col-wrapper pt-28 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          All Contestants
        </span>
        <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)] flex items-center justify-center gap-3">
          <span>👑</span>
          <span>All Contestants</span>
          <span>👑</span>
        </h2>
      </div>

      <div className="mt-12 mx-auto max-w-xl text-center border-4 border-black rounded-2xl bg-[#FACC14] px-8 py-10 shadow-[6px_6px_0px_0px_#000]">
        <p className="text-2xl font-black text-black leading-snug">
          You&apos;ll be able to see all contestants here shortly.
        </p>
      </div>
    </section>
  );
}
