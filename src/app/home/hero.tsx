import {Button} from '@ui/button';
import Link from 'next/link';

export default function HeroPage() {
  return (
    <section className="heroBg full-bleed px-5 lg:px-28 min-h-dvh grid lg:grid-cols-2 place-items-center">
      <div className="space-y-8">
        <h1 className="mb-4 font-black">
          How{' '}
          <span className="relative">
            <span
              className="absolute -inset-1 top-0 bottom-0 block -skew-y-3 bg-pink-500"
              aria-hidden="true"></span>
            <span className="relative text-white">cute</span>
          </span>
          <br />
          is Your Child?
        </h1>
        <p className="text-[1.1rem] lg:text-[1.3rem] font-semibold max-w-[40ch]">
          Set your child up for success, an oppurtunity to command the star in
          your child in the Kiddies Crown Contest
        </p>
        <div className="">
          <Button asChild className="h-12 px-8 font-bold mr-4" size="lg">
            <Link href="/register" target="_blank">
              REGISTER
            </Link>
          </Button>
          <Button
            variant="link"
            className="font-bold underline underline-offset-4 hover:text-pink-500 transition"
            asChild>
            <Link href="/#about">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="bg-[url(/girl.png)] bg-no-repeat bg-cover lg:bg-size-[auto_600px] bg-center w-full h-full"></div>
    </section>
  );
}
