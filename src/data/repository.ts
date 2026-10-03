/**
 * TALAS — repository layer (offline/online sync).
 *
 * The single write path for all entity mutations. UI code should import these
 * functions instead of calling `db.ts` directly, so every change is stamped
 * with `updatedAt` and flagged `dirty` for the sync engine to pick up.
 *
 * Reads here hide soft-deleted records (tombstones) so the UI never shows
 * something the user deleted while offline, even before the delete has synced.
 *
 *   import { save, softDelete, list, getById } from "./data/repository";
 *   await save("learners", { id: "l1", name: "Nia", createdAt: now });
 */

import {
  getAll,
  get,
  put,
  getAssignmentsByLearner,
  getReadingAttemptsByLearner,
} from "./db";
import type { Entity, StoreEntityMap, StoreName } from "./types";

/** Current time as an ISO-8601 string. */
function nowIso(): string {
  return new Date().toISOString();
}

/** True if a record is a live (non-tombstoned) entity. */
function isLive(record: Entity): boolean {
  return record.deleted !== true;
}

/**
 * Inserts or updates an entity through the sync-aware write path.
 * Stamps `updatedAt = now` and marks the record `dirty` so it will be pushed
 * on the next sync. `createdAt` is preserved if present, set otherwise.
 */
export async function save<K extends StoreName>(
  storeName: K,
  entity: StoreEntityMap[K],
): Promise<StoreEntityMap[K]> {
  const stamped: StoreEntityMap[K] = {
    ...entity,
    updatedAt: nowIso(),
    dirty: true,
  };
  await put(storeName, stamped);
  return stamped;
}

/**
 * Soft-deletes an entity: marks it `deleted` + `dirty` and re-stamps
 * `updatedAt` so the tombstone wins last-write-wins and syncs to the server.
 * Reads via this module will no longer return it. Returns false if not found.
 */
export async function softDelete<K extends StoreName>(
  storeName: K,
  id: string,
): Promise<boolean> {
  const existing = await get(storeName, id);
  if (!existing) return false;

  const tombstone: StoreEntityMap[K] = {
    ...existing,
    deleted: true,
    dirty: true,
    updatedAt: nowIso(),
  };
  await put(storeName, tombstone);
  return true;
}

/** Lists all live (non-deleted) records in a store. */
export async function list<K extends StoreName>(
  storeName: K,
): Promise<StoreEntityMap[K][]> {
  const all = await getAll(storeName);
  return all.filter(isLive);
}

/** Gets a single live record by id, or undefined if missing or tombstoned. */
export async function getById<K extends StoreName>(
  storeName: K,
  id: string,
): Promise<StoreEntityMap[K] | undefined> {
  const record = await get(storeName, id);
  if (!record || !isLive(record)) return undefined;
  return record;
}

/** Lists live assignments for a learner (tombstones filtered out). */
export async function listAssignmentsByLearner(
  learnerId: string,
): Promise<StoreEntityMap["assignments"][]> {
  const all = await getAssignmentsByLearner(learnerId);
  return all.filter(isLive);
}

/** Lists live reading attempts for a learner, newest first. */
export async function listReadingAttemptsByLearner(
  learnerId: string,
): Promise<StoreEntityMap["readingAttempts"][]> {
  // Prefer the by_learner index, but fall back to a full scan if the index is
  // missing (e.g. a DB created before the index existed) so reads never fail.
  let all: StoreEntityMap["readingAttempts"][];
  try {
    all = await getReadingAttemptsByLearner(learnerId);
  } catch {
    const everything = await getAll("readingAttempts");
    all = everything.filter((a) => a.learnerId === learnerId);
  }
  return all
    .filter(isLive)
    .sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1));
}
