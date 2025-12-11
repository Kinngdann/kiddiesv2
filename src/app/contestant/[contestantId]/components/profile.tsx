"use client";

import Image from "next/image";
import VotingForm from "./voting-form";
import PastVotes from "./past-votes";
import { capitalize } from "@/utils/capitalize";
import { nthPosition } from "@/utils/format-position";
import { useState } from "react";
import { ShowVoteSuccess } from "./voting-success";
import { useRouter } from "next/navigation";
import malePic from "./images/ma.jpg";
import femalePic from "./images/fe.jpg";

type contestantProps = {
  contestant: {
    contestantId: string;
    name: string;
    bio: string;
    gender: string;
    age: string;
    stage1vote: number;
    position: number;
    picture: string;
    voteDifference: number;
    voteLogs: {
      id: string;
      voterName: string;
      amount: number;
      numberOfVotes: number;
      voteMethod: string;
      createdAt: string;
      keepAnonymous: boolean | null;
    }[];
  };
};

export default function Profile({ contestant }: contestantProps) {
  const router = useRouter();
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    vote: string;
  }>();

  const updateSuccessDialogData = (numberOfVotes: string) => {
    setSuccessDialogData({ vote: numberOfVotes });
    setSuccessDialog(true);
  };

  const refreshPage = () => {
    setSuccessDialog(false);
    router.refresh();
  };

  const srcImage =
    contestant.picture === null
      ? contestant.gender === "male"
        ? malePic
        : femalePic
      : `/${contestant.picture}`;

  return (
    <>
      <ShowVoteSuccess
        open={successDialog}
        refreshPage={refreshPage}
        vote={successDialogData?.vote || "0"}
        contestantName={contestant.name}
      />
      <div className="full-bleed max-h-96 md:max-h-100 overflow-clip md:rounded-xl md:col-start-2 md:col-span-6">
        <Image
          alt="Profile picture"
          src={srcImage}
          width={360}
          height={460}
          priority
          className="min-w-full"
        />
      </div>
      <div className="md:col-start-8 md:col-span-6 space-y-6">
        <div>
          <p className="font-bold text-sm text-gray-500 bg-gray-200 w-fit rounded-xs px-2">
            Contestant No: <span>{contestant.contestantId}</span>
          </p>
          <h1 className="leading-12 font-black text-3xl md:text-4xl">
            {contestant.name}
          </h1>
          <div className="flex items-center gap-4">
            <p className="md:text-md">
              Gender:{" "}
              <span className="font-bold">{capitalize(contestant.gender)}</span>
            </p>
            <p className="md:text-md">
              Age: <span className="font-semibold">{contestant.age}</span>
            </p>
          </div>
          <blockquote className="mt-6 border-l-2 border-input pl-4 text-muted-foreground italic text-left">
            {contestant.bio ??
              `${
                contestant.gender === "male" ? "He" : "She"
              } is a wonderful child with a bright, loving spirit, growing each day into someone any mother would be proud to call her own.`}
          </blockquote>
        </div>
        <div className="mt-8">
          <div className="flex justify-evenly bg-gray-500 border border-gray-300 p-4 rounded-sm text-gray-100">
            <div className="flex gap-2 items-center">
              <span className="font-bold"> Votes:</span>
              <span className="text-2xl font-black ">
                {contestant.stage1vote}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold">Position:</span>
              <span className="text-2xl font-black">
                {contestant.position <= 20
                  ? nthPosition(contestant.position)
                  : "Nil"}
              </span>
            </div>
          </div>
          {contestant.position === 1 && contestant.voteDifference === null ? (
            <p className="text-sm mt-2 font-bold">
              🏅Best performing contestant right now
            </p>
          ) : contestant.position <= 20 ? (
            <p className="text-sm mt-2">
              <span className="font-bold">Tip:</span> this contestant needs
              atleast{" "}
              <span className="font-bold">
                {contestant.voteDifference + 20} votes
              </span>{" "}
              to claim the{" "}
              <span className="font-bold">
                {nthPosition(contestant.position - 1)} position
              </span>
            </p>
          ) : (
            <p className="text-sm mt-2">
              {contestant.name} needs atleast{" "}
              <span className="font-bold">300 votes</span> to get to the final
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <PastVotes voteLog={contestant.voteLogs} />
          <VotingForm
            updateSuccessDialogData={updateSuccessDialogData}
            contestant={{
              contestantId: contestant.contestantId,
              name: contestant.name,
              gender: contestant.gender,
              stage1votes: contestant.stage1vote,
            }}
          />
        </div>
      </div>
    </>
  );
}
