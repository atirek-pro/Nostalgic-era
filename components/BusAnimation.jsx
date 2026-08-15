"use client";

export default function BusAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Moving bus */}
      <div className="bus-driving absolute bottom-[5%] left-0">
        <div className="bus-bounce relative">
          {/* Bus body */}
          <img
            src="/experiences/bus-driver/bus.svg"
            alt=""
            className="block h-auto w-105"
          />

          {/* Rear tire */}
          <img
            src="/experiences/bus-driver/tire.svg"
            alt=""
            className="bus-tire bus-tire-rear"
          />

          {/* Front tire */}
          <img
            src="/experiences/bus-driver/tire.svg"
            alt=""
            className="bus-tire bus-tire-front"
          />
        </div>
      </div>
    </div>
  );
}
