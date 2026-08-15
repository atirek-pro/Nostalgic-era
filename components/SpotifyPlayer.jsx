"use client";

import { useEffect, useRef, useState } from "react";

export default function SpotifyPlayer({
  playlistUrl,
  title = "Spotify Playlist",
  artist = "Spotify",
}) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  const intervalRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!playlistUrl || !containerRef.current) return;

    let mounted = true;

    const loadSpotifyPlayer = () => {
      if (!mounted || !containerRef.current) return;

      // Prevent creating multiple controllers.
      if (controllerRef.current) {
        return;
      }

      window.SpotifyIframeAPI.createController(
        containerRef.current,
        {
          url: playlistUrl,
          width: 1,
          height: 1,
        },
        (controller) => {
          if (!mounted) return;

          controllerRef.current = controller;

          controller.addListener("ready", () => {
            if (!mounted) return;

            setIsReady(true);
          });

          controller.addListener("playback_started", (event) => {
            if (!mounted) return;

            setIsPlaying(true);

            console.log("Spotify playing:", event.data.playingURI);
          });

          controller.addListener("playback_update", (event) => {
            if (!mounted) return;

            const data = event.data;

            setIsPlaying(!data.isPaused);

            setCurrentTime((data.position || 0) / 1000);

            setDuration((data.duration || 0) / 1000);
          });
        },
      );
    };

    const existingScript = document.querySelector(
      'script[src="https://open.spotify.com/embed/iframe-api/v1"]',
    );

    if (window.SpotifyIframeAPI) {
      loadSpotifyPlayer();
    } else {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.SpotifyIframeAPI = IFrameAPI;

        loadSpotifyPlayer();
      };

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = "https://open.spotify.com/embed/iframe-api/v1";

        script.async = true;

        document.body.appendChild(script);
      }
    }

    return () => {
      mounted = false;

      clearInterval(intervalRef.current);

      if (controllerRef.current) {
        try {
          controllerRef.current.destroy();
        } catch (error) {
          console.error("Failed to destroy Spotify controller:", error);
        }
      }

      controllerRef.current = null;
    };
  }, [playlistUrl]);

  const togglePlay = () => {
    if (!isReady || !controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
    } else {
      controllerRef.current.play();
    }
  };

  const handleSeek = (event) => {
    if (!isReady || !controllerRef.current) return;

    const newTime = Number(event.target.value);

    controllerRef.current.seek(Math.floor(newTime));

    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full px-4 py-3 sm:px-5 sm:py-4">
      {/* Spotify API container */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3 sm:gap-4">
        {/* Spotify indicator */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl sm:h-12 sm:w-12">
          <span className="text-lg">♫</span>
        </div>

        {/* Song information + progress */}
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <h2 className="truncate text-sm font-semibold text-white sm:text-base">
              {title}
            </h2>

            <p className="truncate text-xs text-white/50">{artist}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden w-8 text-[10px] text-white/50 sm:block">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!isReady || !duration}
              className="player-progress h-1 flex-1 cursor-pointer appearance-none rounded-full disabled:cursor-default"
              style={{
                background: `linear-gradient(
                  to right,
                  rgba(255,255,255,0.95) ${progressPercentage}%,
                  rgba(255,255,255,0.18) ${progressPercentage}%
                )`,
              }}
            />

            <span className="hidden w-8 text-right text-[10px] text-white/50 sm:block">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={togglePlay}
          disabled={!isReady}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-xl transition hover:bg-white/25 hover:scale-105 active:scale-95 disabled:opacity-40 sm:h-12 sm:w-12"
        >
          {isPlaying ? (
            <span className="text-base">Ⅱ</span>
          ) : (
            <span className="ml-0.5 text-base">▶</span>
          )}
        </button>
      </div>
    </div>
  );
}
