import { Button } from "@ui/button";
import Link from "next/link";

export default function HeroPage() {
  return (
    <section className="heroBg full-bleed px-5 lg:px-28 min-h-dvh grid lg:grid-cols-2 place-items-center relative overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/hero-poster.jpg">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      {/* Light blue overlay */}
      <div className="absolute inset-0 z-10 bg-[rgb(224_242_254/75%)]" />

      <div className="space-y-8 relative z-20">
        <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-300 text-sky-800 text-sm font-bold px-4 py-1.5 rounded-full">
          <span>🎉</span>
          <span>Kiddies Crown Contest 2025</span>
        </div>
        <h1 className="mb-4 font-bold text-gray-900">
          How{" "}
          <span className="relative">
            <span
              className="absolute -inset-1 top-0 bottom-0 block -skew-y-3 bg-sky-500"
              aria-hidden="true"></span>
            <span className="relative text-white">cute</span>
          </span>
          <br />
          is Your Child?
        </h1>
        <p className="text-[1.1rem] lg:text-[1.3rem] font-semibold max-w-[40ch] text-gray-700">
          Join the{" "}
          <code className="font-bold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
            #KiddiesCrownContest
          </code>{" "}
          and give your child the chance to shine!
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="h-12 px-8 font-bold rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 shadow-lg shadow-sky-200 text-white"
            size="lg">
            <Link href="/register" target="_blank">
              JOIN CONTEST
            </Link>
          </Button>
          <Button
            variant="link"
            className="font-bold underline underline-offset-4 hover:text-sky-500 transition text-gray-700"
            asChild>
            <Link href="/#about">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="bg-[url(/girl.png)] bg-no-repeat bg-cover lg:bg-size-[auto_600px] bg-center w-full h-full relative z-20"></div>
    </section>
  );
}
