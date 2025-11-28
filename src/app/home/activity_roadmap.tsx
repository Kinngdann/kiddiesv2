import Image from 'next/image';
import {activities} from './activities_data';

export default function ActivityRoadmap() {
  const randomColor = () => {
    const colors = [
      'hover:border-pink-500',
      'hover:border-yellow-500',
      'hover:border-teal-500',
      'hover:border-red-500',
    ];
    // eslint-disable-next-line react-hooks/purity
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <section className="space-y-8 mb-24">
      <div className="text-center font-black">
        <p className="lg:text-xl">Kiddies Crown Contest</p>
        <h2>Activities RoadMap</h2>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        {activities.map((activity) => (
          <div
            key={activity.name}
            className={`group rounded-md text-center space-y-4 shadow-lg px-4 py-8 bg-white border transition duration-300 ease-in-out ${randomColor()}`}>
            <Image
              src={activity.image}
              alt=""
              className="mx-auto group-hover:scale-110 transition duration-300 ease-in-out"
            />
            <p className="group-hover:text-pink-400 text-xl font-bold transition duration-300 ease-in-out">
              {activity.name}
            </p>
            <p className="font-semibold text-gray-600">{activity.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
