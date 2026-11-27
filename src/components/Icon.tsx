const PATHS = {
  more: <><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  swap: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  book: <path d="M12 6.6C10.2 5.3 7.7 4.6 4 4.6v13.2c3.7 0 6.2.7 8 2 1.8-1.3 4.3-2 8-2V4.6c-3.7 0-6.2.7-8 2zM12 6.6v13.2" />,
  undo: <path d="M9 7L4 12l5 5M4 12h10a6 6 0 0 1 0 12" transform="translate(0 -3)" />,
  pot: <path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6zM2 10h20M9 6v-2M15 6v-2" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M8.5 3v4M15.5 3v4" /></>,
  cards: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M12 15.6s-3.6-2.1-3.6-4.5A1.9 1.9 0 0 1 12 10a1.9 1.9 0 0 1 3.6 1.1c0 2.4-3.6 4.5-3.6 4.5z" /></>,
  cart: <><path d="M3 4h2.2l2.1 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 1.9-1.5L20.5 8H6" /><circle cx="10" cy="19.6" r="1.2" /><circle cx="17" cy="19.6" r="1.2" /></>,
  basket: <path d="M3.5 10h17l-1.6 8.4a2 2 0 0 1-2 1.6H7.1a2 2 0 0 1-2-1.6L3.5 10zM8 10l3-6M16 10l-3-6M9.5 13.5v3M14.5 13.5v3" />,
  settings: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2.2" /><circle cx="9" cy="17" r="2.2" /></>,
  alert: <path d="M12 4.2l8.6 15H3.4L12 4.2zM12 10v4.2M12 17v.1" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.2M12 7.9v.1" /></>,
  sun: <><circle cx="12" cy="12" r="3.8" /><path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5L7 7M17 17l1.5 1.5M5.5 18.5L7 17M17 7l1.5-1.5" /></>,
  save: <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />,
  steamer: <><rect x="3.5" y="9" width="17" height="11" rx="2.5" /><path d="M7 12.5h10M8 16.5h8M8 6.5c-1-1 1-2 0-3M12 6.5c-1-1 1-2 0-3M16 6.5c-1-1 1-2 0-3" /></>,
  combair: <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 8.5h17M7 6.3h.1M10 6.3h.1M7 12.5h10v5H7z" /></>,
  bora: <><rect x="3.5" y="6" width="17" height="12" rx="2.5" /><circle cx="8.5" cy="12" r="2.2" /><circle cx="15.5" cy="12" r="2.2" /><path d="M12 9.5v5" /></>,
  airfryer: <><path d="M6 4.5h12l1.5 9h-15zM4.5 13.5h15v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2zM9 8.5h6" /></>,
  kneter: <><path d="M5 11h14l-1.4 7.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 11zM12 3v4M12 7c2.2 0 2.6 2.4.8 3.2-1.6.7-1.2 2.8.6 2.8" /><path d="M8 3h8" /></>,
  pizzaofen: <><path d="M3 18.5h18M4.5 18.5a7.5 7.5 0 0 1 15 0M9 18.5a3 3 0 0 1 6 0" /><path d="M12 8.5V6.5M10.5 5.5c0-1.2 1.5-1.4 1.5-2.5.9.6 1.5 1.4 1.5 2.5" /></>,
  smoker: <><path d="M3.5 11.5h14v5a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2zM3.5 11.5a7 4 0 0 1 14 0M17.5 13.5h3M6 18.5v2M15 18.5v2" /><path d="M19 9.5V5.5M19 5.5c-1-1 1-1.6 0-2.6" /></>,
  gasgrill: <><path d="M4 9.5h16M5 9.5l1.2 6h11.6l1.2-6M5 9.5a7 5 0 0 1 14 0M8 15.5l-1.5 5M16 15.5l1.5 5M9 12h.1M12 12h.1M15 12h.1" /></>,
  dutch: <><path d="M4.5 10.5h15v5.5a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4zM3 10.5h18M7 10.5a5 3 0 0 1 10 0M12 6V4.5M2.5 13h2M19.5 13h2" /></>,
  vakuum: <><rect x="4" y="5" width="16" height="7" rx="2" /><path d="M7 12v6.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5V12M7 8.5h10M10.5 15.5h3" /></>,
  paella: <><ellipse cx="12" cy="13" rx="8.5" ry="4.5" /><path d="M3.5 13h-2M22.5 13h-2M8 12.5h.1M12 11.5h.1M15.5 13h.1M10.5 14.5h.1" /></>,
  plancha: <><rect x="3" y="9" width="18" height="7" rx="1.5" /><path d="M6 12.5h12M7 16v3M17 16v3M9 6.5c-1-1 1-1.6 0-2.6M15 6.5c-1-1 1-1.6 0-2.6" /></>,
} as const

export type IconName = keyof typeof PATHS

/** kleine Linien-Icons für Bedienelemente (statt Emoji) */
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  )
}
