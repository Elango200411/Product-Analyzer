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
        <linearGradient id="pa-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="52%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <radialGradient id="pa-sheen" cx="0.28" cy="0.18" r="0.9">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pa-mark" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <filter id="pa-shadow" x="-8" y="-6" width="80" height="80">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#1E1B4B" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* App tile */}
      <rect x="3" y="3" width="58" height="58" rx="15" fill="url(#pa-bg)" filter="url(#pa-shadow)" />
      {/* Soft sheen */}
      <rect x="3" y="3" width="58" height="58" rx="15" fill="url(#pa-sheen)" />
      {/* Inner depth ring */}
      <rect
        x="5.75" y="5.75" width="52.5" height="52.5" rx="12.5"
        stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.5" fill="none"
      />

      {/* Magnifier lens */}
      <circle cx="26" cy="26" r="9.75" stroke="url(#pa-mark)" strokeWidth="3.1" fill="none" />
      {/* Lens glass tint */}
      <circle cx="26" cy="26" r="9.75" fill="#FFFFFF" fillOpacity="0.08" />
      {/* Handle */}
      <line
        x1="33.4" y1="33.4" x2="40.6" y2="40.6"
        stroke="url(#pa-mark)" strokeWidth="3.6" strokeLinecap="round"
      />
      {/* Verified check inside lens */}
      <path
        d="M21.9 26.4l2.8 2.8 5.3-6"
        stroke="url(#pa-mark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* Growth bars */}
      <rect x="42.5" y="40" width="4" height="6.5" rx="1.3" fill="url(#pa-mark)" opacity="0.95" />
      <rect x="47.75" y="36" width="4" height="10.5" rx="1.3" fill="url(#pa-mark)" opacity="0.72" />
      <rect x="53" y="31.5" width="4" height="15" rx="1.3" fill="url(#pa-mark)" opacity="0.5" />
    </svg>
  )
}

export default Logo
