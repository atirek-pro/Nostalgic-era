"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({
  youtubeId,
  playlistId,
  title,
  artist,
  onEnded,
  onNext,
  onPrevious,
  onPlaybackStart,
  autoPlay = false,
}) {
  const playerRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  const intervalRef = useRef(null);
  const onPlaybackStartRef = useRef(onPlaybackStart);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [currentTitle, setCurrentTitle] = useState(title || "");
  const [currentArtist, setCurrentArtist] = useState(artist || "");
  const [currentVideoId, setCurrentVideoId] = useState(youtubeId || "");

  const isPlaylist = Boolean(playlistId);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    onPlaybackStartRef.current = onPlaybackStart;
  }, [onPlaybackStart]);

  useEffect(() => {
    if (!youtubeId && !playlistId) return;

    let isMounted = true;

    const updateVideoInformation = () => {
      if (!playerRef.current || !isMounted) return;

      if (typeof playerRef.current.getVideoData !== "function") {
        return;
      }

      const videoData = playerRef.current.getVideoData();

      if (!videoData) return;

      setCurrentVideoId(videoData.video_id || "");
      setCurrentTitle(videoData.title || "");
      setCurrentArtist(videoData.author || "");
      setDuration(playerRef.current.getDuration() || 0);
    };

    const startProgressTracking = () => {
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!playerRef.current || !isMounted) return;

        if (
          typeof playerRef.current.getCurrentTime !== "function" ||
          typeof playerRef.current.getDuration !== "function"
        ) {
          return;
        }

        setCurrentTime(playerRef.current.getCurrentTime());

        setDuration(playerRef.current.getDuration());

        /*
         * When using a YouTube playlist, the current
         * video can change without recreating the player.
         *
         * Refresh its metadata periodically.
         */
        if (isPlaylist) {
          updateVideoInformation();
        }
      }, 500);
    };

    const loadPlayer = () => {
      if (!isMounted || playerRef.current) return;

      const playerConfig = {
        height: "1",
        width: "1",

        playerVars: {
          controls: 0,
          playsinline: 1,
          rel: 0,
        },

        events: {
          onReady: (event) => {
            if (!isMounted) return;

            setIsPlayerReady(true);

            if (isPlaylist) {
              updateVideoInformation();
            } else {
              setDuration(event.target.getDuration());
            }

            if (autoPlay) {
              event.target.playVideo();
            }
          },

          onStateChange: (event) => {
            if (!isMounted) return;

            /*
             * Playing
             */
            if (event.data === window.YT.PlayerState.PLAYING) {
              console.log("▶️ YouTube PLAYING event fired");

              setIsPlaying(true);
              startProgressTracking();

              if (onPlaybackStartRef.current) {
                console.log("🔥 Calling onPlaybackStart");
                onPlaybackStartRef.current();
              } else {
                console.log("❌ onPlaybackStart is missing");
              }
            }

            /*
             * Paused
             */
            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);

              clearInterval(intervalRef.current);
            }

            /*
             * Ended
             *
             * Only manually configured songs use
             * our React playlist navigation.
             *
             * YouTube handles playlist transitions itself.
             */
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);

              clearInterval(intervalRef.current);

              setCurrentTime(0);

              if (!isPlaylist && onEndedRef.current) {
                onEndedRef.current();
              }
            }
          },
        },
      };

      /*
       * Single YouTube video
       */
      if (!isPlaylist) {
        playerConfig.videoId = youtubeId;
      }

      /*
       * YouTube playlist
       */
      if (isPlaylist) {
        playerConfig.playerVars.listType = "playlist";
        playerConfig.playerVars.list = playlistId;
      }

      playerRef.current = new window.YT.Player("youtube-player", playerConfig);
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      window.onYouTubeIframeAPIReady = loadPlayer;

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = "https://www.youtube.com/iframe_api";

        script.async = true;

        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;

      clearInterval(intervalRef.current);

      setIsPlayerReady(false);
      setIsPlaying(false);

      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        playerRef.current.destroy();
      }

      playerRef.current = null;
    };
  }, [youtubeId, playlistId, autoPlay, isPlaylist]);

  const togglePlay = () => {
    if (!isPlayerReady || !playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleNext = () => {
    if (!isPlayerReady || !playerRef.current) {
      return;
    }

    if (isPlaylist) {
      playerRef.current.nextVideo();
      return;
    }

    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (!isPlayerReady || !playerRef.current) {
      return;
    }

    if (isPlaylist) {
      playerRef.current.previousVideo();
      return;
    }

    if (onPrevious) {
      onPrevious();
    }
  };

  const handleSeek = (event) => {
    if (!isPlayerReady || !playerRef.current || !duration) {
      return;
    }

    const newTime = Number(event.target.value);

    playerRef.current.seekTo(newTime, true);

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

  const thumbnail = currentVideoId
    ? `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`
    : "";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-full border border-white/20 bg-white/[0.10] px-4 py-3 shadow-[0_15px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-5 sm:py-3.5">
        {/* Liquid glass highlight */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-transparent" />

        {/* Inner glass border */}
        <div className="pointer-events-none absolute inset-[1px] rounded-full border border-white/[0.08]" />

        <div className="relative flex items-center gap-3 sm:gap-4">
          {/* Album artwork */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/25 shadow-lg sm:h-14 sm:w-14">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={currentTitle}
                className={`h-full w-full object-cover ${
                  isPlaying ? "animate-[spin_18s_linear_infinite]" : ""
                }`}
              />
            )}
          </div>

          {/* Song information */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-white sm:text-base">
              {currentTitle || "Loading playlist..."}
            </h2>

            <p className="mt-0.5 truncate text-[11px] text-white/50 sm:text-xs">
              {currentArtist}
            </p>

            {/* Progress */}
            <div className="mt-2 flex items-center gap-2">
              <span className="hidden text-[9px] text-white/45 sm:block">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!isPlayerReady}
                className="player-progress h-1 flex-1 cursor-pointer appearance-none rounded-full"
                style={{
                  background: `linear-gradient(
                    to right,
                    rgba(255,255,255,0.9) ${progressPercentage}%,
                    rgba(255,255,255,0.18) ${progressPercentage}%
                  )`,
                }}
              />

              <span className="hidden text-[9px] text-white/45 sm:block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={!isPlayerReady}
              aria-label="Previous song"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              <span className="text-xs">|◀</span>
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!isPlayerReady}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/[0.85] text-black shadow-[0_8px_25px_rgba(0,0,0,0.25)] backdrop-blur-md transition hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-50 sm:h-11 sm:w-11"
            >
              {isPlaying ? (
                <span className="text-base">Ⅱ</span>
              ) : (
                <span className="ml-0.5 text-base">▶</span>
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={!isPlayerReady}
              aria-label="Next song"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              <span className="text-xs">▶|</span>
            </button>
          </div>
        </div>

        {/* Hidden YouTube player */}
        <div className="absolute h-px w-px overflow-hidden opacity-0">
          <div id="youtube-player" />
        </div>
      </div>
    </div>
  );
}
