/**
 * The on-device database (IndexedDB through Dexie). Every profile-owned row carries a profile id.
 * The `device` table holds the few values that belong to the device, such as the active profile.
 *
 * Schema changes: add a new entry to VERSIONS with the new stores and an upgrade step, and raise
 * nothing else. Never edit an entry that has shipped; Dexie runs the upgrades in order.
 */
import type { Transaction } from 'dexie';
import { Dexie } from 'dexie';
import type { EntityTable, Table } from 'dexie';
import type { Json } from '../core/json';
import type { GameRecord } from '../core/record';

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly createdAt: number;
}

export type RailSide = 'left' | 'right';
export type MotionSetting = 'system' | 'reduced' | 'full';
export type LookSetting = 'club';

export interface ProfileSettings {
  readonly profileId: string;
  readonly look: LookSetting;
  readonly railSide: RailSide;
  readonly railOpen: boolean;
  readonly motion: MotionSetting;
  readonly sound: boolean;
  /** Up to three games being studied now (PLAN.md 1.1, focus games). */
  readonly focus: readonly string[];
  /** The CPU level last chosen for each game. */
  readonly levels: Readonly<Record<string, number>>;
}

export interface StoredRecord extends GameRecord {
  readonly profileId: string;
}

/** Lesson progress (filled from milestone 2). */
export interface LessonProgressRow {
  readonly profileId: string;
  readonly lessonId: string;
  readonly gameId: string;
  readonly completedAt: number | null;
  readonly data: Json;
}

/** One attempt at a practice problem (filled from milestone 2). */
export interface ProblemAttemptRow {
  readonly id?: number;
  readonly profileId: string;
  readonly gameId: string;
  readonly problemId: string;
  readonly solved: boolean;
  readonly at: number;
}

/** A spaced-review card (filled from milestone 2). */
export interface ReviewCardRow {
  readonly id: string;
  readonly profileId: string;
  readonly gameId: string;
  readonly due: number;
  readonly card: Json;
}

/** A rating per game and kind, such as play or problems (filled from milestone 2). */
export interface RatingRow {
  readonly profileId: string;
  readonly gameId: string;
  readonly kind: string;
  readonly rating: number;
  readonly games: number;
  readonly updatedAt: number;
}

export interface DeviceRow {
  readonly key: string;
  readonly value: Json;
}

export const TABLES = ['profiles', 'settings', 'records', 'lessonProgress', 'problemAttempts', 'reviewCards', 'ratings', 'device'] as const;
export type TableName = (typeof TABLES)[number];

interface SchemaVersion {
  readonly version: number;
  readonly stores: Partial<Record<TableName, string | null>>;
  readonly upgrade?: (tx: Transaction) => Promise<void>;
}

const VERSIONS: readonly SchemaVersion[] = [
  {
    version: 1,
    stores: {
      profiles: 'id, createdAt',
      settings: 'profileId',
      records: 'id, profileId, [profileId+gameId], [profileId+status], updatedAt',
      lessonProgress: '[profileId+lessonId], profileId, gameId',
      problemAttempts: '++id, profileId, [profileId+gameId], problemId',
      reviewCards: 'id, profileId, [profileId+gameId], due',
      ratings: '[profileId+gameId+kind], profileId',
      device: 'key',
    },
  },
];

export const SCHEMA_VERSION = (VERSIONS[VERSIONS.length - 1] as SchemaVersion).version;

export class TabletopDb extends Dexie {
  profiles!: EntityTable<Profile, 'id'>;
  settings!: EntityTable<ProfileSettings, 'profileId'>;
  records!: EntityTable<StoredRecord, 'id'>;
  lessonProgress!: Table<LessonProgressRow, [string, string]>;
  problemAttempts!: EntityTable<ProblemAttemptRow, 'id'>;
  reviewCards!: EntityTable<ReviewCardRow, 'id'>;
  ratings!: Table<RatingRow, [string, string, string]>;
  device!: EntityTable<DeviceRow, 'key'>;

  constructor(name = 'tabletop') {
    super(name);
    for (const v of VERSIONS) {
      const declared = this.version(v.version).stores(v.stores);
      if (v.upgrade) declared.upgrade(v.upgrade);
    }
  }
}

let shared: TabletopDb | null = null;

/** The app's database. Tests make their own with `new TabletopDb(name)`. */
export function appDb(): TabletopDb {
  shared ??= new TabletopDb();
  return shared;
}
