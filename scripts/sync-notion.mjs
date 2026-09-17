import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const NOTION_VERSION = "2022-06-28";
const MAX_ATTEMPTS = 3;

export function parseSourceMap(sourceMap) {
  const resources = [];
  for (const line of sourceMap.split("\n")) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*`([0-9a-f]{32})`\s*\|\s*(Page|Database)\s*\|/i);
    if (!match) continue;
    resources.push({
      canonical_name: match[1].trim(),
      id: match[2].toLowerCase(),
      type: match[3].toLowerCase(),
    });
  }
  return [...new Map(resources.map((resource) => [resource.id, resource])).values()]
    .sort((left, right) => left.id.localeCompare(right.id));
}

function safeTitle(object) {
  if (object.object === "page") {
    const property = Object.values(object.properties ?? {}).find((value) => value?.type === "title");
    return property?.title?.map((part) => part.plain_text).join("") || "Untitled page";
  }
  return object.title?.map((part) => part.plain_text).join("") || "Untitled database";
}

export function normalizeParent(parent = {}) {
  const type = parent.type ?? "unknown";
  if (type === "workspace") return { type, workspace: Boolean(parent.workspace) };
  const id = parent[type];
  return id ? { type, id: id.replaceAll("-", "") } : { type };
}

function retryDelayMs(response) {
  const retryAfter = Number(response.headers.get("retry-after"));
  return Number.isFinite(retryAfter) && retryAfter >= 0
    ? Math.min(retryAfter * 1000, 60_000)
    : 1000;
}

export async function fetchWithRetry(url, options, fetchImpl = fetch, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetchImpl(url, options);
    if (response.status !== 429 || attempt === MAX_ATTEMPTS) return response;
    await sleep(retryDelayMs(response));
  }
  throw new Error("Unreachable retry state");
}

export async function fetchResource(resource, token, fetchImpl = fetch, sleep) {
  const endpoint = resource.type === "database" ? "databases" : "pages";
  const response = await fetchWithRetry(
    `https://api.notion.com/v1/${endpoint}/${resource.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
      },
    },
    fetchImpl,
    sleep,
  );

  if (!response.ok) {
    throw new Error(`Notion ${endpoint}/${resource.id} returned ${response.status}`);
  }

  const object = await response.json();
  return {
    canonical_name: resource.canonical_name,
    id: object.id.replaceAll("-", ""),
    object: object.object,
    title: safeTitle(object),
    url: object.url,
    parent: normalizeParent(object.parent),
    archived: Boolean(object.archived),
    last_edited_time: object.last_edited_time,
  };
}

export async function buildSnapshot({ sourceMap, token, fetchImpl = fetch, sleep }) {
  const sourceResources = parseSourceMap(sourceMap);
  if (!sourceResources.length) {
    throw new Error("No typed immutable Notion resources found in docs/NOTION-SOURCE-MAP.md");
  }

  const resources = [];
  for (const resource of sourceResources) {
    resources.push(await fetchResource(resource, token, fetchImpl, sleep));
  }

  const snapshot = {
    schema_version: 2,
    generated_at: new Date().toISOString(),
    source: "Notion metadata API",
    content_exported: false,
    resource_count: resources.length,
    resources,
  };
  const canonical = JSON.stringify({ ...snapshot, generated_at: null });
  snapshot.content_hash = createHash("sha256").update(canonical).digest("hex");
  return snapshot;
}

export async function main() {
  const token = process.env.NOTION_API_TOKEN;
  if (!token) throw new Error("NOTION_API_TOKEN is required");

  const sourceMap = await readFile("docs/NOTION-SOURCE-MAP.md", "utf8");
  const snapshot = await buildSnapshot({ sourceMap, token });
  await mkdir("generated/notion", { recursive: true });
  await writeFile("generated/notion/manifest.json", `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${snapshot.resource_count} redacted Notion metadata records`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
