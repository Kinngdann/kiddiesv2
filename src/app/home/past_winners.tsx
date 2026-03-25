import Image from "next/image";
import { contestants } from "./contestants_data";

export default function PastWinners() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-200 text-yellow-700 text-sm font-bold px-4 py-1.5 rounded-full">
          <span>👑</span>
          <span>Hall of Fame</span>
        </div>
        <h2 className="leading-9 font-bold">Meet Our Past Winners</h2>
        <p className="font-semibold text-gray-600">
          Some of our prestige winners in the past contest
        </p>
      </div>
      <div className="grid px-4 gap-8 lg:grid-cols-4">
        {contestants.map((contestant, index) => (
          <div
            key={index}
            className="relative group border border-sky-100 shadow-lg rounded-xl overflow-clip hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="absolute z-2 top-4 rounded-r-full text-[0.7rem] font-bold text-white bg-gradient-to-r from-sky-400 to-cyan-500 px-3 py-1">
              👑 Grand Winner <br /> {contestant.edition}
            </div>
            <div className="h-70 overflow-clip">
              <Image
                src={contestant.image}
                alt="picture of contestant"
                width={350}
                height={350}
                className="group-hover:scale-110 transition duration-300 ease-in-out"
              />
            </div>
            <div className="px-4 py-4 text-center space-y-2">
              <h3 className="font-bold leading-6">{contestant.name}</h3>
              <div className="flex gap-4 justify-center">
                <p className="text-sm">
                  Gender: <span className="font-bold text-sky-500">{contestant.gender}</span>
                </p>
                <p className="text-sm">
                  Age: <span className="font-semibold text-sky-500">{contestant.age}</span>
                </p>
              </div>
              <blockquote className="italic text-gray-500 mt-4 text-sm">
                {contestant.note}
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
