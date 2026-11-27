/**
 * The señas (docs/rules/brisca.md): one drawing per sign, after the system pagat.com gives for
 * four-player briscola. As: the lips stretched over the teeth. The second brisca (the Tres): the
 * mouth twisted to one side. Rey: a glance upwards. Caballo: the tip of the tongue. Sota: one
 * shoulder shrugged. Original line drawings: a head and shoulders, changed only where the sign is.
 */
import type { Sign } from '../rules';

const SKIN = '#e9c9a3';
const LINE = '#3b2a1e';

function Mouth({ sign }: { sign: Sign }) {
  switch (sign) {
    case 'A':
      // Lips drawn in over the teeth: a wide, flat mouth with the teeth showing.
      return (
        <g>
          <rect x="-9" y="9" width="18" height="5" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.4" />
          <path d="M-9 11.5 H9" stroke={LINE} strokeWidth="0.8" />
        </g>
      );
    case 'second':
      // The mouth pulled to one side.
      return <path d="M-6 13 Q0 13 5 10 Q8 8 9 6" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />;
    case 'C':
      // The tip of the tongue between the lips.
      return (
        <g>
          <path d="M-6 11 Q0 13 6 11" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
          <path d="M-2.5 11.8 Q0 17 2.5 11.8 Z" fill="#d9707a" stroke={LINE} strokeWidth="1" />
        </g>
      );
    default:
      return <path d="M-6 11 Q0 13.5 6 11" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />;
  }
}

/** A sign as a small drawing: a face, with the shoulders when the sign is a shrug. */
export function SignFace({ sign, size = 56 }: { sign: Sign; size?: number }) {
  const up = sign === 'R';
  const shrug = sign === 'S';
  return (
    <svg viewBox="-30 -30 60 64" width={size} height={(size * 64) / 60} aria-hidden="true" className="sign-face">
      {/* Shoulders: the left one raised for the Sota. */}
      <path d={shrug ? 'M-28 34 Q-27 14 -14 12 L-6 18 H6 L14 20 Q27 22 28 34 Z' : 'M-28 34 Q-27 21 -14 19 L-6 20 H6 L14 19 Q27 21 28 34 Z'} fill="#4c6b8a" stroke={LINE} strokeWidth="1.2" />
      <rect x="-5" y="12" width="10" height="9" fill={SKIN} />
      <ellipse cx="0" cy="0" rx="15" ry="18" fill={SKIN} stroke={LINE} strokeWidth="1.4" />
      <path d="M-15 -4 Q-14 -20 0 -19 Q14 -20 15 -4 Q10 -13 0 -13 Q-10 -13 -15 -4 Z" fill="#5a3b26" />
      {/* Eyes: looking up for the Rey. */}
      <ellipse cx="-6" cy="-1" rx="3.2" ry="2.4" fill="#fff" stroke={LINE} strokeWidth="0.8" />
      <ellipse cx="6" cy="-1" rx="3.2" ry="2.4" fill="#fff" stroke={LINE} strokeWidth="0.8" />
      <circle cx="-6" cy={up ? -2.6 : -0.8} r="1.5" fill={LINE} />
      <circle cx="6" cy={up ? -2.6 : -0.8} r="1.5" fill={LINE} />
      {up ? <path d="M-9 -6 Q-6 -8 -3 -6 M3 -6 Q6 -8 9 -6" fill="none" stroke={LINE} strokeWidth="1" /> : null}
      <path d="M0 1 Q-1.5 6 0 7" fill="none" stroke={LINE} strokeWidth="1" />
      <Mouth sign={sign} />
      {shrug ? <path d="M-24 6 l-3 -3 M-24 6 l-4 1" stroke={LINE} strokeWidth="1" fill="none" /> : null}
    </svg>
  );
}
