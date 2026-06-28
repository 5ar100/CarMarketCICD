import React from 'react';

const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 52,
};

export default function Logo({ size = 'md', light = false }) {
  const h = SIZE_MAP[size] || 36;
  const textColor = light ? '#ffffff' : '#0f172a';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: h * 0.3, userSelect: 'none' }}>
      {/* Red rounded hexagon badge with white car silhouette */}
      <svg
        width={h}
        height={h}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Red rounded rect badge */}
        <rect x="2" y="2" width="44" height="44" rx="10" fill="#e63946" />

        {/* Car body - side profile silhouette */}
        {/* Main car body shape */}
        <path
          d="M7 30 L7 26 L12 26 L16 19 L32 19 L37 24 L41 24 L41 30 Z"
          fill="#ffffff"
        />
        {/* Roof / cabin */}
        <path
          d="M16 26 L17 20 L31 20 L36 26 Z"
          fill="#e63946"
        />
        {/* Windows separation line */}
        <line x1="24" y1="20" x2="24" y2="26" stroke="#e63946" strokeWidth="1" />

        {/* Front wheel */}
        <circle cx="13" cy="30" r="4" fill="#ffffff" />
        <circle cx="13" cy="30" r="2" fill="#e63946" />

        {/* Rear wheel */}
        <circle cx="35" cy="30" r="4" fill="#ffffff" />
        <circle cx="35" cy="30" r="2" fill="#e63946" />

        {/* Ground line */}
        <line x1="5" y1="34" x2="43" y2="34" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Headlight */}
        <rect x="38" y="25" width="3" height="2" rx="1" fill="#f59e0b" />
      </svg>

      {/* Text lockup: "Car" light + "Market" bold */}
      <span style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
        <span
          style={{
            color: textColor,
            fontSize: h * 0.56,
            fontWeight: 300,
            letterSpacing: '-0.01em',
          }}
        >
          Car
        </span>
        <span
          style={{
            color: textColor,
            fontSize: h * 0.56,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Market
        </span>
      </span>
    </div>
  );
}
