import Link from "next/link";

export default function ExperienceCard({ experience }) {
  return (
    <Link href={`/${experience.slug}`} className="block">
      <div className="group relative min-h-44 overflow-hidden rounded-2xl border border-white/15 bg-white/8 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/13">
        {/* Ambient glow */}
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:bg-white/20" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
              Listen as
            </p>

            <h2 className="text-3xl font-medium tracking-tight text-white">
              {experience.name}
            </h2>
          </div>

          {/* Bottom interaction */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-white/40 transition-colors duration-300 group-hover:text-white/70">
              Enter playlist
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/60 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
