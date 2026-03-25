"use client";

import Image from "next/image";
import VotingForm from "./voting-form";
import PastVotes from "./past-votes";
import { capitalize } from "@/utils/capitalize";
import { nthPosition } from "@/utils/format-position";
import { getEarnedMilestones, getNextMilestone } from "@/utils/vote-milestones";
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
    stage2vote: number;
    stage3vote: number;
    currentVotes: number;
    stageLabel: string;
    position: number;
    picture: string;
    videoUrl?: string | null;
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
  isVotingOpen: boolean;
};

export default function Profile({ contestant, isVotingOpen }: contestantProps) {
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
        <div className="mt-8 space-y-3">
          {/* Vote count + position */}
          <div className="flex justify-evenly bg-gray-500 border border-gray-300 p-4 rounded-sm text-gray-100">
            <div className="flex gap-2 items-center">
              <span className="font-bold">{contestant.stageLabel ?? "Votes"}:</span>
              <span className="text-2xl font-black">
                {contestant.currentVotes ?? contestant.stage2vote}
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

          {/* Milestone badges */}
          {(() => {
            const votes = contestant.currentVotes ?? contestant.stage2vote ?? 0;
            const earned = getEarnedMilestones(votes);
            const next = getNextMilestone(votes);
            if (earned.length === 0 && !next) return null;
            return (
              <div className="space-y-2">
                {earned.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {earned.map((m) => (
                      <span
                        key={m.votes}
                        className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-0.5 ${m.color}`}>
                        {m.emoji} {m.label}
                      </span>
                    ))}
                  </div>
                )}
                {next && (
                  <p className="text-xs text-muted-foreground">
                    Next badge: <span className="font-semibold">{next.emoji} {next.label}</span> at {next.votes} votes
                    {" "}— only <span className="font-semibold text-foreground">{next.votes - votes} more</span> to go!
                  </p>
                )}
              </div>
            );
          })()}

          {/* Progress bar toward next rank */}
          {contestant.position === 1 && contestant.voteDifference === null ? (
            <p className="text-sm font-bold text-teal-600">
              Leading the contest right now!
            </p>
          ) : contestant.voteDifference !== null && contestant.voteDifference > 0 ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress to {nthPosition(contestant.position - 1)} place</span>
                <span>{contestant.voteDifference} votes needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-2.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      95,
                      ((contestant.currentVotes ?? contestant.stage2vote) /
                        ((contestant.currentVotes ?? contestant.stage2vote) +
                          contestant.voteDifference)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Only{" "}
                <span className="font-bold text-foreground">
                  {contestant.voteDifference} more votes
                </span>{" "}
                to reach{" "}
                <span className="font-bold">
                  {nthPosition(contestant.position - 1)} place
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Keep voting to help {contestant.name} climb the ranks!
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <PastVotes voteLog={contestant.voteLogs} />
          <VotingForm
            updateSuccessDialogData={updateSuccessDialogData}
            isVotingOpen={isVotingOpen}
            contestant={{
              contestantId: contestant.contestantId,
              name: contestant.name,
              gender: contestant.gender,
              stage2votes: contestant.stage2vote,
            }}
          />
        </div>

        {contestant.videoUrl && (() => {
          const youtubeMatch = contestant.videoUrl.match(
            /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
          );
          if (youtubeMatch) {
            return (
              <div className="mt-4 rounded-sm overflow-hidden aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                  title={`${contestant.name} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
          }
          return (
            <a
              href={contestant.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-sm font-semibold underline underline-offset-4 text-teal-600">
              Watch {contestant.name}&apos;s video
            </a>
          );
        })()}
      </div>
    </>
  );
}
