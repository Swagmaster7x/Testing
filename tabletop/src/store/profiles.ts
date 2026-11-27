/** Local profiles: one device, any number of people, no accounts. */
import type { Profile, TabletopDb } from './db';
import { newId } from './ids';
import { defaultSettings } from './settings';

const ACTIVE = 'activeProfile';

export async function listProfiles(db: TabletopDb): Promise<Profile[]> {
  return db.profiles.orderBy('createdAt').toArray();
}

export async function createProfile(db: TabletopDb, name: string, now: number): Promise<Profile> {
  const profile: Profile = { id: newId('p'), name: cleanName(name), createdAt: now };
  await db.transaction('rw', db.profiles, db.settings, async () => {
    await db.profiles.add(profile);
    await db.settings.put(defaultSettings(profile.id));
  });
  return profile;
}

export async function renameProfile(db: TabletopDb, id: string, name: string): Promise<void> {
  await db.profiles.update(id, { name: cleanName(name) });
}

/** Deletes a profile and every row it owns. The last profile cannot be deleted. */
export async function deleteProfile(db: TabletopDb, id: string): Promise<void> {
  await db.transaction('rw', [db.profiles, db.settings, db.records, db.lessonProgress, db.problemAttempts, db.reviewCards, db.ratings, db.analyses, db.device], async () => {
    if ((await db.profiles.count()) <= 1) throw new Error('The last profile cannot be deleted');
    await db.profiles.delete(id);
    await db.settings.delete(id);
    await db.records.where('profileId').equals(id).delete();
    await db.lessonProgress.where('profileId').equals(id).delete();
    await db.problemAttempts.where('profileId').equals(id).delete();
    await db.reviewCards.where('profileId').equals(id).delete();
    await db.ratings.where('profileId').equals(id).delete();
    await db.analyses.where('profileId').equals(id).delete();
    if ((await getActiveProfileId(db)) === id) {
      const next = await db.profiles.orderBy('createdAt').first();
      if (next) await setActiveProfileId(db, next.id);
    }
  });
}

export async function getActiveProfileId(db: TabletopDb): Promise<string | null> {
  const row = await db.device.get(ACTIVE);
  return typeof row?.value === 'string' ? row.value : null;
}

export async function setActiveProfileId(db: TabletopDb, id: string): Promise<void> {
  await db.device.put({ key: ACTIVE, value: id });
}

/**
 * The profile to use: the active one, else the first, else a new one. `created` is true on the
 * very first run, when the app should also ask the browser to keep its storage.
 */
export async function ensureProfile(db: TabletopDb, defaultName: string, now: number): Promise<{ profile: Profile; created: boolean }> {
  return db.transaction('rw', db.profiles, db.settings, db.device, async () => {
    const activeId = await getActiveProfileId(db);
    const active = activeId ? await db.profiles.get(activeId) : undefined;
    if (active) return { profile: active, created: false };
    const first = await db.profiles.orderBy('createdAt').first();
    if (first) {
      await setActiveProfileId(db, first.id);
      return { profile: first, created: false };
    }
    const profile = await createProfile(db, defaultName, now);
    await setActiveProfileId(db, profile.id);
    return { profile, created: true };
  });
}

function cleanName(name: string): string {
  const trimmed = name.replace(/\s+/g, ' ').trim().slice(0, 40);
  if (!trimmed) throw new Error('A profile needs a name');
  return trimmed;
}
