import Image from "next/image";
import imageOfKids from "./images/children.jpg";

export default function About() {
  return (
    <section className="full-bleed grid lg:grid-cols-2" id="about">
      <div className="bg-rose-200 grid place-content-center p-8 py-10 space-y-2">
        <h2 className="font-bold">Our Purpose</h2>
        <p className="max-w-[50ch] font-semibold">
          Our purpose is to bring fun to Nigerian families this Christmas
          holiday by strengthening the bond between parents and their children,
          while creating an exciting platform for families to showcase their
          connection and creativity. Winners will be crowned Parent and Child of
          the Year 2025.
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
