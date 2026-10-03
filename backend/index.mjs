/**
 * TALAS — talasFunction sync handler (AWS Lambda, Node.js 20+, AWS SDK v3).
 *
 * Implements the `POST /sync` contract used by the web client (see
 * ../docs/offline-online.md). Reuses the EXISTING DynamoDB `talas` table whose
 * partition key is `userId` (String).
 *
 * Mapping (Option A):
 *   - the table partition key `userId` holds each record's logical `id`
 *     (e.g. "learner-maria", "assignment-maria-math").
 *   - a `store` attribute ("learners" | "teachers" | "assessments" |
 *     "assignments") tells entity types apart.
 *   - `updatedAt` (ISO string) drives last-write-wins.
 *   - the full client record is kept under a `data` attribute so the exact
 *     shape round-trips without flattening.
 *
 * Request  (POST, JSON body): { since: string|null, changes: SyncChange[] }
 * Response (200, JSON):       { serverTime: string, changes: SyncChange[] }
 *   SyncChange = { store, op: "put"|"delete", record: {...with id, updatedAt} }
 *
 * Conflict resolution: last-write-wins by `updatedAt`. An incoming change is
 * written only if it is strictly newer than what is already stored.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TALAS_TABLE ?? "talas";
const REGION = process.env.AWS_REGION ?? "ap-southeast-2";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

/** CORS headers so the browser app can call the Function URL. */
// NOTE: CORS is handled entirely by the Lambda Function URL's own CORS config
// (set in the AWS Console). The handler must NOT also emit Access-Control-*
// headers, or the browser sees duplicate values (e.g. "*, *") and blocks the
// request. We only set Content-Type here.
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function reply(statusCode, bodyObj) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(bodyObj) };
}

/** Milliseconds since epoch for an ISO string, or 0 if missing/invalid. */
function ts(iso) {
  const n = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(n) ? 0 : n;
}

/** Reads the stored item for a logical id, or undefined. */
async function getStored(id) {
  const res = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { userId: id } }),
  );
  return res.Item;
}

/**
 * Applies one incoming change with last-write-wins. Returns true if written.
 */
async function applyChange(change) {
  const { store, op, record } = change;
  if (!record || typeof record.id !== "string") return false;

  const stored = await getStored(record.id);
  const incomingTime = ts(record.updatedAt);

  // LWW: skip if what we have is newer or equal.
  if (stored && ts(stored.updatedAt) >= incomingTime) return false;

  const item = {
    userId: record.id, // partition key (existing table shape)
    store,
    updatedAt: record.updatedAt ?? new Date().toISOString(),
    deleted: op === "delete" ? true : record.deleted === true,
    data: record, // full client record, round-tripped verbatim
  };

  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  return true;
}

/**
 * Returns all changes modified strictly after `since` as SyncChange[].
 * Uses a filtered Scan — fine for demo-scale data. For production, add a GSI
 * on `updatedAt` and Query instead.
 */
async function pullSince(since) {
  const sinceTime = ts(since);
  const changes = [];
  let ExclusiveStartKey;

  do {
    const res = await ddb.send(
      new ScanCommand({ TableName: TABLE_NAME, ExclusiveStartKey }),
    );
    for (const item of res.Items ?? []) {
      if (ts(item.updatedAt) <= sinceTime) continue;
      // Reconstruct the client record from `data`, falling back to the item.
      const record = item.data ?? { id: item.userId, updatedAt: item.updatedAt };
      changes.push({
        store: item.store,
        op: item.deleted === true ? "delete" : "put",
        record,
      });
    }
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return changes;
}

export const handler = async (event) => {
  // Function URLs deliver the HTTP method under requestContext.http.method.
  const method =
    event?.requestContext?.http?.method ?? event?.httpMethod ?? "POST";

  if (method === "OPTIONS") {
    // The Function URL answers preflight itself; this is just a safety net.
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }
  if (method !== "POST") {
    return reply(405, { error: "Method not allowed. Use POST." });
  }

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return reply(400, { error: "Invalid JSON body." });
  }

  const since = body?.since ?? null;
  const changes = Array.isArray(body?.changes) ? body.changes : [];

  try {
    // 1) Apply all incoming (pushed) changes with LWW.
    for (const change of changes) {
      await applyChange(change);
    }

    // 2) Pull everything modified since the client's cursor.
    const outgoing = await pullSince(since);

    // 3) Respond with the authoritative server time + outgoing changes.
    return reply(200, {
      serverTime: new Date().toISOString(),
      changes: outgoing,
    });
  } catch (err) {
    console.error("[talasFunction] sync error:", err);
    return reply(500, { error: "Internal sync error." });
  }
};
