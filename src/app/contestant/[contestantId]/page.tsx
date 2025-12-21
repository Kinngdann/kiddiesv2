import Countdown from "./components/countdown";
import HowToVote from "./components/how-to-vote";
import NoUserFound from "./components/not-found";
import Profile from "./components/profile";
import { ShareLink } from "./components/share";

interface ContestantPageParams {
  params: {
    contestantId: string;
  };
}

export default async function Contestant({ params }: ContestantPageParams) {
  const { contestantId } = await params;

  const response = await fetch(
    `http://localhost:3000/api/contestant/${contestantId}`
  );

  if (!response.ok) {
    return <NoUserFound />;
  }

  const user = await response.json();
  const contestant = {
    ...user,
    name: `${user.firstName} ${user.lastName ?? ""}`,
  };

  return (
    <section className="fb-col-wrapper pt-20 md:pt-32">
      <Countdown target="2025-12-25" header="The Final Ends in" />
      <Profile contestant={contestant} />
      <ShareLink />
      <HowToVote />
    </section>
  );
}
