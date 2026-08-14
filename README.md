# Nostalgic Era

**Nostalgic Era** is a Next.js web app that lets a visitor "listen as" a specific everyday character (an auto-rickshaw driver, a bus driver, a neighborhood saloon, a house painter, a local mistri/handyman, etc.) and hear a curated playlist tied to that persona's world, over a full-bleed background image representing that setting.

The core idea: instead of browsing songs by genre or mood, the user picks an identity/scene ("Who / Where are we listening as?") and the app plays music as an ambient, ritual-like experience for that character — think a nostalgic, cinematic radio station per persona.

## What it does

- **Landing page (`/`)** — Displays an animated typewriter headline and a grid of "experience" cards, one per persona (e.g. Raju Mistri, Auto Wala, Bus Driver, Deluxe Saloon, Aslam Painter). Each card is a glassmorphic tile with a hover interaction.
- **Experience page (`/[slug]`)** — A dynamic route per persona. Renders a full-screen background image specific to that character/scene and loads that persona's playlist.
- **Playback** — Songs are streamed via the YouTube IFrame API (audio-only usage — the video element is rendered off-screen at 1x1px) and controlled through a custom floating "pill" music player fixed to the bottom of the screen, with play/pause, next/previous, a seekable progress bar, elapsed/remaining time, and a spinning album-art thumbnail while playing.
- **Playlist behavior** — Songs auto-advance on end, and manually skipping forward/backward auto-plays the next track.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`), custom glassmorphism/backdrop-blur UI, custom keyframe animation for the typewriter cursor
- **Playback**: YouTube IFrame Player API, loaded dynamically at runtime
- **Language**: TypeScript for app shell/layout, JavaScript (JSX) for the persona/experience and player components
- **Linting**: ESLint with `eslint-config-next` (core-web-vitals + TypeScript rule sets)

## Project structure

```
app/
  layout.tsx          Root layout — loads Geist fonts, sets base HTML/body structure
  page.tsx             Home page — renders the typewriter hero + experience card grid
  globals.css          Tailwind entrypoint, CSS variables, typewriter and slider styling
  [slug]/
    page.jsx            Dynamic persona page — resolves an experience by slug, 404s if unknown,
                         renders its background and <Playlist />

components/
  ExperienceCard.jsx    Persona tile shown on the home grid, links to /[slug]
  Playlist.jsx           Owns current track index/autoplay state, wires next/previous/onEnded
  MusicPlayer.jsx        Wraps the YouTube IFrame API: player lifecycle, play/pause, seeking,
                          progress polling, and the floating player UI
  Typewriter.jsx          Animates the two-line hero headline character-by-character

data/
  experiences.js         Static source of truth: each persona's slug, display name, background
                          image path, and its list of songs (title, artist, YouTube video ID)
```

## Data model

Each persona in `data/experiences.js` follows this shape:

```js
{
  slug: string,        // used for routing, e.g. "auto-wala"
  name: string,        // display name, e.g. "Auto Wala"
  background: string,  // path to a background image under /public
  songs: [
    { title: string, artist: string, youtubeId: string }
  ]
}
```

New personas or songs are added purely by extending this array — no other code changes are required for the UI to pick them up.

## Notable implementation details

- The YouTube player is initialized once per mounted `MusicPlayer` and torn down on unmount/track change (keyed by `youtubeId` in `Playlist`), so switching songs fully resets player state.
- Player progress (`currentTime`/`duration`) is polled on a 500ms interval only while a track is playing, and cleared on pause/unmount to avoid stray intervals.
- The `AGENTS.md` / `CLAUDE.md` files at the repo root are auto-generated agent instructions from a customized Next.js build, noting that this project's Next.js APIs/conventions may diverge from stock Next.js and pointing agents to the framework's bundled docs before making changes.
