function Logo({ size = 38 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ProductAnalyzer logo"
    >
      <defs>
        <linearGradient id="paTile" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="paGlass" x1="20" y1="18" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <radialGradient id="paSheen" cx="0.3" cy="0.16" r="0.95">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tile */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#paTile)" />
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#paSheen)" />
      <rect
        x="6.5" y="6.5" width="51" height="51" rx="13.5"
        stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" fill="none"
      />

      {/* Magnifier */}
      <circle cx="27" cy="26" r="10" stroke="url(#paGlass)" strokeWidth="3" fill="none" />
      <line
        x1="35" y1="34" x2="42.5" y2="41.5"
        stroke="url(#paGlass)" strokeWidth="3.4" strokeLinecap="round"
      />

      {/* Analytics trend inside lens */}
      <path
        d="M21.8 30l3.4-4 2.9 2.6 4.9-6"
        stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx="33" cy="22.6" r="1.5" fill="#FFFFFF" />
    </svg>
  )
}

export default Logo
