import Link from "next/link";
import { notFound } from "next/navigation";

import experiences from "@/data/experiences";
import Playlist from "@/components/Playlist";
import BusAnimation from "@/components/BusAnimation";
import BusEnvironment from "@/components/BusEnvironment";

export default async function ExperiencePage({ params }) {
  const { slug } = await params;

  const experience = experiences.find((item) => item.slug === slug);

  if (!experience) {
    notFound();
  }

  const isBusDriver = experience.slug === "bus-driver";

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={
        !isBusDriver
          ? {
              backgroundImage: `url('${experience.background}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Moving Bus Driver environment */}
      {isBusDriver && <BusEnvironment />}

      {/* Page overlay */}
      <div className="relative z-10 min-h-screen overflow-hidden bg-black/20 px-6 py-8">
        {/* Back button - Liquid Glass UI */}
        <Link
          href="/"
          className="group absolute left-6 top-6 z-30 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white/[0.10] px-5 py-2.5 text-sm font-medium text-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/[0.15] hover:text-white active:scale-95"
        >
          {/* Liquid glass highlight */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-transparent" />

          {/* Inner glass border */}
          <span className="pointer-events-none absolute inset-[1px] rounded-full border border-white/[0.08]" />

          {/* Content */}
          <span className="relative z-10 flex items-center gap-2">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Nostalgic Era</span>
          </span>
        </Link>

        {/* Experience title */}
        <header className="relative z-20 pt-16 text-center sm:pt-20">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-white/50">
            Nostalgic Era
          </p>

          <h1 className="text-4xl font-semibold tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl">
            {experience.name}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-medium italic text-white/70 drop-shadow-md sm:text-base">
            "{experience.subtitle}"
          </p>
        </header>

        {/* Conditionally positioned music player */}
        <div
          className={`absolute left-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:w-[calc(100%-3rem)] ${
            isBusDriver
              ? "top-1/2 -translate-y-1/2" // Centers vertically above the bus
              : "bottom-6 sm:bottom-8" // Keeps standard bottom position for static pages
          }`}
        >
          <Playlist
            songs={experience.songs}
            youtubePlaylistId={experience.youtubePlaylistId}
            spotifyPlaylistUrl={experience.spotifyPlaylistUrl}
          />
        </div>

        {/* Animated bus */}
        {isBusDriver && <BusAnimation />}
      </div>
    </main>
  );
}
