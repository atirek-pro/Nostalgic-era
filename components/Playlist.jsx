"use client";

import MusicPlayer from "@/components/MusicPlayer";
import SpotifyPlayer from "@/components/SpotifyPlayer";

export default function Playlist({
  songs = [],
  youtubePlaylistId,
  spotifyPlaylistUrl,
  onPlaybackStart,
}) {
  /*
   * Provider priority:
   *
   * YouTube
   *    ↓
   * Spotify
   *    ↓
   * Individual songs
   *    ↓
   * Nothing
   */

  if (youtubePlaylistId) {
    return (
      <MusicPlayer
        playlistId={youtubePlaylistId}
        onPlaybackStart={onPlaybackStart}
      />
    );
  }

  if (spotifyPlaylistUrl) {
    return (
      <SpotifyPlayer
        playlistUrl={spotifyPlaylistUrl}
        onPlaybackStart={onPlaybackStart}
      />
    );
  }

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
          onPlaybackStart={onPlaybackStart}
        />
      ))}
    </div>
  );
}
