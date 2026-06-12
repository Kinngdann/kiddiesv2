import ComingSoonPoster from "@components/coming-soon-poster";

export const dynamic = "force-dynamic";

export default function LeaderBoardPage() {
  return (
    <section className="fb-col-wrapper min-h-dvh place-items-center pt-28 pb-16">
      <ComingSoonPoster
        eyebrow="Rankings"
        title="Leaderboard Coming Soon"
        message="The rankings board is being prepared. Once voting activity is live, the top Future Stars will be revealed here."
      />
    </section>
  );
}
