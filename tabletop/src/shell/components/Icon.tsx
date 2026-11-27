/** Interface icons, drawn for this app on a 24-unit grid. */
import type { ReactNode } from 'react';

export type IconName =
  | 'today'
  | 'games'
  | 'progress'
  | 'tools'
  | 'settings'
  | 'back'
  | 'chevron'
  | 'menu'
  | 'rail'
  | 'learn'
  | 'practice'
  | 'play'
  | 'review'
  | 'reference'
  | 'star'
  | 'star-filled'
  | 'check'
  | 'close'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'export'
  | 'import'
  | 'first'
  | 'prev'
  | 'next'
  | 'last'
  | 'flag'
  | 'again'
  | 'leave'
  | 'rotate';

const dot = (cx: number, cy: number, r = 1.6) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;

const PATHS: Record<IconName, ReactNode> = {
  today: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      {dot(12, 15)}
    </>
  ),
  games: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <circle cx="16.5" cy="7.5" r="3.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <path d="M16.5 13l3.5 3.5-3.5 3.5-3.5-3.5z" />
    </>
  ),
  progress: (
    <>
      <path d="M4 17.5l5-5 4 3 7-8" />
      <path d="M15.5 7.5H20V12" />
      <path d="M4 20.5h16" />
    </>
  ),
  tools: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V2.8M15 4V2.8M8.5 9.5h7M8.5 13h7M8.5 16.5h4" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  menu: (
    <>
      {dot(12, 5.5)}
      {dot(12, 12)}
      {dot(12, 18.5)}
    </>
  ),
  rail: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M14.5 4.5v15M16.8 9h1.7M16.8 12h1.7" />
    </>
  ),
  learn: (
    <>
      <path d="M12 6.5C10 5 7.2 4.5 4 5v13c3.2-.5 6 0 8 1.5 2-1.5 4.8-2 8-1.5V5c-3.2-.5-6 0-8 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  practice: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      {dot(12, 12, 1.3)}
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5z" fill="currentColor" />
    </>
  ),
  review: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4 4.5V8h3.5" />
      <path d="M12 8v4.5l3 2" />
    </>
  ),
  reference: (
    <>
      <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
      <path d="M15 3.5V7h3.5M9 11h6M9 14.5h6M9 18h3.5" />
    </>
  ),
  star: <path d="M12 3.8l2.5 5.1 5.6.8-4.05 3.95.96 5.6L12 16.6l-5.01 2.65.96-5.6L3.9 9.7l5.6-.8z" />,
  'star-filled': <path d="M12 3.8l2.5 5.1 5.6.8-4.05 3.95.96 5.6L12 16.6l-5.01 2.65.96-5.6L3.9 9.7l5.6-.8z" fill="currentColor" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7" />,
  edit: (
    <>
      <path d="M5 19l1-4L15.5 5.5l3 3L9 18z" />
      <path d="M13.5 7.5l3 3" />
    </>
  ),
  export: (
    <>
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
      <path d="M5 14v5h14v-5" />
    </>
  ),
  import: (
    <>
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
      <path d="M5 14v5h14v-5" />
    </>
  ),
  first: <path d="M6.5 5v14M18 5l-7 7 7 7" />,
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  last: <path d="M17.5 5v14M6 5l7 7-7 7" />,
  flag: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4.5h11l-2.5 3.5L17 11.5H6" />
    </>
  ),
  again: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M20 4.5V8h-3.5" />
    </>
  ),
  leave: (
    <>
      <path d="M14 4h4.5v16H14" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </>
  ),
  rotate: (
    <>
      <rect x="8" y="3" width="8" height="14" rx="1.8" />
      <path d="M4 15.5c0 2.8 2.5 5 6 5h5.5M13.5 18l2 2.5-2 2" />
    </>
  ),
};

export function Icon({ name, size = 22, title }: { name: IconName; size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
