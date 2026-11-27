/** Scorepads, per profile (milestone 16). The pad logic is in `src/tools/scorepad.ts`. */
import type { Pad } from '../tools/scorepad';
import { checkPad } from '../tools/scorepad';
import type { PadRow, TabletopDb } from './db';

export async function listPads(db: TabletopDb, profileId: string): Promise<Pad[]> {
  const rows = await db.pads.where('profileId').equals(profileId).toArray();
  return rows.sort((a, b) => b.updatedAt - a.updatedAt).map(strip);
}

export async function getPad(db: TabletopDb, profileId: string, id: string): Promise<Pad | null> {
  const row = await db.pads.get(id);
  return row && row.profileId === profileId ? strip(row) : null;
}

export async function savePad(db: TabletopDb, profileId: string, pad: Pad): Promise<void> {
  checkPad(pad);
  const row: PadRow = { ...pad, profileId };
  await db.pads.put(row);
}

export async function deletePad(db: TabletopDb, profileId: string, id: string): Promise<void> {
  const row = await db.pads.get(id);
  if (row && row.profileId === profileId) await db.pads.delete(id);
}

function strip(row: PadRow): Pad {
  const { profileId: _profileId, ...pad } = row;
  return pad;
}
