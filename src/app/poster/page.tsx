"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* ─── Deterministic floating confetti ─────────────────────────────── */
const CONFETTI = [
  { x: 6,  y: 7,  c: "#FACC14", s: 14, r: 15,  d: 0.0 },
  { x: 91, y: 4,  c: "#A855F7", s: 9,  r: -22, d: 0.4 },
  { x: 96, y: 28, c: "#FB923C", s: 12, r: 45,  d: 0.9 },
  { x: 3,  y: 40, c: "#22C55E", s: 8,  r: -35, d: 0.3 },
  { x: 94, y: 55, c: "#F472B6", s: 7,  r: 60,  d: 1.1 },
  { x: 4,  y: 70, c: "#FACC14", s: 11, r: -18, d: 0.6 },
  { x: 90, y: 80, c: "#22C55E", s: 8,  r: 30,  d: 0.8 },
  { x: 10, y: 88, c: "#A855F7", s: 10, r: -50, d: 0.2 },
  { x: 82, y: 13, c: "#FACC14", s: 7,  r: 20,  d: 1.3 },
  { x: 50, y: 2,  c: "#FB923C", s: 9,  r: -12, d: 0.7 },
  { x: 22, y: 52, c: "#F472B6", s: 6,  r: 50,  d: 1.0 },
  { x: 75, y: 46, c: "#FACC14", s: 13, r: -28, d: 0.5 },
  { x: 36, y: 83, c: "#22C55E", s: 7,  r: 38,  d: 1.5 },
  { x: 66, y: 93, c: "#A855F7", s: 9,  r: -42, d: 0.1 },
  { x: 44, y: 18, c: "#FB923C", s: 6,  r: 55,  d: 0.8 },
  { x: 58, y: 75, c: "#F472B6", s: 8,  r: -8,  d: 1.2 },
  { x: 30, y: 30, c: "#FACC14", s: 5,  r: 70,  d: 0.35 },
  { x: 70, y: 62, c: "#22C55E", s: 10, r: -60, d: 0.95 },
];

const PRIZES = [
  { rank: "1ST PLACE",  icon: "🏆", amount: "₦500,000", note: "Cash + 3-Year Scholarship", bg: "#FACC14", fg: "#000000" },
  { rank: "2ND PLACE",  icon: "🥈", amount: "₦300,000", note: "Cash Prize",               bg: "#A855F7", fg: "#ffffff" },
  { rank: "3RD PLACE",  icon: "🥉", amount: "₦200,000", note: "Cash Prize",               bg: "#22C55E", fg: "#ffffff" },
];

const ZIG = (
  <svg viewBox="0 0 300 14" className="w-full" preserveAspectRatio="none" aria-hidden>
    <polyline
      points="0,7 15,0 30,7 45,0 60,7 75,0 90,7 105,0 120,7 135,0 150,7 165,0 180,7 195,0 210,7 225,0 240,7 255,0 270,7 285,0 300,7"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

/* ─── Stagger helpers ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function CampaignPoster() {
  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes float-up {
          0%,100% { transform: translateY(0)   rotate(var(--r)); opacity:.7; }
          50%      { transform: translateY(-22px) rotate(calc(var(--r) + 18deg)); opacity:1; }
        }
        @keyframes spin-badge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes star-pulse {
          0%,100% { opacity:.06; transform:scale(1); }
          50%      { opacity:.10; transform:scale(1.05); }
        }
        .confetti-item { animation: float-up var(--dur) ease-in-out infinite; animation-delay: var(--del); }
        .bg-star       { animation: star-pulse 5s ease-in-out infinite; }
        .spin-badge    { animation: spin-badge 14s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-[#050505] flex items-center justify-center py-16 px-4 relative overflow-hidden">

        {/* ── Full-page ambient glow ── */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(250,204,20,0.07) 0%, transparent 70%)" }}
        />

        {/* ── Poster card ─────────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden bg-[#0A0A0A]"
          style={{
            maxWidth: 540,
            aspectRatio: "4/5",
            border: "3px solid #FACC14",
            boxShadow: "0 0 0 1px #000, 0 0 60px rgba(250,204,20,0.25), 0 0 120px rgba(250,204,20,0.10)",
          }}
        >

          {/* ── Background watermark star ── */}
          <div className="bg-star absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span style={{ fontSize: "min(80vw, 520px)", lineHeight: 1, color: "#FACC14" }}>★</span>
          </div>

          {/* ── Diagonal stripe accent ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{
              position: "absolute",
              top: "-60%", left: "-20%",
              width: "140%", height: "60%",
              background: "linear-gradient(180deg, rgba(250,204,20,0.04) 0%, transparent 100%)",
              transform: "rotate(-8deg)",
            }} />
          </div>

          {/* ── Floating confetti ── */}
          {CONFETTI.map((p, i) => (
            <span
              key={i}
              className="confetti-item absolute pointer-events-none select-none font-black"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                fontSize: p.s, color: p.c,
                "--r":   `${p.r}deg`,
                "--dur": `${5 + (i % 4)}s`,
                "--del": `${p.d}s`,
              } as React.CSSProperties}
            >★</span>
          ))}

          {/* ── Poster content ── */}
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8">

            {/* TOP ROW */}
            <motion.div {...fadeUp(0)} className="flex items-center justify-between">
              <Image src="/logo.svg" alt="Logo" width={72} height={22} className="opacity-90" />
              <div
                className="spin-badge flex items-center justify-center rounded-full border-2 border-[#FACC14] text-[#FACC14] font-black"
                style={{ width: 54, height: 54, fontSize: 10, textAlign: "center", letterSpacing: "0.06em" }}
              >
                <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                  <defs>
                    <path id="arc" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text fontSize="12" fontWeight="900" fill="#FACC14" fontFamily="var(--font-fredoka)">
                    <textPath href="#arc" startOffset="0%">★ LEADRITEHUB.COM ★ 2025 ★</textPath>
                  </text>
                </svg>
                <span style={{ fontSize: 20 }}>★</span>
              </div>
            </motion.div>

            {/* HEADLINE */}
            <motion.div {...fadeUp(0.1)} className="text-center leading-none space-y-1 -mt-2">
              <p className="text-white/30 font-black tracking-[0.45em] text-[0.6rem] uppercase">
                Nigeria&apos;s Most Exciting
              </p>
              <div className="font-black uppercase leading-[0.88]">
                <span className="block text-white/25 text-[min(5vw,1.1rem)] tracking-[0.35em]">THE</span>
                <span
                  className="block text-[min(22vw,6.2rem)]"
                  style={{
                    color: "#FACC14",
                    textShadow: "0 0 30px rgba(250,204,20,0.6), 0 0 80px rgba(250,204,20,0.25)",
                  }}
                >FUTURE</span>
                <span
                  className="block text-[min(26vw,7.2rem)]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "min(0.8vw,3px) #FACC14",
                    textShadow: "0 0 50px rgba(250,204,20,0.2)",
                  }}
                >STAR</span>
                <span
                  className="block text-white text-[min(9vw,2.4rem)] tracking-[0.18em]"
                >CHALLENGE</span>
              </div>

              <div className="flex items-center gap-3 pt-1 text-[#FACC14]/50">
                {ZIG}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                {["KIDS CONTEST", "AGES 0–10", "VOTE ₦50"].map((tag, i) => (
                  <span
                    key={tag}
                    className="font-black text-[0.5rem] tracking-widest px-2.5 py-1 rounded-full border uppercase"
                    style={{
                      borderColor: ["#FACC14","#A855F7","#22C55E"][i],
                      color: ["#FACC14","#A855F7","#22C55E"][i],
                    }}
                  >{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* PRIZES */}
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-3 gap-2">
              {PRIZES.map((p, i) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
                  className="rounded-xl p-3 text-center border-2 border-black"
                  style={{
                    background: p.bg,
                    color: p.fg,
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  <span className="text-lg leading-none block">{p.icon}</span>
                  <p className="font-black text-[0.5rem] tracking-widest uppercase mt-1 opacity-70">{p.rank}</p>
                  <p className="font-black leading-tight" style={{ fontSize: "min(4vw,1.05rem)" }}>{p.amount}</p>
                  <p className="font-bold opacity-60 mt-0.5" style={{ fontSize: "0.48rem" }}>{p.note}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA BLOCK */}
            <motion.div {...fadeUp(0.4)} className="space-y-2.5">
              {/* Register bar */}
              <div
                className="rounded-xl border-2 border-black text-center py-3 px-4"
                style={{ background: "#FACC14", boxShadow: "5px 5px 0px #000" }}
              >
                <p className="text-black font-black tracking-[0.3em] text-[0.55rem] uppercase">
                  Register Your Child At
                </p>
                <p className="text-black font-black tracking-wide" style={{ fontSize: "min(6vw,1.6rem)" }}>
                  leadritehub.com
                </p>
              </div>

              {/* Bottom info strip */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-white/40 font-bold text-[0.48rem] tracking-widest uppercase">Vote from</p>
                  <p className="text-[#FACC14] font-black text-sm leading-tight">₦50 / vote</p>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-white/40 font-bold text-[0.48rem] tracking-widest uppercase">Open to</p>
                  <p className="text-[#A855F7] font-black text-sm leading-tight">All Nigeria</p>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-white/40 font-bold text-[0.48rem] tracking-widest uppercase">Ages</p>
                  <p className="text-[#22C55E] font-black text-sm leading-tight">0 – 10 yrs</p>
                </div>
              </div>
            </motion.div>

            {/* FOOTER */}
            <motion.div {...fadeUp(0.5)} className="flex items-center justify-between border-t border-white/10 pt-3">
              <p className="text-white/20 font-bold text-[0.48rem] tracking-widest uppercase">
                The Future Star Challenge
              </p>
              <div className="flex gap-1">
                {["#FACC14","#A855F7","#22C55E","#FB923C"].map(c => (
                  <div key={c} className="w-2 h-2 rounded-full border border-black" style={{ background: c }} />
                ))}
              </div>
              <p className="text-white/20 font-bold text-[0.48rem] tracking-widest">© 2025</p>
            </motion.div>

          </div>
        </div>

        {/* ── Below-poster hint ── */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-white/20 text-xs font-semibold tracking-widest uppercase">
            Screenshot this poster to share
          </p>
        </div>
      </div>
    </>
  );
}
