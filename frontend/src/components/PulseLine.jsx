import React from "react";

/**
 * A continuous EKG/pulse line that draws itself on load and loops gently.
 * This is the page's signature element: a heartbeat, literally, standing in
 * for both the urgency of the network and the "vital sign" of live donor activity.
 */
export default function PulseLine({ color = "#B3122B", height = 64 }) {
  const path =
    "M0,32 L120,32 L140,32 L152,10 L164,54 L176,18 L188,32 L1400,32";

  return (
    <svg
      className="pulse-strip"
      viewBox="0 0 1400 64"
      preserveAspectRatio="none"
      style={{ height }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "draw-pulse 2.4s ease-out forwards",
        }}
      />
      <style>{`
        @keyframes draw-pulse {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          path { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </svg>
  );
}
