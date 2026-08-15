"use client";

export default function BusEnvironment() {
  const background = "/experiences/bus-driver/background.png";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black/50">
      <div className="bus-environment-track">
        {/* Panel 1: Normal */}
        <div
          className="bus-environment-panel"
          style={{
            backgroundImage: `url("${background}")`,
          }}
        />

        {/* Panel 2: Mirrored to perfectly flow from Panel 1 */}
        <div
          className="bus-environment-panel"
          style={{
            backgroundImage: `url("${background}")`,
          }}
        />

        {/* Panel 3: Normal (Loop seamlessly resets to Panel 1 when this is reached) */}
        <div
          className="bus-environment-panel"
          style={{
            backgroundImage: `url("${background}")`,
          }}
        />

        {/* Panel 4: Mirrored to perfectly flow from Panel 3 */}
        <div
          className="bus-environment-panel"
          style={{
            backgroundImage: `url("${background}")`,
          }}
        />
      </div>
    </div>
  );
}
