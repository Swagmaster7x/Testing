import type { ProfileSettings, TabletopDb } from './db';

export const MAX_FOCUS = 3;

export function defaultSettings(profileId: string): ProfileSettings {
  return { profileId, look: 'club', railSide: 'right', railOpen: true, motion: 'system', sound: true, focus: [], levels: {}, coach: {}, clocks: {}, rules: {} };
}

/** A profile's settings, with defaults filled in for anything added since they were saved. */
export async function getSettings(db: TabletopDb, profileId: string): Promise<ProfileSettings> {
  const stored = await db.settings.get(profileId);
  return { ...defaultSettings(profileId), ...stored, profileId };
}

export async function saveSettings(db: TabletopDb, settings: ProfileSettings): Promise<void> {
  await db.settings.put(settings);
}

/** Adds or removes a focus game. Refuses a fourth. */
export function toggleFocus(settings: ProfileSettings, gameId: string): ProfileSettings | 'full' {
  if (settings.focus.includes(gameId)) return { ...settings, focus: settings.focus.filter((g) => g !== gameId) };
  if (settings.focus.length >= MAX_FOCUS) return 'full';
  return { ...settings, focus: [...settings.focus, gameId] };
}
