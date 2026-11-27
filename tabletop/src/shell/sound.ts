/**
 * A handful of short sounds, synthesised on the spot (no audio files), with a switch in Settings.
 */
export type SoundName = 'place' | 'capture' | 'line' | 'end';

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
  }
}
