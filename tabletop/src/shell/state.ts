/**
 * Interface state (Zustand): the active profile, its settings and passing notices.
 * Game state never lives here; it lives in the pure game modules and the saved records.
 */
import { create } from 'zustand';
import type { Profile, ProfileSettings } from '../store/db';
import { appDb } from '../store/db';
import type { PersistState } from '../store/persist';
import { persistenceState, requestPersistence } from '../store/persist';
import { createProfile, deleteProfile, ensureProfile, listProfiles, renameProfile, setActiveProfileId } from '../store/profiles';
import { getSettings, saveSettings, toggleFocus } from '../store/settings';
import { t } from '../text';

export interface Notice {
  readonly id: number;
  readonly text: string;
}

interface AppState {
  readonly status: 'loading' | 'ready' | 'failed';
  readonly profile: Profile | null;
  readonly profiles: readonly Profile[];
  readonly settings: ProfileSettings | null;
  readonly persist: PersistState;
  readonly notice: Notice | null;
  readonly init: () => Promise<void>;
  readonly reload: () => Promise<void>;
  readonly switchProfile: (id: string) => Promise<void>;
  readonly addProfile: (name: string) => Promise<void>;
  readonly renameProfile: (id: string, name: string) => Promise<void>;
  readonly removeProfile: (id: string) => Promise<void>;
  readonly updateSettings: (patch: Partial<Omit<ProfileSettings, 'profileId'>>) => Promise<void>;
  readonly toggleFocus: (gameId: string) => Promise<'added' | 'removed' | 'full'>;
  readonly notify: (text: string) => void;
}

let noticeId = 0;
let noticeTimer: ReturnType<typeof setTimeout> | null = null;

export const useApp = create<AppState>()((set, get) => ({
  status: 'loading',
  profile: null,
  profiles: [],
  settings: null,
  persist: 'unknown',
  notice: null,

  async init() {
    try {
      const db = appDb();
      const { profile, created } = await ensureProfile(db, t('settings.profiles.default'), Date.now());
      // Ask the browser to keep our storage once, on the very first run (PLAN.md 2.8).
      const persist = created ? await requestPersistence() : await persistenceState();
      const [profiles, settings] = await Promise.all([listProfiles(db), getSettings(db, profile.id)]);
      set({ status: 'ready', profile, profiles, settings, persist });
    } catch (err) {
      console.error(err);
      set({ status: 'failed' });
    }
  },

  async reload() {
    set({ status: 'loading' });
    await get().init();
  },

  async switchProfile(id) {
    const db = appDb();
    await setActiveProfileId(db, id);
    const profiles = await listProfiles(db);
    const profile = profiles.find((p) => p.id === id) ?? null;
    if (!profile) return;
    set({ profile, profiles, settings: await getSettings(db, id) });
    get().notify(t('settings.profiles.switched', { name: profile.name }));
  },

  async addProfile(name) {
    const db = appDb();
    await createProfile(db, name, Date.now());
    set({ profiles: await listProfiles(db) });
  },

  async renameProfile(id, name) {
    const db = appDb();
    await renameProfile(db, id, name);
    const profiles = await listProfiles(db);
    set({ profiles, profile: profiles.find((p) => p.id === get().profile?.id) ?? get().profile });
  },

  async removeProfile(id) {
    const db = appDb();
    const wasActive = get().profile?.id === id;
    await deleteProfile(db, id);
    if (wasActive) await get().reload();
    else set({ profiles: await listProfiles(db) });
  },

  async updateSettings(patch) {
    const current = get().settings;
    if (!current) return;
    const next: ProfileSettings = { ...current, ...patch, profileId: current.profileId };
    set({ settings: next });
    await saveSettings(appDb(), next);
  },

  async toggleFocus(gameId) {
    const current = get().settings;
    if (!current) return 'full';
    const next = toggleFocus(current, gameId);
    if (next === 'full') return 'full';
    set({ settings: next });
    await saveSettings(appDb(), next);
    return next.focus.includes(gameId) ? 'added' : 'removed';
  },

  notify(text) {
    if (noticeTimer) clearTimeout(noticeTimer);
    const notice = { id: ++noticeId, text };
    set({ notice });
    noticeTimer = setTimeout(() => {
      if (get().notice?.id === notice.id) set({ notice: null });
    }, 3200);
  },
}));
