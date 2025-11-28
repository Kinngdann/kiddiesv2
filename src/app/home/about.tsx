import Image from 'next/image';
import imageOfKids from './images/children.jpg';

export default function About() {
  return (
    <section className="full-bleed grid lg:grid-cols-2">
      <div className="bg-rose-200 grid place-content-center p-8 py-10 space-y-2">
        <h2 className="font-bold">Our Purpose</h2>
        <p className="max-w-[50ch] font-semibold">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>
      </div>
      <div className="overflow-clip">
        <Image
          src={imageOfKids}
          alt="image of kids"
          className="hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>
    </section>
  );
}
