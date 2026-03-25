import Image from "next/image";
import { activities } from "./activities_data";

const cardAccents = [
  "border-t-4 border-t-sky-400 hover:shadow-sky-100",
  "border-t-4 border-t-yellow-400 hover:shadow-yellow-100",
  "border-t-4 border-t-cyan-400 hover:shadow-cyan-100",
  "border-t-4 border-t-orange-400 hover:shadow-orange-100",
];

export default function ActivityRoadmap() {
  return (
    <section className="space-y-8 mb-24">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 text-sky-700 text-sm font-bold px-4 py-1.5 rounded-full">
          <span>🗺️</span>
          <span>Kiddies Crown Contest</span>
        </div>
        <h2 className="font-bold">Activities Roadmap</h2>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        {activities.map((activity, index) => (
          <div
            key={activity.name}
            className={`group rounded-xl space-y-4 shadow-md px-4 py-8 bg-white transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${cardAccents[index % cardAccents.length]}`}>
            <Image
              src={activity.image}
              alt=""
              className="mx-auto group-hover:scale-110 transition duration-300 ease-in-out"
            />
            <p className="group-hover:text-sky-500 text-center font-bold transition duration-300 ease-in-out">
              {activity.name}
            </p>
            <p className="text-center text-gray-600">{activity.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
