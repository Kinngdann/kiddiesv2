"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition">
      <ArrowUp size={16} />
      Back to top
    </button>
  );
}
