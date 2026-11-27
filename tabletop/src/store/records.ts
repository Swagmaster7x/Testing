/** Saved games. Every move is saved as it is made, so a game always resumes where it stopped. */
import type { GameRecord } from '../core/record';
import type { StoredRecord, TabletopDb } from './db';

export async function saveRecord(db: TabletopDb, profileId: string, record: GameRecord): Promise<StoredRecord> {
  const stored: StoredRecord = { ...record, profileId };
  await db.records.put(stored);
  return stored;
}

export async function getRecord(db: TabletopDb, id: string): Promise<StoredRecord | undefined> {
  return db.records.get(id);
}

/** The most recent unfinished game of this kind, if any. */
export async function activeRecord(db: TabletopDb, profileId: string, gameId: string): Promise<StoredRecord | undefined> {
  const rows = await db.records.where('[profileId+gameId]').equals([profileId, gameId]).toArray();
  return rows.filter((r) => r.status === 'active').sort((a, b) => b.updatedAt - a.updatedAt)[0];
}

/** Finished games of this kind, newest first. */
export async function finishedRecords(db: TabletopDb, profileId: string, gameId: string): Promise<StoredRecord[]> {
  const rows = await db.records.where('[profileId+gameId]').equals([profileId, gameId]).toArray();
  return rows.filter((r) => r.status === 'finished').sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteRecord(db: TabletopDb, id: string): Promise<void> {
  await db.records.delete(id);
}
