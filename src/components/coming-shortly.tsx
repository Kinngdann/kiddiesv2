import { Clock3, Sparkles } from "lucide-react";

type ComingShortlyProps = {
  label: string;
  title: string;
  description: string;
};

export function ComingShortly({
  label,
  title,
  description,
}: ComingShortlyProps) {
  return (
    <section className="my-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0px_#111]">
      <div className="grid gap-5 bg-[linear-gradient(135deg,#FACC14_0%,#FACC14_38%,#FFFFFF_38%,#FFFFFF_100%)] p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <div className="grid size-16 place-items-center rounded-2xl border-2 border-black bg-black text-[#FACC14] shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
          <Clock3 className="size-8" />
        </div>

        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-black">
            <Sparkles className="size-3.5 fill-[#FACC14]" />
            {label}
          </div>
          <h3 className="font-display text-2xl font-black leading-tight text-black sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
