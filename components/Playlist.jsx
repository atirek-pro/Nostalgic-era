"use client";

import MusicPlayer from "@/components/MusicPlayer";
import SpotifyPlayer from "@/components/SpotifyPlayer";

export default function Playlist({
  songs = [],
  youtubePlaylistId,
  spotifyPlaylistUrl,
}) {
  /*
   * Provider priority:
   *
   * 1. YouTube playlist
   * 2. Spotify playlist
   * 3. Individual YouTube songs
   * 4. Nothing
   */

  // YouTube has priority if available
  if (youtubePlaylistId) {
    return <MusicPlayer playlistId={youtubePlaylistId} />;
  }

  // Spotify fallback
  if (spotifyPlaylistUrl) {
    return <SpotifyPlayer playlistUrl={spotifyPlaylistUrl} />;
  }

  // Existing individual-song fallback
  if (songs.length === 0) {
    return <p className="text-center text-white/50">No songs available yet.</p>;
  }

  return (
    <div className="space-y-3">
      {songs.map((song, index) => (
        <MusicPlayer
          key={song.youtubeId || index}
          youtubeId={song.youtubeId}
          title={song.title}
          artist={song.artist}
        />
      ))}
    </div>
  );
}
