/**
 * TALAS — IndexedDB access layer (Hour 1 Foundation).
 *
 * A tiny, dependency-free, Promise-based wrapper over IndexedDB. The whole app
 * reads/writes through these helpers so no one has to touch raw IDB events.
 *
 * Usage:
 *   import { getAll, put, get, add } from "./data/db";
 *   const learners = await getAll("learners");
 */

import { STORES, SYNC_STATE_STORE } from "./types";
import type { StoreEntityMap, StoreName } from "./types";

const DB_NAME = "talas";
/**
 * v1: initial entity stores.
 * v2: added the `syncState` key-value store for offline/online sync.
 */
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

/** Opens (and upgrades, if needed) the TALAS database. Cached after first call. */
export function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Create every entity store declared in STORES. All entities carry an
      // `id` field, so we use it as the keyPath. Guarded by `contains` so
      // upgrading from an older version preserves existing stores and data.
      for (const name of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: "id" });

          // Helpful secondary indexes for the join-ish stores.
          if (name === STORES.assignments) {
            store.createIndex("by_learner", "learnerId", { unique: false });
            store.createIndex("by_assessment", "assessmentId", {
              unique: false,
            });
          }
        }
      }

      // v2: key-value store for sync bookkeeping. Uses out-of-line string keys
      // (no keyPath), so we store/read plain values by key.
      if (!db.objectStoreNames.contains(SYNC_STATE_STORE)) {
        db.createObjectStore(SYNC_STATE_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/**
 * Drops the cached DB handle so the next `openDB()` reopens fresh. Intended for
 * tests (to isolate state between cases); harmless in production.
 */
export function _resetDbCacheForTests(): void {
  dbPromise = null;
}

/** Wraps an IDBRequest in a Promise. */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Runs a transaction on one store and resolves when it completes. */
async function withStore<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = fn(store);

    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/** Returns every record in a store. */
export async function getAll<K extends StoreName>(
  storeName: K,
): Promise<StoreEntityMap[K][]> {
  const db = await openDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return promisifyRequest(store.getAll() as IDBRequest<StoreEntityMap[K][]>);
}

/** Returns a single record by id, or undefined if not found. */
export async function get<K extends StoreName>(
  storeName: K,
  id: string,
): Promise<StoreEntityMap[K] | undefined> {
  const db = await openDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return promisifyRequest(
    store.get(id) as IDBRequest<StoreEntityMap[K] | undefined>,
  );
}

/** Inserts a record. Fails if a record with the same id already exists. */
export async function add<K extends StoreName>(
  storeName: K,
  value: StoreEntityMap[K],
): Promise<string> {
  return withStore(storeName, "readwrite", (store) =>
    store.add(value),
  ) as Promise<string>;
}

/** Inserts or replaces a record by id. */
export async function put<K extends StoreName>(
  storeName: K,
  value: StoreEntityMap[K],
): Promise<string> {
  return withStore(storeName, "readwrite", (store) =>
    store.put(value),
  ) as Promise<string>;
}

/** Deletes a record by id. */
export async function remove(storeName: StoreName, id: string): Promise<void> {
  await withStore(storeName, "readwrite", (store) => store.delete(id));
}

/** Counts records in a store (handy for "is this store empty?" checks). */
export async function count(storeName: StoreName): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return promisifyRequest(store.count());
}

/** Returns all assignments for a learner, using the by_learner index. */
export async function getAssignmentsByLearner(
  learnerId: string,
): Promise<StoreEntityMap["assignments"][]> {
  const db = await openDB();
  const tx = db.transaction(STORES.assignments, "readonly");
  const index = tx.objectStore(STORES.assignments).index("by_learner");
  return promisifyRequest(
    index.getAll(learnerId) as IDBRequest<StoreEntityMap["assignments"][]>,
  );
}

// ---------------------------------------------------------------------------
// syncState key-value helpers (v2)
// ---------------------------------------------------------------------------

/** Reads a value from the syncState store, or undefined if absent. */
export async function getSyncState<T = unknown>(
  key: string,
): Promise<T | undefined> {
  const db = await openDB();
  const tx = db.transaction(SYNC_STATE_STORE, "readonly");
  const store = tx.objectStore(SYNC_STATE_STORE);
  return promisifyRequest(store.get(key) as IDBRequest<T | undefined>);
}

/** Writes a value into the syncState store under `key`. */
export async function setSyncState(key: string, value: unknown): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SYNC_STATE_STORE, "readwrite");
    tx.objectStore(SYNC_STATE_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/** Deletes a key from the syncState store. */
export async function deleteSyncState(key: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SYNC_STATE_STORE, "readwrite");
    tx.objectStore(SYNC_STATE_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
