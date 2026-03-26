import Image from "next/image";
import { activities } from "./activities_data";

const CARD_STYLES = [
  { bg: "bg-[#FACC14]", text: "text-black", num: "text-black/20" },
  { bg: "bg-[#22C55E]", text: "text-white", num: "text-white/20" },
  { bg: "bg-[#A855F7]", text: "text-white", num: "text-white/20" },
  { bg: "bg-[#FB923C]", text: "text-black", num: "text-black/20" },
];

const ZigZag = () => (
  <svg viewBox="0 0 260 16" className="w-52 text-black/20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <polyline
      points="0,8 13,0 26,8 39,0 52,8 65,0 78,8 91,0 104,8 117,0 130,8 143,0 156,8 169,0 182,8 195,0 208,8 221,0 234,8 247,0 260,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ActivityRoadmap() {
  return (
    <section className="space-y-10 mb-8">
      <div className="text-center space-y-3">
        <p className="font-bold text-xs tracking-widest uppercase text-gray-400">How It Works</p>
        <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)] leading-tight">
          4 Simple Steps to{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Victory</span>
            <span
              className="absolute inset-x-0 bottom-1 h-3.5 bg-[#FACC14] -z-0 -rotate-1 rounded"
              aria-hidden
            />
          </span>
        </h2>
        <div className="flex justify-center">
          <ZigZag />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {activities.map((activity, i) => {
          const { bg, text, num } = CARD_STYLES[i % CARD_STYLES.length];
          return (
            <div
              key={activity.name}
              className={`${bg} rounded-2xl p-6 space-y-4 relative overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition duration-200`}
            >
              <span
                className={`absolute top-3 right-4 text-[6rem] font-bold leading-none ${num} select-none pointer-events-none`}
                aria-hidden
              >
                {i + 1}
              </span>
              <Image
                src={activity.image}
                alt=""
                className="w-14 h-14 object-contain relative z-10"
              />
              <div className="relative z-10 space-y-2">
                <h3 className={`font-bold text-xl ${text}`}>{activity.name}</h3>
                <p className={`text-sm leading-relaxed font-semibold ${text} opacity-80`}>
                  {activity.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
