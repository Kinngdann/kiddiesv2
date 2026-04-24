"use client";

import Image from "next/image";

type Props = {
  contestant: {
    name: string;
    picture: string | null;
    gender: string | null;
    stage1vote: number;
  };
};

const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

export default function StageTwoComingSoon({ contestant }: Props) {
  const srcImage = !contestant.picture
    ? contestant.gender?.toLowerCase() === "male"
      ? malePic
      : femalePic
    : `/${contestant.picture}`;

  return (
    <div className="bg-[#FACC14] rounded-2xl p-6 md:p-8 text-center border-2 border-black shadow-[6px_6px_0px_#111] text-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-[4px_4px_0px_#111]">
          <Image
            alt={contestant.name}
            src={srcImage}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-2xl md:text-3xl">
            Hi, {contestant.name}!
          </h2>
          <p className="text-sm">
            Stage 1 Votes:{" "}
            <span className="font-bold text-black">
              {contestant.stage1vote}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t-2 border-white/30">
        <p className="font-bold text-xl">Stage 2 Begins Shortly</p>
        <p className="text-sm mt-1">
          Get ready for activity! Stage 2 voting will commence soon.
        </p>
      </div>
    </div>
  );
}
