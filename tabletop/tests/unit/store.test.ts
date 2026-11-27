import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { newRecord, withAction, withOutcome } from '../../src/core/record';
import { noughts } from '../../src/games/noughts/rules';
import { BackupError, backupFileName, exportBackup, importBackup, parseBackup, summarise } from '../../src/store/backup';
import { SCHEMA_VERSION, TABLES, TabletopDb } from '../../src/store/db';
import { createProfile, deleteProfile, ensureProfile, getActiveProfileId, listProfiles, renameProfile, setActiveProfileId } from '../../src/store/profiles';
import { activeRecord, finishedRecords, getRecord, saveRecord } from '../../src/store/records';
import { deletePad, getPad, listPads, savePad } from '../../src/store/pads';
import { defaultSettings, getSettings, MAX_FOCUS, saveSettings, toggleFocus } from '../../src/store/settings';
import { addEntry, newPad } from '../../src/tools/scorepad';

let counter = 0;
const opened: TabletopDb[] = [];
function freshDb(): TabletopDb {
  const db = new TabletopDb(`test-${Date.now()}-${counter++}`);
  opened.push(db);
  return db;
}

afterEach(async () => {
  for (const db of opened.splice(0)) {
    db.close();
    await db.delete();
  }
});

function game(id: string, moves: number[] = []) {
  let r = newRecord(noughts, { id, config: {}, seed: `seed-${id}`, players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: '0.1.0', training: false, now: 1 });
  moves.forEach((m, i) => {
    r = withAction(r, m, 2 + i);
  });
  return r;
}

describe('database', () => {
  it('opens at the current schema version with every table from the plan', async () => {
    const db = freshDb();
    await db.open();
    expect(db.verno).toBe(SCHEMA_VERSION);
    expect(db.tables.map((t) => t.name).sort()).toEqual([...TABLES].sort());
  });
});

describe('profiles', () => {
  it('makes a first profile on first run, and reuses it after', async () => {
    const db = freshDb();
    const first = await ensureProfile(db, 'Player 1', 10);
    expect(first.created).toBe(true);
    expect(first.profile.name).toBe('Player 1');
    expect(await getActiveProfileId(db)).toBe(first.profile.id);
    const again = await ensureProfile(db, 'Player 1', 20);
    expect(again.created).toBe(false);
    expect(again.profile.id).toBe(first.profile.id);
  });

  it('creates, renames, switches and deletes profiles with all their rows', async () => {
    const db = freshDb();
    const a = (await ensureProfile(db, 'Ana', 1)).profile;
    const b = await createProfile(db, '  Ben   Ruiz ', 2);
    expect(b.name).toBe('Ben Ruiz');
    await renameProfile(db, b.id, 'Benny');
    expect((await listProfiles(db)).map((p) => p.name)).toEqual(['Ana', 'Benny']);
    await setActiveProfileId(db, b.id);
    await saveRecord(db, b.id, game('g1'));
    await deleteProfile(db, b.id);
    expect((await listProfiles(db)).map((p) => p.id)).toEqual([a.id]);
    expect(await getRecord(db, 'g1')).toBeUndefined();
    expect(await db.settings.get(b.id)).toBeUndefined();
    expect(await getActiveProfileId(db)).toBe(a.id);
  });

  it('refuses to delete the last profile or to use an empty name', async () => {
    const db = freshDb();
    const a = (await ensureProfile(db, 'Ana', 1)).profile;
    await expect(deleteProfile(db, a.id)).rejects.toThrow();
    await expect(createProfile(db, '   ', 2)).rejects.toThrow();
  });
});

describe('settings', () => {
  it('fills in defaults and saves changes per profile', async () => {
    const db = freshDb();
    const a = (await ensureProfile(db, 'Ana', 1)).profile;
    expect(await getSettings(db, a.id)).toEqual(defaultSettings(a.id));
    await saveSettings(db, { ...defaultSettings(a.id), railSide: 'left', sound: false });
    expect(await getSettings(db, a.id)).toMatchObject({ railSide: 'left', sound: false, motion: 'system' });
  });

  it('allows at most three focus games', () => {
    let s = defaultSettings('p');
    for (const id of ['chess', 'brisca', 'go']) {
      const next = toggleFocus(s, id);
      if (next === 'full') throw new Error('should fit');
      s = next;
    }
    expect(s.focus).toHaveLength(MAX_FOCUS);
    expect(toggleFocus(s, 'poker')).toBe('full');
    const fewer = toggleFocus(s, 'brisca');
    expect(fewer !== 'full' && fewer.focus).toEqual(['chess', 'go']);
  });
});

describe('saved games', () => {
  it('saves every move and finds the game to resume', async () => {
    const db = freshDb();
    const p = (await ensureProfile(db, 'Ana', 1)).profile;
    await saveRecord(db, p.id, game('old', [4]));
    await saveRecord(db, p.id, { ...game('new', [4, 0]), updatedAt: 50 });
    expect((await activeRecord(db, p.id, 'noughts'))?.id).toBe('new');
    const finishedGame = withOutcome(game('done', [4]), { reason: 'line', results: [] }, 60);
    await saveRecord(db, p.id, finishedGame);
    expect((await finishedRecords(db, p.id, 'noughts')).map((r) => r.id)).toEqual(['done']);
    expect(await activeRecord(db, 'someone-else', 'noughts')).toBeUndefined();
  });
});

describe('backup', () => {
  it('exports everything and imports it back exactly', async () => {
    const db = freshDb();
    const p = (await ensureProfile(db, 'Ana', 1)).profile;
    await saveSettings(db, { ...defaultSettings(p.id), focus: ['chess'] });
    await saveRecord(db, p.id, game('g1', [4, 0, 8]));
    const file = await exportBackup(db, { name: 'Kibitz', version: '0.1.0' }, new Date('2026-11-27T10:00:00Z'));
    expect(file).toMatchObject({ format: 'tabletop-backup', formatVersion: 1, appName: 'Kibitz', schemaVersion: SCHEMA_VERSION });
    const text = JSON.stringify(file);

    const other = freshDb();
    await ensureProfile(other, 'Someone else', 5);
    const parsed = parseBackup(text);
    expect(summarise(parsed)).toEqual({ exportedAt: '2026-11-27T10:00:00.000Z', profiles: 1, games: 1 });
    await importBackup(other, parsed);
    const back = await exportBackup(other, { name: 'Kibitz', version: '0.1.0' }, new Date('2026-11-27T10:00:00Z'));
    expect(back.tables).toEqual(file.tables);
    expect(await getActiveProfileId(other)).toBe(p.id);
  });

  it('refuses files that are not backups, are from a newer app, or are damaged', () => {
    expect(() => parseBackup('not json')).toThrow(BackupError);
    expect(() => parseBackup('{"format":"something-else"}')).toThrow(/not a backup/);
    expect(() => parseBackup('{"format":"tabletop-backup","formatVersion":99,"tables":{}}')).toThrow(/newer/);
    expect(() => parseBackup('{"format":"tabletop-backup","formatVersion":1,"tables":{"profiles":[]}}')).toThrow(/no profiles/);
    const orphan = { format: 'tabletop-backup', formatVersion: 1, tables: { profiles: [{ id: 'p1', name: 'A', createdAt: 1 }], records: [{ ...game('g'), profileId: 'nobody' }] } };
    expect(() => parseBackup(JSON.stringify(orphan))).toThrow(/does not belong/);
    const broken = { format: 'tabletop-backup', formatVersion: 1, tables: { profiles: [{ id: 'p1', name: 'A', createdAt: 1 }], records: [{ profileId: 'p1', id: 'x' }] } };
    expect(() => parseBackup(JSON.stringify(broken))).toThrow(/damaged/);
  });

  it('leaves the device untouched when an import fails part way', async () => {
    const db = freshDb();
    const p = (await ensureProfile(db, 'Ana', 1)).profile;
    await saveRecord(db, p.id, game('keep'));
    const bad = parseBackup(JSON.stringify({ format: 'tabletop-backup', formatVersion: 1, tables: { profiles: [{ id: 'p1', name: 'A', createdAt: 1 }, { id: 'p1', name: 'Duplicate', createdAt: 2 }] } }));
    await expect(importBackup(db, bad)).rejects.toThrow();
    expect(await getRecord(db, 'keep')).toBeDefined();
  });

  it('names the file after the app and the day', () => {
    expect(backupFileName('Kibitz', new Date('2026-11-27T23:00:00Z'))).toBe('kibitz-backup-2026-11-27.json');
  });
});

describe('scorepads', () => {
  it('saves pads per profile, lists the latest first, carries them in a backup, and deletes them with the profile', async () => {
    const db = freshDb();
    const { profile } = await ensureProfile(db, 'Ana', 1);
    const other = await createProfile(db, 'Ben', 2);
    const a = addEntry(newPad('dominoes', 'pad-a', 10), { type: 'score', side: 0, points: 40 }, 11);
    await savePad(db, profile.id, a);
    await savePad(db, profile.id, newPad('brisca', 'pad-b', 20));
    await savePad(db, other.id, newPad('tally', 'pad-c', 30));
    expect((await listPads(db, profile.id)).map((p) => p.id)).toEqual(['pad-b', 'pad-a']);
    expect(await getPad(db, other.id, 'pad-a')).toBeNull();
    expect(await getPad(db, profile.id, 'pad-a')).toEqual(a);
    const file = await exportBackup(db, { name: 'Kibitz', version: 'test' }, new Date(0));
    expect(file.tables.pads).toHaveLength(3);
    const copy = freshDb();
    await importBackup(copy, parseBackup(JSON.stringify(file)));
    expect(await getPad(copy, profile.id, 'pad-a')).toEqual(a);
    await deletePad(db, profile.id, 'pad-b');
    await deleteProfile(db, other.id);
    expect((await db.pads.toArray()).map((p) => p.id)).toEqual(['pad-a']);
  });
});

