import assert from "node:assert/strict";
import test from "node:test";

import { buildSnapshot, fetchWithRetry, normalizeParent, parseSourceMap } from "./sync-notion.mjs";

const sourceMap = `
| Canonical resource | Notion ID | Type | GitHub mirror |
|---|---|---|---|
| Private Operations | \`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\` | Page | Governance |
| Canonical Tasks | \`bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\` | Database | Registry |
`;

test("parses typed resources without duplicate endpoint probes", () => {
  assert.deepEqual(parseSourceMap(sourceMap), [
    { canonical_name: "Private Operations", id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", type: "page" },
    { canonical_name: "Canonical Tasks", id: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", type: "database" },
  ]);
});

test("normalizes parent metadata without exporting content", () => {
  assert.deepEqual(normalizeParent({ type: "page_id", page_id: "abcd-1234" }), {
    type: "page_id",
    id: "abcd1234",
  });
  assert.deepEqual(normalizeParent({ type: "workspace", workspace: true }), {
    type: "workspace",
    workspace: true,
  });
});

test("retries a throttled request using Retry-After", async () => {
  const statuses = [429, 200];
  const delays = [];
  const response = await fetchWithRetry(
    "https://example.invalid",
    {},
    async () => ({ status: statuses.shift(), headers: new Headers({ "retry-after": "2" }) }),
    async (ms) => delays.push(ms),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(delays, [2000]);
});

test("builds a metadata-only snapshot with parent evidence", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    const isDatabase = url.includes("/databases/");
    return new Response(JSON.stringify({
      id: isDatabase ? "bbbb-bbbb" : "aaaa-aaaa",
      object: isDatabase ? "database" : "page",
      title: isDatabase ? [{ plain_text: "Canonical Tasks" }] : undefined,
      properties: isDatabase ? undefined : { Name: { type: "title", title: [{ plain_text: "Private Operations" }] } },
      url: "https://notion.example/resource",
      parent: { type: "page_id", page_id: "cccc-cccc" },
      archived: false,
      last_edited_time: "2026-09-17T00:00:00.000Z",
    }), { status: 200 });
  };

  const snapshot = await buildSnapshot({ sourceMap, token: "test-token", fetchImpl });
  assert.equal(snapshot.schema_version, 2);
  assert.equal(snapshot.content_exported, false);
  assert.equal(snapshot.resource_count, 2);
  assert.equal(calls.filter((url) => url.includes("/pages/")).length, 1);
  assert.equal(calls.filter((url) => url.includes("/databases/")).length, 1);
  assert.deepEqual(snapshot.resources[0].parent, { type: "page_id", id: "cccccccc" });
  assert.ok(snapshot.content_hash.match(/^[0-9a-f]{64}$/));
});
