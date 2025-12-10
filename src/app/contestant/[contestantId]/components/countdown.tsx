"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  target: string; // "2025-12-31"
  header: string;
}

export default function Countdown({ target, header }: Props) {
  const targetDate = useMemo(() => new Date(`${target}T00:00:00`), [target]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime(); // allowed here
      const diff = targetDate.getTime() - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    update(); // sync immediately
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="md:mb-12">
      <h1 className="text-center font-semibold mb-4 text-xl">{header}</h1>
      <div className="flex gap-4 justify-center">
        <TimeBox label="Days" value={days} />
        <TimeBox label="Hours" value={pad(hours)} />
        <TimeBox label="Minutes" value={pad(minutes)} />
        <TimeBox label="Seconds" value={pad(seconds)} />
      </div>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center basis-1/12">
      <div className="bg-white border border-input rounded-md px-4 py-2 font-semibold text-xl">
        {value}
      </div>
      <div className="text-xs mt-1 text-gray-600">{label}</div>
    </div>
  );
}
