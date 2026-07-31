import React from "react";

export default function BrandMark({ size = 26, color = "#B3122B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3C16 3 6 14.5 6 21C6 26.5228 10.4772 31 16 31C21.5228 31 26 26.5228 26 21C26 14.5 16 3 16 3Z"
        fill={color}
      />
      <path
        d="M9 21H12.5L14.5 16L17.5 26L19.5 21H23"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
