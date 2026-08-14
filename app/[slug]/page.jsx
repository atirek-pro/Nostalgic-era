import Link from "next/link";
import { notFound } from "next/navigation";
import experiences from "@/data/experiences";
import Playlist from "@/components/Playlist";

export default async function ExperiencePage({ params }) {
  const { slug } = await params;

  const experience = experiences.find((item) => item.slug === slug);

  if (!experience) {
    notFound();
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url('${experience.background}')`,
      }}
    >
      <div className="min-h-screen bg-black/50 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            ← Nostalgic Era
          </Link>

          <div className="flex min-h-[calc(100vh-100px)] items-center justify-center py-16">
            <div className="w-full max-w-4xl">
              <div className="mb-10 text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/50">
                  Nostalgic Era
                </p>

                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  {experience.name}
                </h1>

                <p className="mt-4 text-white/60">
                  Old songs. Long days. Good company.
                </p>
              </div>

              <Playlist songs={experience.songs} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
