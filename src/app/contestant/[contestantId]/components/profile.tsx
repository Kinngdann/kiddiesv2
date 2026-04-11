"use client";

import Image from "next/image";
import VotingForm from "./voting-form";
import PastVotes from "./past-votes";
import { capitalize } from "@/utils/capitalize";
import { nthPosition } from "@/utils/format-position";
import { getEarnedMilestones, getNextMilestone } from "@/utils/vote-milestones";
import { useState, useEffect, useRef } from "react";
import { ShowVoteSuccess } from "./voting-success";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@ui/dialog";
const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

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
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const urgencyShown = useRef(false);
  const [triggerVoteForm, setTriggerVoteForm] = useState(false);

  const STAGE_THRESHOLD = 300;
  const currentVotes = contestant.currentVotes ?? contestant.stage2vote ?? 0;
  const votesNeeded = STAGE_THRESHOLD - currentVotes;

  useEffect(() => {
    if (urgencyShown.current || currentVotes >= STAGE_THRESHOLD) return;
    const timer = setTimeout(() => {
      setUrgencyOpen(true);
      urgencyShown.current = true;
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentVotes]);

  const updateSuccessDialogData = (numberOfVotes: string) => {
    setSuccessDialogData({ vote: numberOfVotes });
    setSuccessDialog(true);
  };

  const refreshPage = () => {
    setSuccessDialog(false);
    router.refresh();
  };

  const srcImage =
    !contestant.picture
      ? contestant.gender?.toLowerCase() === "male"
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

      {/* Urgency popup — shown after 5s if below threshold */}
      <Dialog open={urgencyOpen} onOpenChange={setUrgencyOpen}>
        <DialogContent className="bg-white sm:max-w-sm border-2 border-black shadow-[6px_6px_0px_#111]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-black font-bold text-xl">
              {contestant.name} needs your help!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm leading-relaxed">
              To advance to the next stage, contestants must reach{" "}
              <span className="font-bold text-black">
                {STAGE_THRESHOLD} votes
              </span>
              . {contestant.name} currently has{" "}
              <span className="font-bold text-black">{currentVotes} votes</span>{" "}
              and needs{" "}
              <span className="font-bold text-[#A855F7]">
                {votesNeeded} more
              </span>{" "}
              to qualify.
              <br />
              <br />
              Every vote counts, be the reason they make it to the next round!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => { setUrgencyOpen(false); setTriggerVoteForm(true); }}
              className="flex-1 text-center bg-[#FACC14] text-black font-bold text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
              Vote Now
            </button>
            <button
              onClick={() => setUrgencyOpen(false)}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition px-3">
              Dismiss
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile photo */}
      <div className="full-bleed max-h-96 md:max-h-120 overflow-hidden md:rounded-2xl md:border-2 md:border-black md:shadow-[6px_6px_0px_#111] md:col-start-2 md:col-span-6">
        <Image
          alt="Profile picture"
          src={srcImage}
          width={360}
          height={460}
          priority
          className="min-w-full object-cover"
        />
      </div>

      {/* Info column */}
      <div className="md:col-start-8 md:col-span-6 space-y-6">
        <div>
          <span className="inline-block bg-black text-[#FACC14] font-bold text-[0.65rem] px-3 py-1 rounded-full mb-2 tracking-wide">
            Contestant #{contestant.contestantId}
          </span>
          <h1 className="font-bold text-black text-3xl md:text-4xl leading-tight">
            {contestant.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="bg-[#A855F7] text-white font-bold text-xs px-3 py-1 rounded-full border-2 border-[#A855F7]">
              {capitalize(contestant.gender)}
            </span>
            <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-full border-2 border-[#22C55E]">
              Age {contestant.age}
            </span>
          </div>
          <blockquote className="mt-4 border-l-4 border-[#FACC14] pl-4 text-gray-600 italic text-left text-sm leading-relaxed">
            {contestant.bio ??
              `${contestant.gender?.toLowerCase() === "male" ? "He" : "She"} is a wonderful child with a bright, loving spirit, growing each day into someone any mother would be proud to call her own.`}
          </blockquote>
        </div>

        <div className="space-y-3">
          {/* Vote count + position */}
          <div className="flex gap-4">
            <div className="flex-1 bg-sky-100 border border-sky-200 rounded-2xl p-4 text-center">
              <p className="text-sky-500 font-bold text-xs uppercase tracking-wider">
                {contestant.stageLabel ?? "Votes"}
              </p>
              <p className="text-sky-900 font-black text-3xl leading-tight">
                {contestant.currentVotes ?? contestant.stage2vote}{" "}
                <span className="text-lg font-bold">votes</span>
              </p>
            </div>
            <div className="flex-1 bg-sky-100 border border-sky-200 rounded-2xl p-4 text-center">
              <p className="text-sky-500 font-bold text-xs uppercase tracking-wider">
                Position
              </p>
              <p className="text-sky-900 font-black text-3xl leading-tight">
                {contestant.position <= 20
                  ? nthPosition(contestant.position)
                  : "–"}
              </p>
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
                        className={`inline-flex items-center gap-1 text-xs font-bold border rounded-full px-3 py-1 ${m.color}`}>
                        {m.emoji} {m.label}
                      </span>
                    ))}
                  </div>
                )}
                {next && (
                  <p className="text-xs text-gray-500 font-semibold">
                    Next badge:{" "}
                    <span className="font-bold text-black">
                      {next.emoji} {next.label}
                    </span>{" "}
                    at {next.votes} votes —{" "}
                    <span className="font-bold text-black">
                      {next.votes - votes} more
                    </span>{" "}
                    to go!
                  </p>
                )}
              </div>
            );
          })()}

          {/* Progress toward next rank */}
          {contestant.position === 1 && contestant.voteDifference === null ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              <p className="font-bold text-amber-700 text-sm">
                🏆 Leading the contest right now!
              </p>
            </div>
          ) : contestant.voteDifference !== null &&
            contestant.voteDifference > 0 &&
            (contestant.currentVotes ?? contestant.stage2vote) > 1 &&
            contestant.position - 1 <= 20 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>
                  Progress to {nthPosition(contestant.position - 1)} place
                </span>
                <span>{contestant.voteDifference} votes needed</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      95,
                      ((contestant.currentVotes ?? contestant.stage2vote) /
                        ((contestant.currentVotes ?? contestant.stage2vote) +
                          contestant.voteDifference)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 font-semibold">
                Only{" "}
                <span className="font-bold text-black">
                  {contestant.voteDifference} more votes
                </span>{" "}
                to reach{" "}
                <span className="font-bold text-black">
                  {nthPosition(contestant.position - 1)} place
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              Keep voting to help {contestant.name} climb the ranks!
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <PastVotes voteLog={contestant.voteLogs} />
          <VotingForm
            updateSuccessDialogData={updateSuccessDialogData}
            isVotingOpen={isVotingOpen}
            triggerOpen={triggerVoteForm}
            onTriggerConsumed={() => setTriggerVoteForm(false)}
            contestant={{
              contestantId: contestant.contestantId,
              name: contestant.name,
              gender: contestant.gender,
              stage2votes: contestant.stage2vote,
            }}
          />
        </div>

        {contestant.videoUrl &&
          (() => {
            const youtubeMatch = contestant.videoUrl!.match(
              /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
            );
            if (youtubeMatch) {
              return (
                <div className="mt-4 rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] aspect-video w-full">
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
                href={contestant.videoUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-bold text-sm underline underline-offset-4 text-[#A855F7] hover:opacity-70 transition">
                Watch {contestant.name}&apos;s video →
              </a>
            );
          })()}
      </div>
    </>
  );
}
