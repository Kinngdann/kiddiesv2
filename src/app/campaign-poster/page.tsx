"use client";

import Image from "next/image";
import childrenImg from "@/src/app/home/images/children.jpg";

const Star = ({ color = "#FACC14", size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden>
    <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" />
  </svg>
);

const XMark = ({ color = "#FACC14", size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
    <line x1="2" y1="2" x2="16" y2="16" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <line x1="16" y1="2" x2="2" y2="16" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const PREVIEW = {
  contestantId: "007",
  firstName: "Amara",
  lastName: "Okonkwo",
  age: "5",
  picture: null as string | null,
  profileUrl: "leadritehub.com/contestant/007",
};

export default function CampaignPoster() {
  const name = `${PREVIEW.firstName} ${PREVIEW.lastName}`;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center py-12 px-4 gap-4">
      <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase text-center">
        Preview — screenshot to share on WhatsApp / Instagram
      </p>

      {/* ── POSTER — 480×480 square ── */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 480,
          height: 480,
          fontFamily: "var(--font-fredoka), sans-serif",
          border: "3px solid #111",
          boxShadow: "8px 8px 0px #111",
          background: "#111",
          flexShrink: 0,
        }}
      >
        {/* Background decorative dots pattern */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #FACC14 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* ── TOP BAR ── */}
        <div
          className="flex items-center justify-between px-4 border-b-2 border-black shrink-0 z-10"
          style={{ height: 38, background: "#FACC14" }}
        >
          <Image src="/logo.svg" alt="Logo" width={72} height={18} />
          <div className="flex items-center gap-1">
            <Star color="#111" size={9} />
            <span className="font-black text-black text-[0.48rem] tracking-widest uppercase">
              The Future Star Challenge
            </span>
            <Star color="#111" size={9} />
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="relative flex flex-col items-center flex-1 overflow-hidden">

          {/* Decorative corner Xs */}
          <div className="absolute top-3 left-3 opacity-30"><XMark color="#FACC14" size={14} /></div>
          <div className="absolute top-3 right-3 opacity-30"><XMark color="#A855F7" size={14} /></div>
          <div className="absolute bottom-[88px] left-3 opacity-30"><XMark color="#22C55E" size={12} /></div>
          <div className="absolute bottom-[88px] right-3 opacity-30"><XMark color="#FB923C" size={12} /></div>

          {/* Decorative stars */}
          <div className="absolute top-5 left-[22%] opacity-50"><Star color="#FACC14" size={10} /></div>
          <div className="absolute top-8 right-[20%] opacity-40"><Star color="#A855F7" size={8} /></div>
          <div className="absolute bottom-[100px] left-[18%] opacity-40"><Star color="#22C55E" size={9} /></div>
          <div className="absolute bottom-[96px] right-[16%] opacity-40"><Star color="#FB923C" size={8} /></div>

          {/* ── CIRCULAR PHOTO ── */}
          <div className="relative mt-6 shrink-0" style={{ width: 200, height: 200 }}>
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 0 6px #FACC14, 0 0 0 9px #111" }}
            />
            {/* Photo circle */}
            <div
              className="relative w-full h-full rounded-full overflow-hidden border-4 border-black"
              style={{ boxShadow: "4px 4px 0 #FACC14" }}
            >
              {PREVIEW.picture ? (
                <Image
                  src={`/${PREVIEW.picture}`}
                  alt={name}
                  fill
                  className="object-cover object-top"
                  sizes="200px"
                />
              ) : (
                <Image
                  src={childrenImg}
                  alt={name}
                  fill
                  className="object-cover object-top"
                  sizes="200px"
                />
              )}
            </div>

            {/* Age badge — bottom-right of circle */}
            <div
              className="absolute -bottom-2 -right-2 flex flex-col items-center justify-center border-2 border-black font-black leading-none"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FACC14",
                boxShadow: "2px 2px 0 #111",
              }}
            >
              <span className="text-[0.36rem] tracking-widest text-black/50 uppercase font-bold">AGE</span>
              <span className="text-[1.1rem] text-black leading-none">{PREVIEW.age}</span>
            </div>

            {/* Contestant number badge — bottom-left of circle */}
            <div
              className="absolute -bottom-2 -left-2 flex flex-col items-center justify-center border-2 border-black font-black leading-none bg-white"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                boxShadow: "2px 2px 0 #111",
              }}
            >
              <span className="text-[0.34rem] tracking-widest text-gray-400 uppercase">NO.</span>
              <span className="text-[1.1rem] text-black leading-none">{PREVIEW.contestantId}</span>
            </div>
          </div>

          {/* ── NAME ── */}
          <div className="flex flex-col items-center mt-5 leading-none z-10">
            <p
              className="font-black text-white uppercase"
              style={{ fontSize: "2.1rem", textShadow: "2px 2px 0 rgba(0,0,0,0.5)", letterSpacing: "-0.01em" }}
            >
              {PREVIEW.firstName}
            </p>
            <p
              className="font-black uppercase leading-none"
              style={{
                fontSize: "1.75rem",
                color: "#FACC14",
                WebkitTextStroke: "1.5px #111",
                paintOrder: "stroke fill",
                letterSpacing: "-0.01em",
              }}
            >
              {PREVIEW.lastName}
            </p>
          </div>

          {/* Vote for me label */}
          <div className="flex items-center gap-1.5 mt-2 z-10">
            <Star color="#FACC14" size={10} />
            <p className="font-black text-white/70 text-[0.55rem] tracking-[0.2em] uppercase">Vote for me!</p>
            <Star color="#FACC14" size={10} />
          </div>
        </div>

        {/* ── BOTTOM PANEL ── */}
        <div
          className="shrink-0 border-t-2 border-black z-10"
          style={{ background: "#FACC14" }}
        >
          {/* CTA row */}
          <div className="flex items-center justify-between px-4 py-2.5 gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-black text-black/50 text-[0.44rem] tracking-[0.18em] uppercase mb-0.5">
                Cast your vote at
              </p>
              <p className="font-black text-black text-[0.82rem] leading-tight truncate">
                {PREVIEW.profileUrl}
              </p>
            </div>

            {/* Prize pills */}
            <div className="flex items-center gap-1 shrink-0">
              {[
                { label: "1st", amount: "₦500k" },
                { label: "2nd", amount: "₦300k" },
                { label: "3rd", amount: "₦200k" },
              ].map(({ label, amount }) => (
                <div
                  key={label}
                  className="flex flex-col items-center border-2 border-black rounded-lg px-1.5 py-1 bg-white"
                  style={{ boxShadow: "2px 2px 0 #111", minWidth: 44 }}
                >
                  <span className="font-bold text-black/40 text-[0.38rem] uppercase tracking-wide">{label}</span>
                  <span className="font-black text-black text-[0.72rem] leading-none">{amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between px-4 pb-2">
            <p className="font-black text-black/50 text-[0.44rem] tracking-widest uppercase">
              The Future Star Challenge
            </p>
            <div className="flex gap-1">
              {["#111", "#A855F7", "#22C55E", "#FB923C"].map((c) => (
                <div key={c} className="w-2 h-2 rounded-full border border-black/30" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-[0.62rem] font-semibold tracking-widest uppercase text-center max-w-xs">
        Dynamic version will auto-populate each contestant&apos;s photo, name, age &amp; link
      </p>
    </div>
  );
}
