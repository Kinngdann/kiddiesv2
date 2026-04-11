"use client";

import Image from "next/image";

const Star = ({ color = "#FACC14", size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden>
    <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" />
  </svg>
);

export default function StageBanner() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center py-12 px-4 gap-4">
      <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase text-center">
        Stage Banner
      </p>

      {/* ── BANNER — 480×200 header style ── */}
      <div
        id="stage-banner"
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 480,
          height: 200,
          fontFamily: "var(--font-fredoka), sans-serif",
          border: "3px solid #111",
          boxShadow: "8px 8px 0px #111",
          background: "#111",
          flexShrink: 0,
        }}
      >
        {/* Background dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #FACC14 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            opacity: 0.06,
          }}
        />

        {/* Corner stars */}
        <div className="absolute -top-2 -left-2 pointer-events-none" style={{ opacity: 0.15 }}>
          <Star color="#FACC14" size={64} />
        </div>
        <div className="absolute -bottom-2 -right-2 pointer-events-none" style={{ opacity: 0.15, transform: "rotate(20deg)" }}>
          <Star color="#A855F7" size={56} />
        </div>

        {/* ── TOP BAR ── */}
        <div
          className="flex items-center justify-between px-4 border-b-2 border-black shrink-0 z-10"
          style={{ height: 40, background: "#FACC14" }}
        >
          <Image src="/logo.svg" alt="Logo" width={60} height={15} />
          <div className="flex items-center gap-1">
            <Star color="#111" size={8} />
            <span className="font-black text-black text-[0.44rem] tracking-widest uppercase">
              The Future Star Contest
            </span>
            <Star color="#111" size={8} />
          </div>
        </div>

        {/* ── HEADLINE ── */}
        <div className="relative flex flex-col items-center justify-center flex-1 z-10">
          <div className="flex items-center gap-3 mb-1">
            <Star color="#FACC14" size={14} />
            <p className="font-bold text-white/40 text-[0.5rem] tracking-[0.3em] uppercase">
              Official Announcement
            </p>
            <Star color="#FACC14" size={14} />
          </div>
          <div className="text-center leading-none">
            <span
              className="font-black text-white uppercase"
              style={{ fontSize: "2.8rem", letterSpacing: "-0.02em" }}
            >
              Stage One{" "}
            </span>
            <span
              className="font-black uppercase"
              style={{
                fontSize: "2.8rem",
                color: "#FACC14",
                WebkitTextStroke: "1.5px #FACC14",
                letterSpacing: "-0.02em",
              }}
            >
              Has Started!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
