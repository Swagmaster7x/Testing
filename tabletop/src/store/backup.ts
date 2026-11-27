/**
 * Backup: Export writes everything to one JSON file, Import reads it back (PLAN.md 1.6, 2.8).
 * The file carries a format version so later builds can read older files.
 */
import { isJsonObject } from '../core/json';
import { parseRecord } from '../core/record';
import type { TableName, TabletopDb } from './db';
import { SCHEMA_VERSION, TABLES } from './db';

export const BACKUP_FORMAT = 'tabletop-backup';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  readonly format: typeof BACKUP_FORMAT;
  readonly formatVersion: number;
  readonly appName: string;
  readonly appVersion: string;
  readonly exportedAt: string;
  readonly schemaVersion: number;
  readonly tables: Readonly<Record<TableName, readonly unknown[]>>;
}

export interface BackupSummary {
  readonly exportedAt: string;
  readonly profiles: number;
  readonly games: number;
}

export class BackupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupError';
  }
}

export async function exportBackup(db: TabletopDb, app: { name: string; version: string }, now: Date): Promise<BackupFile> {
  return db.transaction('r', TABLES.map((t) => db.table(t)), async () => {
    const tables = {} as Record<TableName, unknown[]>;
    for (const name of TABLES) tables[name] = await db.table(name).toArray();
    return {
      format: BACKUP_FORMAT,
      formatVersion: BACKUP_VERSION,
      appName: app.name,
      appVersion: app.version,
      exportedAt: now.toISOString(),
      schemaVersion: SCHEMA_VERSION,
      tables,
    };
  });
}

export function backupFileName(appName: string, now: Date): string {
  const day = now.toISOString().slice(0, 10);
  return `${appName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-backup-${day}.json`;
}

/** Reads a backup file's text, checking everything. Throws BackupError with a plain message. */
export function parseBackup(text: string): BackupFile {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BackupError('This file is not a backup: it is not JSON.');
  }
  if (!isJsonObject(json) || json.format !== BACKUP_FORMAT) throw new BackupError('This file is not a backup from this app.');
  if (typeof json.formatVersion !== 'number' || json.formatVersion > BACKUP_VERSION) {
    throw new BackupError('This backup comes from a newer version of the app. Update the app, then import it.');
  }
  const migrated = migrate(json);
  const tables = migrated.tables;
  if (!isJsonObject(tables)) throw new BackupError('The backup has no data.');
  const out = {} as Record<TableName, unknown[]>;
  for (const name of TABLES) {
    const rows = tables[name] ?? [];
    if (!Array.isArray(rows)) throw new BackupError(`The backup's ${name} list is damaged.`);
    out[name] = rows;
  }
  checkRows(out);
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_VERSION,
    appName: typeof migrated.appName === 'string' ? migrated.appName : '',
    appVersion: typeof migrated.appVersion === 'string' ? migrated.appVersion : '',
    exportedAt: typeof migrated.exportedAt === 'string' ? migrated.exportedAt : '',
    schemaVersion: typeof migrated.schemaVersion === 'number' ? migrated.schemaVersion : SCHEMA_VERSION,
    tables: out,
  };
}

/** Upgrades an older backup format to the current one, one version at a time. */
function migrate(json: Record<string, unknown>): Record<string, unknown> {
  const current = json;
  // Format 1 is the first. A future format 2 adds: if (current.formatVersion === 1) current = from1to2(current);
  return current;
}

function checkRows(tables: Record<TableName, unknown[]>): void {
  const profileIds = new Set<string>();
  for (const p of tables.profiles) {
    if (!isJsonObject(p) || typeof p.id !== 'string' || typeof p.name !== 'string') throw new BackupError('A profile in the backup is damaged.');
    profileIds.add(p.id);
  }
  if (profileIds.size === 0) throw new BackupError('The backup has no profiles.');
  for (const name of TABLES) {
    if (name === 'profiles' || name === 'device') continue;
    for (const row of tables[name]) {
      if (!isJsonObject(row) || typeof row.profileId !== 'string' || !profileIds.has(row.profileId)) {
        throw new BackupError(`A row in the backup's ${name} list does not belong to a profile.`);
      }
    }
  }
  for (const r of tables.records) {
    try {
      parseRecord(r);
    } catch (err) {
      throw new BackupError(`A saved game in the backup is damaged (${(err as Error).message}).`);
    }
  }
}

export function summarise(backup: BackupFile): BackupSummary {
  return { exportedAt: backup.exportedAt, profiles: backup.tables.profiles.length, games: backup.tables.records.length };
}

/** Replaces everything on this device with the backup, in one transaction: all or nothing. */
export async function importBackup(db: TabletopDb, backup: BackupFile): Promise<void> {
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const name of TABLES) {
      const table = db.table(name);
      await table.clear();
      await table.bulkAdd(backup.tables[name] as never[]);
    }
  });
}
