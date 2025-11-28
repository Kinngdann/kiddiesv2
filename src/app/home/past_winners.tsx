import Image from 'next/image';
import {contestants} from './contestants_data';
import winnerImage from './images/winner.jpg';

export default function PastWinners() {
  return (
    <section className="space-y-6">
      <div className="font-black text-center space-y-2">
        <h2 className="leading-9">Meet Our Past Winners</h2>
        <p className="lg:text-xl">
          Some of our prestige winners over the course of the contest
        </p>
      </div>
      <div className="grid px-4 gap-8 lg:grid-cols-4">
        {contestants.map((contestant, index) => (
          <div
            key={index}
            className="relative group border shadow-lg rounded-t-lg overflow-clip">
            <div className="absolute z-2 top-4 rounded-r-sm text-[0.7rem] font-black text-white bg-teal-600 px-2 py-1">
              Grand Winner
            </div>
            <Image
              src={winnerImage}
              alt="picture of contestant"
              width={350}
              height={350}
              className="group-hover:scale-110 transition duration-300 ease-in-out"
            />
            <div className="px-6 py-8 text-center space-y-2">
              <h3 className="font-bold text-xl leading-6">{contestant.name}</h3>
              <div className="flex gap-4 justify-center">
                <p className="text-sm">
                  Gender:{' '}
                  <span className="font-semibold">{contestant.gender}</span>
                </p>
                <p className="text-sm">
                  Age: <span className="font-semibold">{contestant.age}</span>
                </p>
              </div>
              <blockquote className="italic">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
