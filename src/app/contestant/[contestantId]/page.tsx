import Countdown from "./components/countdown";
import HowToVote from "./components/how-to-vote";
import NoUserFound from "./components/not-found";
import Profile from "./components/profile";
import { ShareLink } from "./components/share";
import { capitalize } from "@/utils/capitalize";
import type { Metadata } from "next";

interface ContestantPageParams {
  params: Promise<{ contestantId: string }>;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function fetchContestant(contestantId: string) {
  const res = await fetch(`${APP_URL}/api/contestant/${contestantId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: ContestantPageParams): Promise<Metadata> {
  const { contestantId } = await params;
  const user = await fetchContestant(contestantId);

  if (!user) {
    return { title: "Contestant Not Found | The Future Star Contest" };
  }

  const name = [user.firstName, user.lastName]
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
  const votes = user.currentVotes ?? user.stage2vote ?? 0;
  const pronoun = user.gender === "male" ? "him" : "her";
  const title = `Vote for ${name} — Contestant #${user.contestantId} | The Future Star Contest`;
  const description = `${name} has ${votes} votes. Help ${pronoun} reach the top! Vote now for ₦50 per vote.`;
  const imageUrl = user.picture
    ? `${APP_URL}/${user.picture}`
    : `${APP_URL}/logo.svg`;
  const pageUrl = `${APP_URL}/contestant/${contestantId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "The Future Star Contest",
      images: [{ url: imageUrl, width: 360, height: 460, alt: name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Contestant({ params }: ContestantPageParams) {
  const { contestantId } = await params;

  const response = await fetch(`${APP_URL}/api/contestant/${contestantId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return <NoUserFound />;
  }

  const user = await response.json();
  const contestant = {
    ...user,
    appUrl: APP_URL,
    name: [user.firstName, user.lastName]
      .filter(Boolean)
      .map(capitalize)
      .join(" "),
  };

  const countdownTarget = user.endDate
    ? new Date(user.endDate).toISOString().split("T")[0]
    : "";
  const countdownHeader = user.stageLabel
    ? `${user.stageLabel} Ends in`
    : "Contest Ends in";

  return (
    <section className="fb-col-wrapper pt-20 md:pt-32">
      {/* {user.currentStage === 2 && !user.votingOpen && <StageTwoComingSoon />} */}
      {countdownTarget && (
        <Countdown target={countdownTarget} header={countdownHeader} />
      )}
      <Profile
        contestant={contestant}
        isVotingOpen={user.votingOpen ?? false}
      />
      <ShareLink contestantName={contestant.name} />
      <HowToVote />
    </section>
  );
}
