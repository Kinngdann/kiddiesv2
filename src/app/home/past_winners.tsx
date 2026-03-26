"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { contestants } from "./contestants_data";

const CARD_COLORS = [
  "bg-[#C084FC]", // purple
  "bg-[#4ADE80]", // green
  "bg-[#FACC14]", // yellow
  "bg-[#FB923C]", // orange
];

const ZigZagLine = () => (
  <svg viewBox="0 0 300 16" className="flex-1 max-w-xs text-black/15 hidden lg:block" aria-hidden>
    <polyline
      points="0,8 15,0 30,8 45,0 60,8 75,0 90,8 105,0 120,8 135,0 150,8 165,0 180,8 195,0 210,8 225,0 240,8 255,0 270,8 285,0 300,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PastWinners() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(contestants.length / perPage);
  const visible = contestants.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="space-y-8 mb-8">
      {/* Header row */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-3xl" aria-hidden>👑</span>
        <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,2.8rem)]">
          Meet Our Champions
        </h2>
        <ZigZagLine />
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous"
            className="w-10 h-10 border-2 border-black rounded flex items-center justify-center disabled:opacity-30 hover:bg-black hover:text-white transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next"
            className="w-10 h-10 bg-[#FACC14] border-2 border-black rounded flex items-center justify-center disabled:opacity-30 hover:bg-[#EAB308] transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="wait">
          {visible.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className={`${CARD_COLORS[i % CARD_COLORS.length]} rounded-2xl p-6 space-y-5 border-2 border-black shadow-[4px_4px_0px_#111] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#111] transition duration-200`}
            >
              {/* Edition badge */}
              <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                {c.edition} Winner
              </span>

              {/* Quote */}
              <p className="font-bold text-black text-[1.05rem] leading-snug">
                &ldquo;{c.note}&rdquo;
              </p>

              {/* Avatar + name */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black flex-shrink-0 bg-gray-200">
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-bold text-black text-sm leading-snug">{c.name}</p>
                  <p className="text-black/60 font-semibold text-xs">
                    {c.gender} · Age {c.age}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
