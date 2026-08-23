const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ResearchIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
      <path d="M8.2 11.2l1.9 1.9 3.7-4.2" />
    </svg>
  )
}

export function ExtractionIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.28 5.28l2.12 2.12M16.6 16.6l2.12 2.12M18.72 5.28l-2.12 2.12M7.4 16.6l-2.12 2.12" />
    </svg>
  )
}

export function EnrichmentIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8L12 3.5z" />
      <path d="M19 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" strokeWidth="1.4" />
    </svg>
  )
}

export function ValidationIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 21.5s7.5-3.4 7.5-9.4V5.2L12 2.5 4.5 5.2v6.9c0 6 7.5 9.4 7.5 9.4z" />
      <path d="M8.8 11.8l2.3 2.3 4.1-4.6" />
    </svg>
  )
}

export function QualityIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <line x1="4" y1="4" x2="4" y2="20" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="8" y="13" width="3" height="7" rx="1" fill="currentColor" stroke="none" />
      <rect x="13" y="9" width="3" height="11" rx="1" fill="currentColor" stroke="none" opacity="0.75" />
      <rect x="18" y="5.5" width="3" height="14.5" rx="1" fill="currentColor" stroke="none" opacity="0.55" />
    </svg>
  )
}

const PIPELINE_ICONS = [ResearchIcon, ExtractionIcon, EnrichmentIcon, ValidationIcon, QualityIcon]

export function PipelineIcon({ index, size = 20 }) {
  const Icon = PIPELINE_ICONS[index % PIPELINE_ICONS.length]
  return <Icon size={size} />
}
