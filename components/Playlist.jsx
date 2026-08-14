"use client";

import { useCallback, useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function Playlist({ songs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const nextSong = useCallback(() => {
    setShouldAutoPlay(true);

    setCurrentIndex((index) => (index + 1) % songs.length);
  }, [songs.length]);

  const previousSong = useCallback(() => {
    setShouldAutoPlay(true);

    setCurrentIndex((index) => (index - 1 + songs.length) % songs.length);
  }, [songs.length]);

  if (songs.length === 0) {
    return <p className="text-white/50">No songs available yet.</p>;
  }

  const currentSong = songs[currentIndex];

  return (
    <div className="space-y-8">
      <MusicPlayer
        key={currentSong.youtubeId}
        youtubeId={currentSong.youtubeId}
        title={currentSong.title}
        artist={currentSong.artist}
        onEnded={nextSong}
        onNext={nextSong}
        onPrevious={previousSong}
        autoPlay={shouldAutoPlay}
      />
    </div>
  );
}
