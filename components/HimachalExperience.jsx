"use client";

import { useState } from "react";

import Playlist from "@/components/Playlist";
import HimachalBusEnvironment from "@/components/HimachalBusEnvironment";

export default function HimachalExperience({
  songs = [],
  youtubePlaylistId,
  spotifyPlaylistUrl,
}) {
  const [journeyStarted, setJourneyStarted] = useState(false);

  const handlePlaybackStart = () => {
    console.log("🔥 Himachal playback start received");

    if (journeyStarted) {
      console.log("Journey already started");
      return;
    }

    console.log("🚍 Starting Himachal journey");

    setJourneyStarted(true);
  };

  return (
    <>
      {/* Himachal visual environment */}
      <HimachalBusEnvironment journeyStarted={journeyStarted} />

      {/* Music player */}
      <div className="absolute bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:bottom-8 sm:w-[calc(100%-3rem)]">
        <Playlist
          songs={songs}
          youtubePlaylistId={youtubePlaylistId}
          spotifyPlaylistUrl={spotifyPlaylistUrl}
          onPlaybackStart={handlePlaybackStart}
        />
      </div>
    </>
  );
}
