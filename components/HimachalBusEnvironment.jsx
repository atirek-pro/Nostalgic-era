"use client";

import { useEffect, useRef } from "react";

export default function HimachalBusEnvironment({ journeyStarted = false }) {
  const videoRef = useRef(null);

  const background = "/experiences/himachal-bus/background.png";

  const drivingVideo = "/experiences/himachal-bus/driving-loop.mp4";

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !journeyStarted) return;

    const startVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Himachal driving video could not start:", error);
      }
    };

    startVideo();
  }, [journeyStarted]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Static bus stand */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[1200ms] ease-in-out ${
          journeyStarted ? "scale-[1.04] opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          backgroundImage: `url("${background}")`,
        }}
      />

      {/* Himachal driving video */}
      <video
        ref={videoRef}
        src={drivingVideo}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1200ms ease-in-out ${
          journeyStarted ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
