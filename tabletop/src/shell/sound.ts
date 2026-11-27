/**
 * A handful of short sounds, synthesised on the spot (no audio files), with a switch in Settings.
 */
export type SoundName = 'place' | 'capture' | 'line' | 'end' | 'card' | 'shuffle' | 'tile' | 'chip';

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
  context ??= new window.AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(ctx: AudioContext, at: number, freq: number, length: number, gain: number, type: OscillatorType): void {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(env).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

export function playSound(name: SoundName): void {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  switch (name) {
    case 'place':
      // A soft wooden tock.
      tone(ctx, now, 190, 0.09, 0.22, 'triangle');
      tone(ctx, now, 820, 0.03, 0.05, 'sine');
      break;
    case 'capture':
      // A firmer double knock.
      tone(ctx, now, 170, 0.08, 0.26, 'triangle');
      tone(ctx, now + 0.05, 230, 0.08, 0.18, 'triangle');
      break;
    case 'line':
      tone(ctx, now, 523.25, 0.22, 0.09, 'sine');
      tone(ctx, now + 0.09, 659.25, 0.28, 0.08, 'sine');
      break;
    case 'end':
      tone(ctx, now, 392, 0.3, 0.07, 'sine');
      break;
    case 'card':
      // A light card snap: a short bright click over a soft body.
      tone(ctx, now, 1400, 0.025, 0.05, 'square');
      tone(ctx, now, 260, 0.05, 0.08, 'triangle');
      break;
    case 'shuffle':
      for (let i = 0; i < 5; i++) tone(ctx, now + i * 0.035, 900 + i * 60, 0.03, 0.03, 'square');
      break;
    case 'tile':
      // A tile set down on a table: a dull click with a little ring.
      tone(ctx, now, 1150, 0.02, 0.06, 'square');
      tone(ctx, now, 320, 0.07, 0.16, 'triangle');
      tone(ctx, now + 0.012, 2100, 0.04, 0.02, 'sine');
      break;
    case 'chip':
      // Two clay chips knocking together: a bright, short clack.
      tone(ctx, now, 2500, 0.03, 0.05, 'sine');
      tone(ctx, now + 0.03, 3150, 0.035, 0.035, 'sine');
      tone(ctx, now, 600, 0.03, 0.04, 'triangle');
      break;
  }
}
