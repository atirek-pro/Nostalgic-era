import Link from "next/link";
import { notFound } from "next/navigation";

import experiences from "@/data/experiences";
import Playlist from "@/components/Playlist";
import BusAnimation from "@/components/BusAnimation";
import BusEnvironment from "@/components/BusEnvironment";
import HimachalBusEnvironment from "@/components/HimachalBusEnvironment";
import HimachalExperience from "@/components/HimachalExperience";

export default async function ExperiencePage({ params }) {
  const { slug } = await params;

  const experience = experiences.find((item) => item.slug === slug);

  if (!experience) {
    notFound();
  }

  const isBusDriver = experience.slug === "bus-driver";
  const isHimachalBus = experience.slug === "himachal-bus";

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
          <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/16 via-white/4 to-transparent" />

          {/* Inner glass border */}
          <span className="pointer-events-none absolute inset-px rounded-full border border-white8" />

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
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#252525] drop-shadow-[0_1px_3px_rgba(245,238,220,0.45)]">
            Nostalgic Era
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#252525] drop-shadow-[0_2px_5px_rgba(245,238,220,0.55)] sm:text-5xl md:text-6xl">
            {experience.name}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-medium italic text-[#252525] drop-shadow-[0_1px_4px_rgba(245,238,220,0.5)] sm:text-base">
            "{experience.subtitle}"
          </p>
        </header>

        {/* Conditionally positioned music player */}
        {/* Himachal experience */}
        {isHimachalBus ? (
          <HimachalExperience
            songs={experience.songs}
            youtubePlaylistId={experience.youtubePlaylistId}
            spotifyPlaylistUrl={experience.spotifyPlaylistUrl}
          />
        ) : (
          /* Existing experiences */
          <div
            className={`absolute left-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:w-[calc(100%-3rem)] ${
              isBusDriver ? "top-1/2 -translate-y-1/2" : "bottom-6 sm:bottom-8"
            }`}
          >
            <Playlist
              songs={experience.songs}
              youtubePlaylistId={experience.youtubePlaylistId}
              spotifyPlaylistUrl={experience.spotifyPlaylistUrl}
            />
          </div>
        )}

        {/* Animated bus */}
        {isBusDriver && <BusAnimation />}
      </div>
    </main>
  );
}
