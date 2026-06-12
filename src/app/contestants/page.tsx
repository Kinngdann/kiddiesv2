import ComingSoonPoster from "@components/coming-soon-poster";

export default function Contestants() {
  return (
    <section className="fb-col-wrapper min-h-dvh place-items-center pt-28 pb-16">
      <ComingSoonPoster
        eyebrow="Meet the Stars"
        title="Contestants Coming Soon"
        message="We are getting the next lineup ready. Check back shortly to meet the children taking the spotlight in The Future Star Contest."
      />
    </section>
  );
}
