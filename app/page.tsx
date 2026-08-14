import experiences from "@/data/experiences";
import ExperienceCard from "@/components/ExperienceCard";
import Typewriter from "@/components/Typewriter";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/bg-image.png')",
      }}
    >
      <div className="min-h-screen bg-black/70 px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="mb-16 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-white/50">
              Nostalgic Era
            </p>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              <Typewriter />
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
              Pick a world. Press play. Stay for a while.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.slug}
                experience={experience}
              />
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}